import { Universe } from "wasm-crate";
import { memory } from "wasm-crate/life_new_bg.wasm";

export const MODE_PAN = "PAN";
export const MODE_EDIT = "EDIT";
export const MODE_PLAY = "PLAY";

export class View {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public universe: Universe;
    public animation_id: number | null;

    // The wasm render buffer is kept at half the canvas resolution and scaled
    // up 2x when blitted, cutting rasterization cost ~4x.
    public bufW: number;
    public bufH: number;
    private offscreen: HTMLCanvasElement;
    private offscreenCtx: CanvasRenderingContext2D;

    // Viewport expressed in world (cell) coordinates.
    // center is the world cell at the canvas center.
    public center_x: number;
    public center_y: number;
    // scale: screen pixels per world cell. Zoom in raises it, zoom out lowers it.
    public scale: number;

    public levels: number;
    public MODE: string = MODE_PAN;
    private panBtn: HTMLButtonElement;
    private editBtn: HTMLButtonElement;
    private playBtn: HTMLButtonElement;
    private fpsRenderFn: (() => void) | null = null;

    constructor(id: string, width: number, height: number, pixels_per_cell: number, levels: number) {
        this.canvas = document.getElementById(id)! as HTMLCanvasElement
        this.canvas.height = height;
        this.canvas.width = width;
        this.animation_id = null;

        this.ctx = this.canvas.getContext('2d')!;
        this.offscreen = document.createElement('canvas');
        this.offscreenCtx = this.offscreen.getContext('2d')!;
        this.levels = levels;

        this.panBtn = document.getElementById('mode-pan')! as HTMLButtonElement;
        this.editBtn = document.getElementById('mode-edit')! as HTMLButtonElement;
        this.playBtn = document.getElementById('mode-play')! as HTMLButtonElement;
        this.panBtn.addEventListener('click', () => { this._stopPlay(); this.setMode(MODE_PAN); });
        this.editBtn.addEventListener('click', () => { this._stopPlay(); this.setMode(MODE_EDIT); });
        this.playBtn.addEventListener('click', () => this.togglePlay());

        this.bufW = Math.ceil(width / 2);
        this.bufH = Math.ceil(height / 2);
        this.offscreen.width = this.bufW;
        this.offscreen.height = this.bufH;
        // The fixed RGBA buffer lives inside wasm at half the canvas resolution.
        this.universe = Universe.new(levels, this.bufW, this.bufH);

        this.center_x = 0;
        this.center_y = 0;
        this.scale = pixels_per_cell;
    }

    setCanvasDimensions(width: number, height: number) {
        // The wasm buffer is fixed at the (half) canvas resolution, so resizing
        // means reallocating the buffer via a fresh universe (sim state resets).
        this.canvas.width = width;
        this.canvas.height = height;
        this.bufW = Math.ceil(width / 2);
        this.bufH = Math.ceil(height / 2);
        this.offscreen.width = this.bufW;
        this.offscreen.height = this.bufH;
        this.universe = Universe.new(this.levels, this.bufW, this.bufH);
    }

    setMode(mode: string) {
        this.MODE = mode;
        this.panBtn.classList.toggle('active', mode === MODE_PAN);
        this.editBtn.classList.toggle('active', mode === MODE_EDIT);
    }

    togglePlay() {
        if (this.animation_id !== null) {
            cancelAnimationFrame(this.animation_id);
            this.animation_id = null;
            this.playBtn.classList.remove('active');
        } else {
            this.setMode(MODE_PAN);
            this._startPlay();
            this.playBtn.classList.add('active');
        }
    }

    private _stopPlay() {
        if (this.animation_id !== null) {
            cancelAnimationFrame(this.animation_id);
            this.animation_id = null;
            this.playBtn.classList.remove('active');
        }
    }

    private _startPlay() {
        const self = this;
        function tick() {
            self.universe.tick();
            if (self.fpsRenderFn) self.fpsRenderFn();
            self.render();
            self.animation_id = requestAnimationFrame(tick);
        }
        tick();
    }

    setFPSRenderFn(fn: () => void) {
        this.fpsRenderFn = fn;
    }

    /// Map a screen (client) point to the world cell under the cursor.
    screenToWorld(x: number, y: number): [number, number] {
        const wx = this.center_x + (x - this.canvas.width / 2) / this.scale;
        const wy = this.center_y + (y - this.canvas.height / 2) / this.scale;
        return [Math.floor(wx), Math.floor(wy)];
    }

    /// Rasterize the visible viewport into the wasm buffer, then upscale and
    /// blit it to the canvas in a single drawImage — no per-cell drawing.
    render() {
        const vpw = this.canvas.width;
        const vph = this.canvas.height;
        // Visible extent in world cells.
        const half_w = vpw / (2 * this.scale);
        const half_h = vph / (2 * this.scale);

        const nw_x = Math.floor(this.center_x - half_w);
        const nw_y = Math.floor(this.center_y - half_h);
        const se_x = Math.ceil(this.center_x + half_w);
        const se_y = Math.ceil(this.center_y + half_h);

        const ptr = this.universe.rasterize(nw_x, nw_y, se_x, se_y);
        // Rebuild the view from memory.buffer each frame (wasm memory may grow).
        const img = new ImageData(
            new Uint8ClampedArray(memory.buffer, ptr, this.bufW * this.bufH * 4),
            this.bufW,
            this.bufH,
        );
        this.offscreenCtx.putImageData(img, 0, 0);
        // Nearest-neighbor 2x upscale for crisp cells.
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(this.offscreen, 0, 0, this.bufW, this.bufH, 0, 0, vpw, vph);
    }

    clearUniverse() {
        this.universe.reset();
        this.render();
    }
}