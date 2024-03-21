extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

mod cell;
mod cell_factory;
mod cell_manager;
use cell_manager::CellManager;

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
}

impl Universe {
    pub fn sync_to_buf(&mut self) {
        let region = self.cell_manager.root_ref();
        let offset = self.width >> 2;
        let max_width = offset + self.visible_width;
        for i in offset..max_width {
            for j in 0..max_width {
                self.cells[(self.width * i + j) as usize] = region.state_at(i, j) as u8;
            }
        }
    }
}

#[wasm_bindgen]
impl Universe {
    pub fn new(levels: u32) -> Self {
        let width = 1 << levels;
        let visible_width = 1 << (levels - 1);
        let cells = (0..visible_width * visible_width).map(|_| 0).collect();
        Universe {
            levels,
            width,
            visible_width,
            cells,
            cell_manager: CellManager::setup(levels),
        }
    }

    pub fn toggle(&mut self, x: u32, y: u32) {
        let offset = self.width >> 2;
        self.cell_manager.toggle(x + offset, y + offset);
        self.sync_to_buf();
    }

    pub fn tick(&mut self) {
        self.cell_manager.step();
        self.sync_to_buf();
    }

    pub fn get_cells(&self) -> *const u8 {
        self.cells.as_ptr()
    }
}
