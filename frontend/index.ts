// Load the WebAssembly module
import {memory} from 'wasm-crate/life_new_bg.wasm';
import { Universe } from 'wasm-crate/life_new';
import './styles/styles.css';

const levels = 10;

const numRows = 1<<levels;
const numCols = 1<<levels;

const universe = Universe.new(levels + 1);
let grid: Uint8Array;

function update_grid() {
    let cell_ptr = universe.get_cells();
    grid = new Uint8Array(memory.buffer, cell_ptr, numRows * numRows);
}

function to_index(x: number, y: number) {
    return x * numRows + y;
}


const canvas: HTMLCanvasElement = document.getElementById('game-of-life-canvas')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const container = document.getElementById('canvas-container')! as HTMLElement;

const BLOCK_WIDTH = 10;
canvas.width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
canvas.height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;

let mode = "EDIT"
let animation_id:number | null = null;

const UNIVERSE_WIDTH = BLOCK_WIDTH * numCols;
const UNIVERSE_HEIGHT = BLOCK_WIDTH * numRows;
const MAX_ZOOM_F = 10;
const MIN_ZOOM_F = 4;

let vp_ox = 0;
let vp_oy = 0;
let vp_w = (128) * BLOCK_WIDTH;
let vp_h = vp_w * canvas.height / canvas.width;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function drawGrid() {
    update_grid()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    let x_start = Math.ceil(vp_ox / BLOCK_WIDTH) * BLOCK_WIDTH - vp_ox;
    let y_start = Math.ceil(vp_oy / BLOCK_WIDTH) * BLOCK_WIDTH - vp_oy;

    let k = canvas.width / vp_w;

    let transformed_block_width = BLOCK_WIDTH * k;
    for (let x = k * x_start; x < vp_w * k; x += transformed_block_width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, k * vp_h);
    }

    for (let y = k * y_start; y < vp_h * k; y += transformed_block_width) {
        ctx.moveTo(0, y);
        ctx.lineTo(k * vp_w, y);
    }
    ctx.strokeStyle = "#CCCCCC";
    ctx.stroke();
    drawCells()
}

function drawCells() {
    let x_ind = Math.floor(vp_ox / BLOCK_WIDTH);
    let x_coord_start = x_ind * BLOCK_WIDTH - vp_ox;

    let y_ind = Math.floor(vp_oy / BLOCK_WIDTH);
    let y_ind_start = y_ind;
    let y_coord_start = y_ind * BLOCK_WIDTH - vp_oy;

    let k = canvas.width / vp_w;
    let transformed_block_width = BLOCK_WIDTH * k;

    for (let x = k * x_coord_start; x < vp_w * k; x += transformed_block_width) {
        for (let y = k * y_coord_start; y < vp_h * k; y += transformed_block_width) {
            if (grid[to_index(x_ind, y_ind)] == 1) ctx.fillRect(x, y, k * BLOCK_WIDTH, k * BLOCK_WIDTH);
            y_ind++;
        }
        y_ind = y_ind_start;
        x_ind++;
    }
}

function locToIndex(x: number, y: number) {
    let k = canvas.width / vp_w;
    let transformed_block_width = k * BLOCK_WIDTH;
    let base_x = vp_ox / BLOCK_WIDTH;
    let base_y = vp_oy / BLOCK_WIDTH;

    let diff_x = x / transformed_block_width
    let diff_y = y / transformed_block_width

    return [Math.floor(base_x + diff_x), Math.floor(base_y + diff_y)];
}

function handleWheel(event: WheelEvent) {
    const wheelDelta = event.deltaY > 0 ? -0.1 : 0.1;
    let deltaX = wheelDelta * vp_w;
    let deltaY = wheelDelta * vp_h;
    if (vp_w - deltaX > UNIVERSE_WIDTH / MIN_ZOOM_F || vp_w - deltaX < MAX_ZOOM_F * BLOCK_WIDTH
        || vp_h - deltaY > UNIVERSE_HEIGHT / MIN_ZOOM_F || vp_h - deltaY < MAX_ZOOM_F * BLOCK_WIDTH) { }
    else {
        vp_w -= deltaX;
        vp_h -= deltaY;
        vp_ox = clamp(vp_ox + deltaX / 2, UNIVERSE_WIDTH - vp_w, 0);
        vp_oy = clamp(vp_oy + deltaY / 2, UNIVERSE_HEIGHT - vp_h, 0);
    }
    drawGrid();
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.code === "Space") {
        if (animation_id === null) {
            console.log("Play");
            run();
        } else {
            console.log("Pause");
            cancelAnimationFrame(animation_id)
            animation_id = null;
        }
    }
}

function handleMouseDown(event: MouseEvent) {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;

    if (mode == "EDIT") {
        let [x, y] = locToIndex(event.clientX, event.clientY);
        universe.toggle(x, y);
        drawGrid();
    }
}

function handleMouseUp() {
    isDragging = false;
}

function clamp(x: number, max: number, min: number) {
    return Math.max(min, Math.min(x, max));
}

function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;
        let k = canvas.width / vp_w;
        vp_ox = clamp(vp_ox - deltaX / k, UNIVERSE_WIDTH - vp_w, 0);
        vp_oy = clamp(vp_oy - deltaY / k, UNIVERSE_HEIGHT - vp_h, 0);
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        drawGrid();
    }
}

canvas.addEventListener('wheel', handleWheel);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
window.addEventListener('resize', () => {
    canvas.width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
    canvas.height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;
    drawGrid();
});
window.addEventListener('keydown' , handleKeyDown);

async function run() {
    universe.tick();
    drawGrid();
    animation_id = requestAnimationFrame(run);
}

drawGrid();
