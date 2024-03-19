extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
mod cell;
mod cell_manager;
mod node_factory;

#[wasm_bindgen]
struct Universe {
    width: u32,
    height: u32,
}
