import { Universe } from "wasm-crate";
import { Pattern } from "./patterns";

export const MODE_PAN = "PAN";
export const MODE_EDIT = "EDIT";

export const MIN_SCALE = 1e-3;
export const MAX_SCALE = 100;

function clamp(x: number, max: number, min: number): number {
    return Math.max(min, Math.min(x, max));
}

/// Owns all application state. It knows nothing about the DOM or canvas:
/// controllers mutate it, the view reads it to render.
export class Model {
    universe: Universe;

    mode: string = MODE_PAN;

    // Pattern selected in the sidebar for placement (null = none). When set,
    // the next edit-mode click places it with its top-left at the cursor.
    activePattern: Pattern | null = null;

    // Camera in world (cell) coordinates. scale = screen pixels per world cell.
    center_x = 0;
    center_y = 0;
    scale: number;

    gps_enabled = false;
    gps_target = 60;
    show_stats = false;

    // Frame-timing samples used to compute FPS stats.
    private frames: number[] = [];
    private lastFrameTimeStamp = 0;

    constructor(levels: number, pixels_per_cell: number) {
        this.universe = Universe.new(levels);
        this.scale = pixels_per_cell;
        this.lastFrameTimeStamp = performance.now();
    }

    /// Record one animation frame's timing and update the rolling stats.
    /// Returns the computed stats for the view to display.
    recordFrame(): { latest: number; mean: number; min: number; max: number } {
        const now = performance.now();
        const delta = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        const fps = 1 / delta * 1000;

        this.frames.push(fps);
        if (this.frames.length > 100) {
            this.frames.shift();
        }

        let min = Infinity;
        let max = -Infinity;
        let sum = 0;
        for (let i = 0; i < this.frames.length; i++) {
            sum += this.frames[i];
            min = Math.min(this.frames[i], min);
            max = Math.max(this.frames[i], max);
        }

        return { latest: fps, mean: sum / this.frames.length, min, max };
    }

    setMode(mode: string) {
        this.mode = mode;
    }

    setActivePattern(pattern: Pattern | null) {
        this.activePattern = pattern;
        // Selecting a pattern is an intent to place it; enter edit mode.
        if (pattern !== null) {
            this.mode = MODE_EDIT;
        }
    }

    toggleMode() {
        this.mode = this.mode === MODE_EDIT ? MODE_PAN : MODE_EDIT;
    }

    toggleStats() {
        this.show_stats = !this.show_stats;
    }

    toggleGPS() {
        this.gps_enabled = !this.gps_enabled;
    }

    setGPSTarget(v: number) {
        this.gps_target = v;
    }

    clearUniverse() {
        this.universe.reset();
    }

    step(n: number) {
        this.universe.step(n);
    }

    toggleCell(x: number, y: number) {
        this.universe.toggle(x, y);
    }

    placePattern(x: number, y: number, cells: [number, number][]) {
        for (const [dx, dy] of cells) {
            this.universe.toggle(x + dx, y + dy);
        }
    }

    panByPixels(dx: number, dy: number) {
        this.center_x -= dx / this.scale;
        this.center_y -= dy / this.scale;
    }

    /// Map a screen (client) point to the world cell under the cursor.
    screenToWorld(x: number, y: number, canvasW: number, canvasH: number): [number, number] {
        const wx = this.center_x + (x - canvasW / 2) / this.scale;
        const wy = this.center_y + (y - canvasH / 2) / this.scale;
        return [Math.floor(wx), Math.floor(wy)];
    }

    /// Zoom by `factor` (0.9 = zoom in, 1.1 = zoom out) keeping the world point
    /// under the screen cursor fixed.
    zoomAt(x: number, y: number, canvasW: number, canvasH: number, factor: number) {
        const wx = this.center_x + (x - canvasW / 2) / this.scale;
        const wy = this.center_y + (y - canvasH / 2) / this.scale;
        this.scale = clamp(this.scale / factor, MAX_SCALE, MIN_SCALE);
        this.center_x = wx - (x - canvasW / 2) / this.scale;
        this.center_y = wy - (y - canvasH / 2) / this.scale;
    }
}