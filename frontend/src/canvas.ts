import { Universe } from "wasm-crate";
import { memory } from "wasm-crate/life_new_bg.wasm";

function clamp(x: number, max: number, min: number) {
    return Math.max(min, Math.min(x, max));
}

export class MouseHandler {
    private isDragging: Boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private lastToggled: number[] = [-1, -1];
    private view: View;

    constructor(view: View) {
        this.view = view;
    }

    handleMouseMove = (event: MouseEvent) => {
        const view = this.view;

        if (view.MODE == "NORMAL" && this.isDragging) {
            const deltaX = event.clientX - this.dragStartX;
            const deltaY = event.clientY - this.dragStartY;
            let k = view.canvas.width / view.vp_w;
            view.vp_ox = clamp(view.vp_ox - deltaX / k, view.UNIVERSE_WIDTH - view.vp_w, 0);
            view.vp_oy = clamp(view.vp_oy - deltaY / k, view.UNIVERSE_WIDTH - view.vp_h, 0);
            this.dragStartX = event.clientX;
            this.dragStartY = event.clientY;
            view.render();
        } else if (view.MODE == "INSERT" && this.isDragging) {
            let [x, y] = view.locToIndex(event.clientX, event.clientY);
            if ([x, y].toString() === this.lastToggled.toString()) return;
            view.universe.toggle(x, y);
            this.lastToggled = [x, y]
            view.render();
        }
    }

    handleMouseDown = (event: MouseEvent) => {
        const view = this.view;
        this.isDragging = true;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;

        if (view.MODE == "INSERT") {
            let [x, y] = view.locToIndex(event.clientX, event.clientY);
            view.universe.toggle(x, y);
            console.log(x, y)
            view.render();
        }
    }

    handleWheel = (event: WheelEvent) => {
        const canvas = this.view.canvas;
        const view = this.view;
        const wheelDelta = event.deltaY > 0 ? 1.1 : 0.9;
        let x = (event.clientX / canvas.width) * view.vp_w;
        let y = (event.clientY / canvas.height) * view.vp_h;
        if (view.vp_w * wheelDelta > this.view.UNIVERSE_WIDTH || view.vp_w * wheelDelta < 10 * this.view.BLOCK_WIDTH
            || view.vp_h * wheelDelta > view.UNIVERSE_WIDTH || view.vp_h * wheelDelta < 10 * view.BLOCK_WIDTH) {
        }
        else {
            view.vp_w *= wheelDelta;
            view.vp_h *= wheelDelta;
            let ny = (event.clientY / canvas.height) * view.vp_h;
            let nx = (event.clientX / canvas.width) * view.vp_w;
            let dx = x - nx;
            let dy = y - ny;
            view.vp_ox = clamp(view.vp_ox + dx, view.UNIVERSE_WIDTH - view.vp_w, 0);
            view.vp_oy = clamp(view.vp_oy + dy, view.UNIVERSE_WIDTH - view.vp_h, 0);
        }
        view.drawGrid();
    }

    handleMouseUp = () => {
        this.isDragging = false;
    }

    init() {
        this.view.canvas.addEventListener("wheel", this.handleWheel);
        this.view.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.view.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.view.canvas.addEventListener("mousemove", this.handleMouseMove);
    }
}

export class View {
    public canvas: HTMLCanvasElement;
    public mode_box: HTMLElement;
    public ctx: CanvasRenderingContext2D;
    public universe: Universe;
    public grid: Uint8Array | null;
    public animation_id: number | null;

    public vp_ox;
    public vp_oy;
    public vp_w: number;
    public vp_h: number;

    public UNIVERSE_WIDTH;
    public NUM_ROWS;
    public BLOCK_WIDTH;
    public MODE: string = "NORMAL"

    constructor(id: string, width: number, height: number, block_size: number, levels: number) {
        this.canvas = document.getElementById(id)! as HTMLCanvasElement
        this.mode_box = document.getElementById("mode-indicator")!;
        this.canvas.height = height;
        this.canvas.width = width;
        this.animation_id = null;

        this.ctx = this.canvas.getContext('2d')!;
        this.universe = Universe.new(levels + 1);
        this.grid = null;

        this.vp_ox = 0;
        this.vp_oy = 0;
        this.vp_w = this.canvas.width;
        this.vp_h = this.canvas.height;

        this.BLOCK_WIDTH = block_size;
        this.NUM_ROWS = 1 << levels;
        this.UNIVERSE_WIDTH = block_size * this.NUM_ROWS;

        this.updateGrid();
    }

    setMode(mode: string) {
        this.MODE = mode;
        this.mode_box.innerText = "--" + mode + "--";
    }

    updateGrid() {
        let cell_ptr = this.universe.get_cells();
        this.grid = new Uint8Array(memory.buffer, cell_ptr, this.NUM_ROWS * this.NUM_ROWS);
    }


    drawGrid() {
        this.updateGrid()
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();

        let x_start = Math.ceil(this.vp_ox / this.BLOCK_WIDTH) * this.BLOCK_WIDTH - this.vp_ox;
        let y_start = Math.ceil(this.vp_oy / this.BLOCK_WIDTH) * this.BLOCK_WIDTH - this.vp_oy;

        let k = this.canvas.width / this.vp_w;

        let transformed_block_width = this.BLOCK_WIDTH * k;
        for (let x = k * x_start; x < this.vp_w * k; x += transformed_block_width) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, k * this.vp_h);
        }

        for (let y = k * y_start; y < this.vp_h * k; y += transformed_block_width) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(k * this.vp_w, y);
        }
        this.ctx.strokeStyle = "#212020";
        this.ctx.stroke();
        this.drawCells()
    }

    drawCells() {
        let x_ind = Math.floor(this.vp_ox / this.BLOCK_WIDTH);
        let x_coord_start = x_ind * this.BLOCK_WIDTH - this.vp_ox;

        let y_ind = Math.floor(this.vp_oy / this.BLOCK_WIDTH);
        let y_ind_start = y_ind;
        let y_coord_start = y_ind * this.BLOCK_WIDTH - this.vp_oy;

        let k = this.canvas.width / this.vp_w;
        let transformed_block_width = this.BLOCK_WIDTH * k;
        const radius = k * this.BLOCK_WIDTH / 2;
        this.ctx.fillStyle = '#FFFFFF';

        for (let x = k * x_coord_start; x < this.vp_w * k; x += transformed_block_width) {
            for (let y = k * y_coord_start; y < this.vp_h * k; y += transformed_block_width) {
                if (this.grid![this.toIndex(x_ind, y_ind)] == 1) {
                    // this.ctx.fillRect(x, y, k * this.BLOCK_WIDTH, k * this.BLOCK_WIDTH);
                    let centerX = x + radius;
                    let centerY = y + radius;
                    // Draw filled circle
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, radius * 1.33333, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
                y_ind++;
            }
            y_ind = y_ind_start;
            x_ind++;
        }
    }

    locToIndex(x: number, y: number) {
        let k = this.canvas.width / this.vp_w;
        let transformed_block_width = k * this.BLOCK_WIDTH;
        let base_x = this.vp_ox / this.BLOCK_WIDTH;
        let base_y = this.vp_oy / this.BLOCK_WIDTH;

        let diff_x = x / transformed_block_width
        let diff_y = y / transformed_block_width

        return [Math.floor(base_x + diff_x), Math.floor(base_y + diff_y)];
    }

    toIndex(x: number, y: number) {
        return x * this.NUM_ROWS + y;
    }

    clearUniverse() {
        this.universe.reset();
        this.drawGrid();
    }

    public render() {
        this.drawGrid();
    }
}

