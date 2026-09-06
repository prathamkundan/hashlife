import '../styles/styles.css';
import { Model } from './model';
import { View } from './view';
import { Controller } from './controller';

const container = document.getElementById('canvas-container')! as HTMLElement;
const BLOCK_WIDTH = 10;

// Model first: all state lives here, no DOM.
const model = new Model(15, BLOCK_WIDTH);

// View reads the model to render canvas + UI.
const view = new View(model, 'game-of-life-canvas', container.clientWidth, container.clientHeight);

// Controller translates user input into model mutations and wires all listeners.
const controller = new Controller(model, view);
controller.init();

view.render();
