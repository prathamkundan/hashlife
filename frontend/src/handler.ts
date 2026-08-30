import { MODE_EDIT, MODE_PAN, View } from "./canvas";

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

        if (view.MODE == MODE_PAN && this.isDragging) {
            const deltaX = event.clientX - this.dragStartX;
            const deltaY = event.clientY - this.dragStartY;
            // Grab: content follows the cursor.
            view.center_x -= deltaX / view.scale;
            view.center_y -= deltaY / view.scale;
            this.dragStartX = event.clientX;
            this.dragStartY = event.clientY;
            view.render();
        } else if (view.MODE == MODE_EDIT && this.isDragging) {
            let [x, y] = view.screenToWorld(event.clientX, event.clientY);
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

        if (view.MODE == MODE_EDIT) {
            let [x, y] = view.screenToWorld(event.clientX, event.clientY);
            view.universe.toggle(x, y);
            view.render();
        }
    }

    handleWheel = (event: WheelEvent) => {
        const canvas = this.view.canvas;
        const view = this.view;
        const wheelDelta = event.deltaY > 0 ? 1.1 : 0.9;

        const wx = view.center_x + (event.clientX - canvas.width / 2) / view.scale;
        const wy = view.center_y + (event.clientY - canvas.height / 2) / view.scale;

        view.scale = clamp(view.scale / wheelDelta, 100, 1e-3);

        // Keep the world point under the cursor fixed while zooming.
        view.center_x = wx - (event.clientX - canvas.width / 2) / view.scale;
        view.center_y = wy - (event.clientY - canvas.height / 2) / view.scale;

        view.render();
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