//
// // Load the WebAssembly module
// import { memory } from 'wasm-crate/life_new_bg.wasm';
// import { Universe } from 'wasm-crate/life_new';
// import '../styles/styles.css';
//
// const levels = 10;
//
// const numRows = 1 << levels;
// const numCols = 1 << levels;
//
// const universe = Universe.new(levels + 1);
// let grid: Uint8Array;
//
// function update_grid() {
//     let cell_ptr = universe.get_cells();
//     grid = new Uint8Array(memory.buffer, cell_ptr, numRows * numRows);
// }
//
// function to_index(x: number, y: number) {
//     return x * numRows + y;
// }
//
// const canvas: HTMLCanvasElement = document.getElementById('game-of-life-canvas')! as HTMLCanvasElement;
// const ctx = canvas.getContext('2d')!;
// const container = document.getElementById('canvas-container')! as HTMLElement;
//
// const BLOCK_WIDTH = 10;
// canvas.width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
// canvas.height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;
//
// let mode = "EDIT"
// let animation_id: number | null = null;
//
// const UNIVERSE_WIDTH = BLOCK_WIDTH * numCols;
// const UNIVERSE_HEIGHT = BLOCK_WIDTH * numRows;
// const MAX_ZOOM_F = 5;
// const MIN_ZOOM_F = 1;
//
// let ratio = canvas.width / canvas.height;
//
// let vp_ox = 0;
// let vp_oy = 0;
// let vp_w = (100) *BLOCK_WIDTH;
// let vp_h = vp_w / ratio;
//
// let isDragging = false;
// let dragStartX = 0;
// let dragStartY = 0;
//
// function drawGrid() {
//     update_grid()
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//
//     let x_start = Math.ceil(vp_ox / BLOCK_WIDTH) * BLOCK_WIDTH - vp_ox;
//     let y_start = Math.ceil(vp_oy / BLOCK_WIDTH) * BLOCK_WIDTH - vp_oy;
//
//     let k = canvas.width / vp_w;
//
//     let transformed_block_width = BLOCK_WIDTH * k;
//     for (let x = k * x_start; x < vp_w * k; x += transformed_block_width) {
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, k * vp_h);
//     }
//
//     for (let y = k * y_start; y < vp_h * k; y += transformed_block_width) {
//         ctx.moveTo(0, y);
//         ctx.lineTo(k * vp_w, y);
//     }
//     ctx.strokeStyle = "#CCCCCC";
//     ctx.stroke();
//     drawCells()
// }
//
// function drawCells() {
//     let x_ind = Math.floor(vp_ox / BLOCK_WIDTH);
//     let x_coord_start = x_ind * BLOCK_WIDTH - vp_ox;
//
//     let y_ind = Math.floor(vp_oy / BLOCK_WIDTH);
//     let y_ind_start = y_ind;
//     let y_coord_start = y_ind * BLOCK_WIDTH - vp_oy;
//
//     let k = canvas.width / vp_w;
//     let transformed_block_width = BLOCK_WIDTH * k;
//
//     for (let x = k * x_coord_start; x < vp_w * k; x += transformed_block_width) {
//         for (let y = k * y_coord_start; y < vp_h * k; y += transformed_block_width) {
//             if (grid[to_index(x_ind, y_ind)] == 1) ctx.fillRect(x, y, k * BLOCK_WIDTH, k * BLOCK_WIDTH);
//             y_ind++;
//         }
//         y_ind = y_ind_start;
//         x_ind++;
//     }
// }
//
// function locToIndex(x: number, y: number) {
//     let k = canvas.width / vp_w;
//     let transformed_block_width = k * BLOCK_WIDTH;
//     let base_x = vp_ox / BLOCK_WIDTH;
//     let base_y = vp_oy / BLOCK_WIDTH;
//
//     let diff_x = x / transformed_block_width
//     let diff_y = y / transformed_block_width
//
//     return [Math.floor(base_x + diff_x), Math.floor(base_y + diff_y)];
// }
//
// function handleWheel(event: WheelEvent) {
//     const wheelDelta = event.deltaY > 0 ? 1.1 : 0.9;
//     let x = (event.clientX / canvas.width) * vp_w;
//     let y = (event.clientY / canvas.height) * vp_h;
//     if (vp_w * wheelDelta > UNIVERSE_WIDTH / MIN_ZOOM_F || vp_w * wheelDelta < MAX_ZOOM_F * BLOCK_WIDTH
//         || vp_h * wheelDelta > UNIVERSE_HEIGHT / MIN_ZOOM_F || vp_h * wheelDelta < MAX_ZOOM_F * BLOCK_WIDTH) {
//     }
//     else {
//         vp_w *= wheelDelta;
//         vp_h *= wheelDelta;
//         let ny = (event.clientY / canvas.height) * vp_h;
//         let nx = (event.clientX / canvas.width) * vp_w;
//         let dx = x - nx;
//         let dy = y - ny;
//         vp_ox = clamp(vp_ox + dx, UNIVERSE_WIDTH - vp_w, 0);
//         vp_oy = clamp(vp_oy + dy, UNIVERSE_HEIGHT - vp_h, 0);
//     }
//     drawGrid();
// }
//
// function handleKeyDown(event: KeyboardEvent) {
//     if (event.code === "Space") {
//         if (animation_id === null) {
//             console.log("Play");
//             run();
//         } else {
//             console.log("Pause");
//             cancelAnimationFrame(animation_id)
//             animation_id = null;
//         }
//     }
// }
//
// function handleMouseDown(event: MouseEvent) {
//     isDragging = true;
//     dragStartX = event.clientX;
//     dragStartY = event.clientY;
//     let x = (event.clientX / canvas.width) * vp_w;
//     let y = (event.clientY / canvas.height) * vp_h;
//     // console.log("Click", x, y, x / y)
//
//     if (mode === "INSERT" && animation_id === null) {
//         let [x, y] = locToIndex(event.clientX, event.clientY);
//         universe.toggle(x, y);
//         console.log(x, y)
//         drawGrid();
//     }
// }
//
// function handleMouseUp() {
//     isDragging = false;
// }
//
// function clamp(x: number, max: number, min: number) {
//     return Math.max(min, Math.min(x, max));
// }
//
// function handleMouseMove(event: MouseEvent) {
//     if (isDragging) {
//         const deltaX = event.clientX - dragStartX;
//         const deltaY = event.clientY - dragStartY;
//         let k = canvas.width / vp_w;
//         vp_ox = clamp(vp_ox - deltaX / k, UNIVERSE_WIDTH - vp_w, 0);
//         vp_oy = clamp(vp_oy - deltaY / k, UNIVERSE_HEIGHT - vp_h, 0);
//         dragStartX = event.clientX;
//         dragStartY = event.clientY;
//         drawGrid();
//     }
// }
//
// canvas.addEventListener('wheel', handleWheel);
// canvas.addEventListener('mousedown', handleMouseDown);
// canvas.addEventListener('mousemove', handleMouseMove);
// canvas.addEventListener('mouseup', handleMouseUp);
// window.addEventListener('resize', () => {
//     canvas.width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
//     canvas.height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;
//     ratio = canvas.width / canvas.height;
//     vp_w = (128) * BLOCK_WIDTH;
//     vp_h = vp_w * canvas.height / canvas.width;
//     drawGrid();
// });
// window.addEventListener('keydown', handleKeyDown);
//
//
// class FPS {
//     fps: HTMLElement;
//     frames: number[];
//     lastFrameTimeStamp: number;
//
//     constructor() {
//         this.fps = document.getElementById("fps")!;
//         this.frames = [];
//         this.lastFrameTimeStamp = performance.now();
//     }
//
//     render() {
//         // Convert the delta time since the last frame render into a measure
//         // of frames per second.
//         const now = performance.now();
//         const delta = now - this.lastFrameTimeStamp;
//         this.lastFrameTimeStamp = now;
//         const fps = 1 / delta * 1000;
//
//         // Save only the latest 100 timings.
//         this.frames.push(fps);
//         if (this.frames.length > 100) {
//             this.frames.shift();
//         }
//
//         // Find the max, min, and mean of our 100 latest timings.
//         let min = Infinity;
//         let max = -Infinity;
//         let sum = 0;
//         for (let i = 0; i < this.frames.length; i++) {
//             sum += this.frames[i];
//             min = Math.min(this.frames[i], min);
//             max = Math.max(this.frames[i], max);
//         }
//         let mean = sum / this.frames.length;
//
//         // Render the statistics.
//         this.fps.textContent = `
// Frames per Second:
//          latest = ${Math.round(fps)}
// avg of last 100 = ${Math.round(mean)}
// min of last 100 = ${Math.round(min)}
// max of last 100 = ${Math.round(max)}
// `.trim();
//     }
// }
//
//
// const fps = new FPS();
// function run() {
//     universe.tick();
//     fps.render();
//     drawGrid();
//     animation_id = requestAnimationFrame(run);
// }
//
// drawGrid();
