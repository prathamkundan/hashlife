import { alloc_buffer, free_buffer } from "wasm-crate";
import { memory } from "wasm-crate/life_new_bg.wasm";
import { MODE_EDIT, MODE_PAN, Model } from "./model";
import { PRESET_PATTERNS } from "./patterns";

/// Renders the model to the canvas and keeps the UI controls in sync with it.
/// The view never mutates the model; it only reads it.
export class View {
    model: Model;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    animation_id: number | null = null;

    // The wasm render buffer is kept at half the canvas resolution and scaled
    // up 2x when blitted, cutting rasterization cost ~4x.
    bufW: number;
    bufH: number;
    bufPtr: number;
    private bufLen: number;
    private offscreen: HTMLCanvasElement;
    private offscreenCtx: CanvasRenderingContext2D;

    private fpsToggleBtn: HTMLButtonElement;
    private fpsSlider: HTMLInputElement;
    private fpsLabel: HTMLElement;
    private statsToggleBtn: HTMLButtonElement;
    private panBtn: HTMLButtonElement;
    private editBtn: HTMLButtonElement;
    private playBtn: HTMLButtonElement;
    private statsDisplay: HTMLElement;
    private _lastTickStart = 0;

    // Pattern sidebar elements.
    private patternToggle: HTMLButtonElement;
    private patternPane: HTMLElement;
    private patternList: HTMLElement;

    constructor(model: Model, id: string, width: number, height: number) {
        this.model = model;
        this.canvas = document.getElementById(id)! as HTMLCanvasElement;
        this.canvas.height = height;
        this.canvas.width = width;

        this.ctx = this.canvas.getContext('2d')!;
        this.offscreen = document.createElement('canvas');
        this.offscreenCtx = this.offscreen.getContext('2d')!;

        this.panBtn = document.getElementById('mode-pan')! as HTMLButtonElement;
        this.editBtn = document.getElementById('mode-edit')! as HTMLButtonElement;
        this.playBtn = document.getElementById('mode-play')! as HTMLButtonElement;
        this.fpsToggleBtn = document.getElementById('fps-toggle')! as HTMLButtonElement;
        this.fpsSlider = document.getElementById('fps-slider')! as HTMLInputElement;
        this.fpsLabel = document.getElementById('fps-label')! as HTMLElement;
        this.statsToggleBtn = document.getElementById('stats-toggle')! as HTMLButtonElement;
        this.statsDisplay = document.getElementById('sim-stats')! as HTMLElement;

        this.patternToggle = document.getElementById('pattern-toggle')! as HTMLButtonElement;
        this.patternPane = document.getElementById('pattern-pane')! as HTMLElement;
        this.patternList = document.getElementById('pattern-list')! as HTMLElement;

        this.bufW = Math.ceil(width / 2);
        this.bufH = Math.ceil(height / 2);
        this.offscreen.width = this.bufW;
        this.offscreen.height = this.bufH;
        this.bufLen = this.bufW * this.bufH * 4;
        this.bufPtr = alloc_buffer(this.bufLen);

        this.buildPatternList();

        this.sync();
    }

    setCanvasDimensions(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.bufW = Math.ceil(width / 2);
        this.bufH = Math.ceil(height / 2);
        this.offscreen.width = this.bufW;
        this.offscreen.height = this.bufH;
        // Reallocate the render buffer; the universe state is preserved.
        free_buffer(this.bufPtr, this.bufLen);
        this.bufLen = this.bufW * this.bufH * 4;
        this.bufPtr = alloc_buffer(this.bufLen);
    }

    /// Map a screen point to the world cell under the cursor, using model camera
    /// state plus the canvas dimensions.
    screenToWorld(x: number, y: number): [number, number] {
        return this.model.screenToWorld(x, y, this.canvas.width, this.canvas.height);
    }

    /// Record the current frame in the model and render the FPS/generation
    /// stats overlay from the model's stats state.
    renderStats() {
        const stats = this.model.recordFrame();
        this.statsDisplay.textContent = `Sim Stats
Gen: ${this.model.universe.generation()}
latest = ${Math.round(stats.latest)}
avg of last 100 = ${Math.round(stats.mean)}
min of last 100 = ${Math.round(stats.min)}
max of last 100 = ${Math.round(stats.max)}
`.trim();
    }

    /// Build the sidebar pattern list. Clicking a pattern arms it for placement.
    buildPatternList() {
        this.patternList.textContent = "";
        for (const pattern of PRESET_PATTERNS) {
            const btn = document.createElement('button');
            btn.className = 'pattern-item';
            btn.textContent = `${pattern.name} (${pattern.width}x${pattern.height})`;
            btn.addEventListener('click', () => {
                this.model.setActivePattern(pattern);
                this.sync();
                this.render();
            });
            this.patternList.appendChild(btn);
        }
    }

