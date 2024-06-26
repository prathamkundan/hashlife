import { View } from "./canvas";

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
            // console.log(x, y)
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
