import { MODE_EDIT, MODE_PAN, Model } from "./model";
import { View } from "./view";

/// Translates user input (mouse and keyboard) into model mutations, then tells
/// the view to re-sync/render. Space toggles the animation loop (a view concern).
export class Controller {
    private model: Model;
    private view: View;
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private lastToggled: [number, number] = [-1, -1];

    constructor(model: Model, view: View) {
        this.model = model;
        this.view = view;
    }

    /// Attach all DOM event listeners (canvas, keyboard, and UI controls).
    /// Call once after constructing.
    init() {
        const canvas = this.view.canvas;
        canvas.addEventListener("wheel", (e) => this.onWheel(e));
        canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        canvas.addEventListener("mouseup", () => { this.isDragging = false; });
        window.addEventListener("keydown", (e) => this.onKeyDown(e));

        this.bindControls();
    }

    /// Wire the toolbar/UI control elements to model mutations.
    private bindControls() {
        const d = (id: string) => document.getElementById(id)!;

        d('mode-pan').addEventListener('click', () => {
            this.view.stopPlay();
            this.model.setMode(MODE_PAN);
            this.view.sync();
        });
        d('mode-edit').addEventListener('click', () => {
            this.view.stopPlay();
            this.model.setMode(MODE_EDIT);
            this.view.sync();
        });
        d('mode-play').addEventListener('click', () => this.view.togglePlay());

        const statsBtn = d('stats-toggle') as HTMLButtonElement;
        statsBtn.addEventListener('click', () => {
            this.model.toggleStats();
            this.view.sync();
            statsBtn.blur();
        });

        d('pattern-toggle').addEventListener('click', () => {
            this.view.togglePatternPane();
        });

        const fpsToggle = d('fps-toggle') as HTMLButtonElement;
        fpsToggle.addEventListener('click', () => {
            this.model.toggleGPS();
            this.view.sync();
            fpsToggle.blur();
        });

        const fpsSlider = d('fps-slider') as HTMLInputElement;
        fpsSlider.addEventListener('input', () => {
            const val = Number(fpsSlider.value);
            const snapped = val > 60 ? Math.round(val / 60) * 60 : val;
            fpsSlider.value = String(snapped);
            this.model.setGPSTarget(snapped);
            this.view.sync();
        });

        const stepAmount = d('step-amount') as HTMLInputElement;
        const handleStep = () => {
            const n = Math.max(1, Math.floor(Number(stepAmount.value) || 1));
            this.model.step(n);
            this.view.render();
        };
        d('step-btn').addEventListener('click', handleStep);
        stepAmount.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleStep();
        });

        window.addEventListener('resize', () => {
            let width = Math.round(d('canvas-container').clientWidth / 10) * 10;
            let height = Math.round(d('canvas-container').clientHeight / 10) * 10;
            this.view.setCanvasDimensions(width, height);
            this.view.render();
        });
    }

    private onMouseDown(e: MouseEvent) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        if (this.model.mode === MODE_EDIT) {
            const [x, y] = this.view.screenToWorld(e.clientX, e.clientY);
            if (this.model.activePattern !== null) {
                // Place the selected pattern with its top-left at the cursor,
                // then clear it so the click is one-shot.
                this.model.placePattern(x, y, this.model.activePattern.cells);
                this.model.setActivePattern(null);
            } else {
                this.model.toggleCell(x, y);
            }
            this.view.render();
        }
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.isDragging) return;

        if (this.model.mode === MODE_PAN) {
            const dx = e.clientX - this.dragStartX;
            const dy = e.clientY - this.dragStartY;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            this.model.panByPixels(dx, dy);
            this.view.render();
        } else if (this.model.mode === MODE_EDIT) {
            const [x, y] = this.view.screenToWorld(e.clientX, e.clientY);
            if (x === this.lastToggled[0] && y === this.lastToggled[1]) return;
            this.model.toggleCell(x, y);
            this.lastToggled = [x, y];
            this.view.render();
        }
    }

    private onWheel(e: WheelEvent) {
        const factor = e.deltaY > 0 ? 1.1 : 0.9;
        this.model.zoomAt(e.clientX, e.clientY, this.view.canvas.width, this.view.canvas.height, factor);
        this.view.render();
    }

    private onKeyDown(e: KeyboardEvent) {
        switch (e.code) {
            case "Space":
                e.preventDefault();
                this.view.togglePlay();
                break;
            case "KeyI":
            case "KeyE":
                this.model.toggleMode();
                this.view.sync();
                break;
            case "Escape":
                this.model.setMode(MODE_PAN);
                this.view.sync();
                break;
            case "KeyR":
                if (this.model.mode === MODE_EDIT) {
                    this.model.clearUniverse();
                    this.view.render();
                }
                break;
            default:
                break;
        }
    }
}