extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

use std::{collections::BTreeSet, iter::zip};

mod cell;
mod cell_factory;
mod cell_manager;
use cell_manager::CellManager;

mod utils;
use crate::utils::Timer;

#[wasm_bindgen]
/// The Universe class that will be exposed to JS
/// 
/// levels is the number of levels in the quadtree
/// width is the width of the universe but only the center is active
/// visible_width is the width of the visible universe
struct Universe {
    levels: u32,
    width: u32,
    visible_width: u32,
    cells: Vec<u8>,
    cell_manager: CellManager,
    update_indices: BTreeSet<u32>,
}

impl Universe {
    /// Convert the x, y coordinates to the viewport coordinates
    pub fn to_viewport(&self, x: u32, y: u32) -> (u32, u32) {
        (x - (self.width >> 2), y - (self.width >> 2))
    }

    /// Convert the x, y coordinates to the universe coordinates
    pub fn to_universe(&self, x: u32, y: u32) -> (u32, u32) {
        (x + (self.width >> 2), y + (self.width >> 2))
    }

    /// Convert the x, y coordinates to the linear index for the buffer array
    pub fn to_linear_viewport(&self, x: u32, y: u32) -> u32 {
        self.visible_width * x + y
    }

    /// Convert the x, y coordinates to the linear index for the universe
    pub fn to_linear_universe(&self, x: u32, y: u32) -> u32 {
        self.width * x + y
    }

    /// Get the neighbors of a cell as an iterator
    pub fn iter_neighbors(&self, x: u32, y: u32) -> impl Iterator<Item = (u32, u32)> {
        let dx = [0, 1, 0, -1, 0, 1, 1, -1, -1];
        let dy = [0, 0, 1, 0, -1, 1, -1, -1, 1];
        zip(dx, dy).map(move |(_dx, _dy)| ((x as i32 + _dx) as u32, (y as i32 + _dy) as u32))
    }

    /// Sync the cell manager to the buffer
    /// Only the cells that are visible are updated
    pub fn sync_to_buf(&mut self) {
        let region = self.cell_manager.root_ref();
        let mut to_add: Vec<(u32, u32)> = Vec::new();
        for cell in &self.update_indices {
            let (x, y) = (cell / self.width, cell % self.width);
            let (vx, vy) = self.to_viewport(x, y);
            let actual = self.to_linear_viewport(vx, vy) as usize;
            match region.state_at(x, y) {
                cell::Leaf::Dead => {
                    if actual <= self.cells.len() {
                        self.cells[actual] = 0;
                    }
                }
                _ => {
                    if actual <= self.cells.len() {
                        self.cells[actual] = 1;
                        to_add.push((x, y));
                    }
                }
            }
        }

        self.update_indices.clear();
        to_add.iter().for_each(|(x, y)| {
            self.iter_neighbors(*x, *y).for_each(|(_x, _y)| {
                self.update_indices.insert(self.to_linear_universe(_x, _y));
            })
        });
    }
}

#[wasm_bindgen]
impl Universe {
    /// Create a new Universe with the given number of levels
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

    /// Toggle the cell at the given x, y coordinates
    pub fn toggle(&mut self, x: u32, y: u32) {
        let (nx, ny) = self.to_universe(x, y);
        self.cell_manager.toggle(nx, ny);

        let linear_index = self.to_linear_universe(nx, ny);
        let index = self.to_linear_viewport(x, y) as usize;
        if self.cells[index] == 1 {
            // self.iter_neighbors(nx, ny).for_each(|(_nx, _ny)| {
            //     self.update_indices
            //         .remove(&self.to_linear_universe(_nx, _ny));
            // });
            self.update_indices.remove(&linear_index);

            self.cells[index] = 0 as u8;
        } else {
            self.iter_neighbors(nx, ny).for_each(|(_nx, _ny)| {
                self.update_indices
                    .insert(self.to_linear_universe(_nx, _ny));
            });
            self.cells[index] = 1 as u8;
        }
    }

    /// Take the simulation forward by one time step
    pub fn tick(&mut self) {
        self.cell_manager.step();
        self.sync_to_buf();
    }


    /// Get the cells as a pointer for the JS side
    /// refer to https://rustwasm.github.io/docs/book/game-of-life/testing.html
    pub fn get_cells(&self) -> *const u8 {
        self.cells.as_ptr()
    }

    /// Reset the universe
    pub fn reset(&mut self) {
        self.cells = (0..self.visible_width * self.visible_width)
            .map(|_| 0)
            .collect();
        self.cell_manager.reset(self.levels);
        self.sync_to_buf();
    }
}
