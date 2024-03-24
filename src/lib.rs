extern crate wasm_bindgen;

use std::{collections::BTreeSet, iter::zip};

use wasm_bindgen::prelude::*;

mod cell;
mod cell_factory;
mod cell_manager;
use cell_manager::CellManager;

mod utils;
use crate::utils::Timer;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello wasm")
}

#[wasm_bindgen]
struct Universe {
    levels: u32,
    width: u32,
    visible_width: u32,
    cells: Vec<u8>,
    cell_manager: CellManager,
    update_indices: BTreeSet<u32>,
}

impl Universe {
    pub fn sync_to_buf(&mut self) {
        let region = self.cell_manager.root_ref();
        let offset = self.width >> 2;
        let dx = [0, 1, 0, -1, 0, 1, 1, -1, -1];
        let dy = [0, 0, 1, 0, -1, 1, -1, -1, 1];
        let mut to_remove: Vec<u32> = Vec::new();
        let mut to_add: Vec<u32> = Vec::new();
        for cell in &self.update_indices {
            let x = (cell / self.width) as i32;
            let y = (cell % self.width) as i32;
            zip(dx, dy).for_each(|(i, j)| {
                let nx = (x + i) as u32;
                let ny = (y + j) as u32;
                let actual = ((nx - offset) * self.visible_width + (ny - offset)) as usize;

                match region.state_at(nx, ny) {
                    cell::Leaf::Dead => {
                        if actual <= self.cells.len() {
                            self.cells[actual] = 0 as u8;
                            to_remove.push(nx * self.width + ny);
                        }
                    }
                    _ => {
                        if actual <= self.cells.len() {
                            self.cells[actual] = 1 as u8;
                            to_add.push(nx * self.width + ny);
                        }
                    }
                }
            })
        }

        to_remove.iter().for_each(|x| {
            self.update_indices.remove(x);
        });
        to_add.iter().for_each(|x| {
            self.update_indices.insert(*x);
        });
    }
}

#[wasm_bindgen]
impl Universe {
    pub fn new(levels: u32) -> Self {
        utils::set_panic_hook();
        let width = 1 << levels;
        let visible_width = 1 << (levels - 1);
        let cells = (0..visible_width * visible_width).map(|_| 0).collect();

        Universe {
            levels,
            width,
            visible_width,
            cells,
            cell_manager: CellManager::setup(levels),
            update_indices: BTreeSet::new(),
        }
    }

    pub fn toggle(&mut self, x: u32, y: u32) {
        let offset = self.width >> 2;
        let (nx, ny) = (x + offset, y + offset);
        self.cell_manager.toggle(nx, ny);
        let linear_index = nx * self.width + ny;
        if self.update_indices.contains(&linear_index) {
            self.update_indices.remove(&linear_index);
            self.cells[(x * self.visible_width + y) as usize] = 0;
        } else {
            self.update_indices.insert(nx * self.width + ny);
            self.cells[(x * self.visible_width + y) as usize] = 1;
        }
    }

    pub fn tick(&mut self) {
        self.cell_manager.step();
        self.sync_to_buf();
    }

    // pub fn get_state_at_index(x: u32, y: u32) {}

    pub fn get_cells(&self) -> *const u8 {
        self.cells.as_ptr()
    }
}
