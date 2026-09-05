import '../styles/styles.css';
import { MODE_EDIT, MODE_PAN, View } from './canvas';
import { MouseHandler } from './handler';

const container = document.getElementById('canvas-container')! as HTMLElement;
const BLOCK_WIDTH = 10;

const view = new View('game-of-life-canvas', container.clientWidth, container.clientHeight, BLOCK_WIDTH, 30);
const eh = new MouseHandler(view)

function handleKeyDown(event: KeyboardEvent) {
    switch (event.code) {
        case "Space":
            view.togglePlay();
            break;
        case "KeyI":
        case "KeyE":
            view.setMode(view.MODE === MODE_EDIT ? MODE_PAN : MODE_EDIT);
            break;
        case "Escape":
            view.setMode(MODE_PAN);
            break;
        case "KeyR":
            if (view.MODE === MODE_EDIT) view.clearUniverse();
            break;
        default:
            break;
    }
}

// Arbitrary generation advance: step the sim by the input amount.
const stepBtn = document.getElementById('step-btn')!;
const stepAmount = document.getElementById('step-amount')! as HTMLInputElement;
function handleStep() {
    const n = Math.max(1, Math.floor(Number(stepAmount.value) || 1));
    view.universe.step(n);
    view.render();
}
stepBtn.addEventListener('click', handleStep);
stepAmount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleStep();
});

window.addEventListener('keydown', handleKeyDown);

window.addEventListener('resize', () => {
    let width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;
    let height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;
    view.setCanvasDimensions(width, height);
    view.render();
});

class SimStats {
    el: HTMLElement;
    frames: number[];
    lastFrameTimeStamp: number;

    constructor() {
        this.el = document.getElementById("sim-stats")!;
        this.frames = [];
        this.lastFrameTimeStamp = performance.now();
    }

    render(gen: bigint) {
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
        let mean = sum / this.frames.length;

        this.el.textContent = `Sim Stats
Gen: ${gen}
latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
    }
}
const stats = new SimStats();
eh.init();
view.setFPSRenderFn(() => stats.render(view.universe.generation()));
view.render();