    /// Toggle the sidebar pane open/closed.
    togglePatternPane() {
        const open = this.patternPane.classList.contains('open');
        if (open) {
            this.patternPane.classList.remove('open');
            this.patternToggle.textContent = "❯";
        } else {
            this.patternPane.classList.add('open');
            this.patternToggle.textContent = "❮";
        }
    }

    /// Sync the sidebar's active-pattern highlight.
    syncPatterns() {
        const active = this.model.activePattern;
        Array.prototype.forEach.call(this.patternList.querySelectorAll('.pattern-item'), (btn: Element) => {
            const isActive = active !== null && btn.textContent!.startsWith(active.name);
            btn.classList.toggle('active', isActive);
        });
        this.editBtn.textContent = this.model.activePattern !== null
            ? `Place ${this.model.activePattern.name}`
            : "Edit";
    }

    togglePlay() {
        if (this.animation_id !== null) {
            this.stopPlay();
        } else {
            this.model.setMode(MODE_PAN);
            this.sync();
            this._startPlay();
            this.playBtn.classList.add('active');
        }
    }

    stopPlay() {
        if (this.animation_id !== null) {
            cancelAnimationFrame(this.animation_id);
            this.animation_id = null;
            this.playBtn.classList.remove('active');
        }
    }

    private _startPlay() {
        const self = this;
        function tick() {
            if (self.shouldTick()) {
                self.model.universe.step(self.getGenerationStep());
                self._lastTickStart = performance.now();
            }
            self.renderStats();
            self.render();
            self.animation_id = requestAnimationFrame(tick);
        }
        tick();
    }

    /// Rasterize the visible viewport into the wasm buffer, then upscale and
    /// blit it to the canvas in a single drawImage — no per-cell drawing.
    render() {
        const vpw = this.canvas.width;
        const vph = this.canvas.height;
        // Visible extent in world cells.
        const half_w = vpw / (2 * this.model.scale);
        const half_h = vph / (2 * this.model.scale);

        const nw_x = Math.floor(this.model.center_x - half_w);
        const nw_y = Math.floor(this.model.center_y - half_h);
        const se_x = Math.ceil(this.model.center_x + half_w);
        const se_y = Math.ceil(this.model.center_y + half_h);

        this.model.universe.rasterize(nw_x, nw_y, se_x, se_y, this.bufW, this.bufH, this.bufPtr, this.bufLen);
        // Rebuild the view from memory.buffer each frame (wasm memory may grow).
        const img = new ImageData(
            new Uint8ClampedArray(memory.buffer, this.bufPtr, this.bufLen),
            this.bufW,
            this.bufH,
        );
        this.offscreenCtx.putImageData(img, 0, 0);
        // Nearest-neighbor 2x upscale for crisp cells.
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(this.offscreen, 0, 0, this.bufW, this.bufH, 0, 0, vpw, vph);
    }

    /// Push the model's state out to the DOM controls. Controllers call this
    /// after mutating the model. The stats overlay visibility is driven purely
    /// by model.show_stats, so it stays correctly hidden until enabled.
    sync() {
        this.panBtn.classList.toggle('active', this.model.mode === MODE_PAN);
        this.editBtn.classList.toggle('active', this.model.mode === MODE_EDIT);
        this.statsDisplay.style.display = this.model.show_stats ? "block" : "none";
        this.statsToggleBtn.classList.toggle('active', this.model.show_stats);
        this.fpsToggleBtn.textContent = this.model.gps_enabled ? "GPS: ON" : "GPS: OFF";
        this.fpsSlider.disabled = !this.model.gps_enabled;
        this.fpsSlider.style.display = this.model.gps_enabled ? "" : "none";
        this.fpsLabel.style.display = this.model.gps_enabled ? "" : "none";
        this.fpsLabel.textContent = `${this.model.gps_target} gps`;
        this.fpsSlider.value = String(this.model.gps_target);
        this.syncPatterns();
    }

    /// How many generations to advance per simulation tick.
    private getGenerationStep(): number {
        if (!this.model.gps_enabled) return 1;
        if (this.model.gps_target <= 60) return 1;
        return Math.round(this.model.gps_target / 60);
    }

    /// Returns true if enough time has passed to advance the simulation by one
    /// tick at the target gps. Keeps the render loop running at full frame rate
    /// so the UI stays smooth; simulation ticks are throttled separately.
    private shouldTick(): boolean {
        if (!this.model.gps_enabled) return true;
        if (this.model.gps_target >= 60) return true;
        const interval_ms = 1000 / this.model.gps_target;
        const elapsed = performance.now() - this._lastTickStart;
        return elapsed >= interval_ms;
    }
}