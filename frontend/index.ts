// Load the WebAssembly module
// import init, { Universe, Cell } from './game_of_life.js';
import './styles/styles.css';

const numRows = 1024;
const numCols = 1024;

const my_grid: number[][] = [];
for (let i = 0; i < numRows; i++) {
    my_grid[i] = [];
    for (let j = 0; j < numCols; j++) {
        my_grid[i][j] = 0;
        if ((i * j) % 7 == 0) my_grid[i][j] = 1;
    }
}

const canvas: HTMLCanvasElement = document.getElementById('game-of-life-canvas')! as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
const container = document.getElementById('canvas-container')! as HTMLElement;

const BLOCK_WIDTH = 10;
canvas.width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
canvas.height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;

let mode = "EDIT"
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
            if (my_grid[x_ind][y_ind] == 1) ctx.fillRect(x, y, k * BLOCK_WIDTH, k * BLOCK_WIDTH);
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

    return [ Math.floor(base_x + diff_x), Math.floor(base_y + diff_y) ];
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


function handleMouseDown(event: MouseEvent) {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;

    if (mode == "EDIT") {
        let [x,y] = locToIndex(event.clientX, event.clientY);
        my_grid[x][y] = 1-my_grid[x][y];
        drawGrid();
    }
}

function clamp(x: number, max: number, min: number) {
    return Math.max(min, Math.min(x, max));
}

function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;
        let k = canvas.width / vp_w;
        vp_ox = clamp(vp_ox - deltaX/k, UNIVERSE_WIDTH - vp_w, 0);
        vp_oy = clamp(vp_oy - deltaY/k, UNIVERSE_HEIGHT - vp_h, 0);
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        drawGrid();
    }
}

function handleMouseUp() {
    isDragging = false;
}

async function run() {

    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', () => { 
        canvas.width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
        canvas.height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;
        drawGrid();
    });
    drawGrid();
}

run();

