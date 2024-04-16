import '../styles/styles.css';
import { View } from './canvas';
import { MouseHandler } from './handler';

const container = document.getElementById('canvas-container')! as HTMLElement;
const BLOCK_WIDTH = 10;
let animation_id: number | null = null;

const view = new View('game-of-life-canvas', container.clientWidth, container.clientHeight, BLOCK_WIDTH, 10);
const eh = new MouseHandler(view)

function handleKeyDown(event: KeyboardEvent) {
    switch (event.code) {
        case "Space":
            view.setMode("NORMAL");
            if (animation_id === null) {
                // console.log("Play");
                run();
            } else {
                // console.log("Pause");
                cancelAnimationFrame(animation_id)
                animation_id = null;
            }
            break;
        case "KeyI":
            if (view.MODE !== 'INSERT') {
                view.setMode("INSERT");
            } else {
                view.setMode("NORMAL");
            }
            break;
        case "Escape":
            view.setMode("NORMAL");
            break;
        case "KeyR":
            // console.log("R Pressed")
            if (view.MODE === "INSERT") view.clearUniverse();
            break;
        default:
            // Handle other keys if needed
            break;
    }
}


window.addEventListener('keydown', handleKeyDown);

window.addEventListener('resize', () => {
    let width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
    let height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;
    view.setCanvasDimensions(width, height);
    view.drawGrid();
});

class FPS {
    fps: HTMLElement;
    frames: number[];
    lastFrameTimeStamp: number;

    constructor() {
        this.fps = document.getElementById("fps")!;
        this.frames = [];
        this.lastFrameTimeStamp = performance.now();
    }

    render() {
        // Convert the delta time since the last frame render into a measure
        // of frames per second.
        const now = performance.now();
        const delta = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        const fps = 1 / delta * 1000;

        // Save only the latest 100 timings.
        this.frames.push(fps);
        if (this.frames.length > 100) {
            this.frames.shift();
        }

        // Find the max, min, and mean of our 100 latest timings.
        let min = Infinity;
        let max = -Infinity;
        let sum = 0;
        for (let i = 0; i < this.frames.length; i++) {
            sum += this.frames[i];
            min = Math.min(this.frames[i], min);
            max = Math.max(this.frames[i], max);
        }
        let mean = sum / this.frames.length;

        // Render the statistics.
        this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
    }
}
const fps = new FPS();
eh.init();
function run() {
    view.universe.tick();
    fps.render();
    view.render();
    animation_id = requestAnimationFrame(run);
}

view.render();
