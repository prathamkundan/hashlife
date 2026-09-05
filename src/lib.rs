extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

mod gol;
mod utils;

use gol::hashlife::HashLifeUniverse;
use gol::{Coordinate, Universe as _, C};

/// wasm-exposed wrapper around the hash life universe.
///
/// The render buffer is managed externally: JavaScript allocates a buffer in wasm
/// memory via `alloc_buffer`, passes its pointer to `rasterize` each frame, and
/// frees it with `free_buffer` when the viewport is resized. This decouples the
/// simulation state from the buffer lifetime, so resizing the screen no longer
/// resets the simulation.
#[wasm_bindgen]
pub struct Universe {
    inner: HashLifeUniverse,
    levels: u8,
}

#[wasm_bindgen]
impl Universe {
    /// Create a new universe with `levels` quadtree levels.
    pub fn new(levels: u32) -> Universe {
        utils::set_panic_hook();
        Universe {
            inner: HashLifeUniverse::new(levels as u8),
            levels: levels as u8,
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

    /// Rasterize the viewport `[nw, se)` (world coordinates) into the caller-provided
    /// RGBA buffer. The buffer must be `vpw*vph*4` bytes allocated in wasm memory.
    /// Returns the buffer pointer.
    pub fn rasterize(
        &mut self,
        nw_x: i32,
        nw_y: i32,
        se_x: i32,
        se_y: i32,
        vpw: u32,
        vph: u32,
        buffer_ptr: usize,
        buffer_len: usize,
    ) -> usize {
        assert!(buffer_ptr != 0, "buffer pointer must be non-null");
        assert_eq!(
            buffer_len as u64,
            (vpw as u64) * (vph as u64) * 4,
            "buffer length must be vpw*vph*4"
        );
        unsafe {
            let buf = std::slice::from_raw_parts_mut(buffer_ptr as *mut u8, buffer_len);
            self.inner.window(
                Coordinate { x: nw_x, y: nw_y },
                Coordinate { x: se_x, y: se_y },
                vpw,
                vph,
                buf,
            );
        }
        buffer_ptr
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

/// Allocate a zero-initialized RGBA buffer of `len` bytes in wasm memory.
/// Returns the pointer; JavaScript must free it with `free_buffer` when done.
#[wasm_bindgen]
pub fn alloc_buffer(len: usize) -> usize {
    assert!(len > 0, "buffer length must be > 0");
    let layout = std::alloc::Layout::array::<u8>(len).expect("valid layout");
    unsafe {
        let ptr = std::alloc::alloc(layout);
        assert!(!ptr.is_null(), "allocation failed");
        ptr as usize
    }
}

/// Free a buffer previously allocated with `alloc_buffer`.
#[wasm_bindgen]
pub fn free_buffer(ptr: usize, len: usize) {
    assert!(ptr != 0, "buffer pointer must be non-null");
    assert!(len > 0, "buffer length must be > 0");
    let layout = std::alloc::Layout::array::<u8>(len).expect("valid layout");
    unsafe {
        std::alloc::dealloc(ptr as *mut u8, layout);
    }
}
