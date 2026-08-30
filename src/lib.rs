extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

mod gol;

mod utils;

use gol::hashlife::HashLifeUniverse;
use gol::{Coordinate, Universe as _, C};

/// wasm-exposed wrapper around the hash life universe plus a fixed RGBA pixel
/// buffer for rasterized rendering.
///
/// The buffer is `vpw x vph` RGBA (row-major, `vpw*vph*4` bytes), allocated
/// once in `new` and never resized during steady-state rendering, so the
/// pointer returned by `buffer_ptr`/`rasterize` stays stable as long as wasm
/// memory does not grow.
#[wasm_bindgen]
pub struct Universe {
    inner: HashLifeUniverse,
    levels: u8,
    vpw: u32,
    vph: u32,
    buffer: Vec<u8>,
}

#[wasm_bindgen]
impl Universe {
    /// Create a new universe with `levels` quadtree levels and a fixed
    /// `vpw x vph` RGBA render buffer.
    pub fn new(levels: u32, vpw: u32, vph: u32) -> Universe {
        utils::set_panic_hook();
        let buffer_len = (vpw * vph * 4) as usize;
        Universe {
            inner: HashLifeUniverse::new(levels as u8),
            levels: levels as u8,
            vpw,
            vph,
            buffer: vec![0u8; buffer_len],
        }
    }

    /// Advance the simulation by `by` generations.
    pub fn step(&mut self, by: u32) {
        self.inner.step(by);
    }

    /// Advance the simulation by a single generation.
    pub fn tick(&mut self) {
        self.inner.step(1);
    }

    /// Toggle the cell at world coordinate `(x, y)`.
    pub fn toggle(&mut self, x: i32, y: i32) {
        self.inner.toggle(C(x, y));
    }

    /// Reset the universe to an empty state.
    pub fn reset(&mut self) {
        self.inner = HashLifeUniverse::new(self.levels);
    }

    /// Rasterize the viewport `[nw, se)` (world coordinates) into the fixed
    /// RGBA buffer, then return the buffer's address so JS can wrap it in an
    /// `ImageData`. Returns 0 if the buffer cannot be addressed.
    pub fn rasterize(&mut self, nw_x: i32, nw_y: i32, se_x: i32, se_y: i32) -> usize {
        self.inner.window(
            Coordinate { x: nw_x, y: nw_y },
            Coordinate { x: se_x, y: se_y },
            self.vpw,
            self.vph,
            &mut self.buffer,
        );
        self.buffer.as_ptr() as usize
    }

    /// Return the address of the fixed RGBA buffer, for re-wrapping the view
    /// each frame. Size is `vpw*vph*4` bytes.
    pub fn buffer_ptr(&self) -> usize {
        self.buffer.as_ptr() as usize
    }

    /// Return the byte length of the fixed RGBA buffer.
    pub fn buffer_len(&self) -> usize {
        self.buffer.len()
    }

    /// Number of generations the simulation has advanced.
    pub fn generation(&self) -> u64 {
        self.inner.generation()
    }

    /// Total live-cell population of the universe.
    pub fn population(&self) -> usize {
        self.inner.population()
    }
}
