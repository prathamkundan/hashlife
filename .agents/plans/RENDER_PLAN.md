# Render Plan

## Overview

Rendering moves away from per-cell canvas drawing and dense-grid materialization
toward a **zoom-adaptive, pixel-buffer blit** model that scales with the output
resolution rather than the population or world size.

### Fixed pixel buffer
- A single fixed `vpw x vph` RGBA buffer (`w*h*4` bytes, row-major) lives inside
  wasm linear memory.
- The size is constant (the display resolution, e.g. 1920x1080) and never changes
  with zoom or pan. Only the viewport *bounds* change.

### Per-frame flow
1. JS updates the viewport bounds from user interaction (pan/zoom).
2. JS sends a query to wasm: `rasterize(nw, se, vpw, vph)`.
3. wasm writes the resulting pixels into the fixed buffer and returns its pointer.
4. JS wraps the pointer in an `ImageData` and calls `putImageData` — a single
   blit, no per-cell drawing.

### Interface (decided)
- `window` becomes an **instance method** on `Universe`:
  `fn window(&self, nw: Coordinate, se: Coordinate, vpw: u32, vph: u32, window: &mut [u8])`.
  The **tree walk lives inside `window`**; no region/pop accessor is added to
  the trait — `window` descends the quadtree itself and reads `Node::pop()`
  (already cached) directly. `vpw`/`vph` are passed explicitly (the slice length
  alone can't determine both dimensions of a non-square viewport).
- `HashLifeUniverse` implements `window`. All cell reads go through the
  existing `Grid::at` / internal `Rc<Node>` access, no public API additions.
- wasm exposure: `HashLifeUniverse` is not `#[wasm_bindgen]` and doesn't need
  to be. A **thin wasm wrapper** owns a `HashLifeUniverse` plus the **fixed
  `Vec<u8>` pixel buffer**, and exposes `rasterize(nw, se, vpw, vph) -> usize`
  (writes the buffer, returns `buffer.as_ptr()`). Returning the raw address is
  the same pattern as the existing `get_cells()` in `lib.rs`, so it marshals
  cleanly to JS as a `usize`.
- **Buffer lifetime/aliasing rules** (safe use of the returned address):
  - The `Vec<u8>` buffer is allocated **once** at fixed `vpw*vph*4` and never
    reallocated during steady-state rendering. It must not be pushed/grown.
  - JS **rebuilds the view from `memory.buffer` each frame** (never caches it),
    because any wasm `memory.grow()` (e.g. from the hashlife node caches)
    invalidates a previously captured `ArrayBuffer`.
  - `rasterize` and the returned pointer must target the same buffer: JS uses
    the pointer returned from the *same* call, sized `vpw*vph*4`.

### wasm wrapper (implemented in `src/lib.rs`)
- `Universe` is now a `#[wasm_bindgen]` struct holding `HashLifeUniverse` plus
  the fixed `Vec<u8>` RGBA buffer. Public API:
  - `new(levels: u32, vpw: u32, vph: u32) -> Universe`
  - `rasterize(nw_x, nw_y, se_x, se_y) -> usize` (fills buffer, returns ptr)
  - `buffer_ptr() -> usize`, `buffer_len() -> usize`
  - `toggle(x, y)`, `tick()`, `step(by)`, `reset()`, `generation()`, `population()`
- `HashLifeUniverse` gained `toggle(loc)` (delegates to `node_manager.toggle`).
- `window` is invoked from the wrapper with the fixed buffer; the returned
  pointer is the address JS wraps in an `ImageData`.

### Zoom-adaptive rasterization (the core optimization)
- The buffer is always `vpw x vph` pixels; zooming changes how many world cells
  each pixel represents, never the pixel count.
- **Zoomed out** (viewport larger than buffer): one output pixel covers many
  cells -> stop high in the quadtree and emit a single pixel from the node's
  cached `pop()` (`pop > 0` -> lit, `pop == 0` -> dark).
- **Zoomed in** (viewport smaller than buffer): upscale by nearest-neighbor —
  each visible cell is repeated into a block of pixels. No per-pixel quadtree
  work.
- Work is therefore bounded by the **smaller** of (viewport cells, buffer
  pixels), so a 2^30 world at low zoom is as cheap as a tiny one. It scales with
  output pixels, never with total population.

### Off-main-thread
- Keep the rasterize query off the JS main thread (Web Worker) so pan/zoom and
  UI never block on sim compute. The pixel buffer comes back via a transferable,
  and the main thread just blits it.

### Caveat: wasm memory growth
- `ImageData`/typed-array views capture `memory.buffer` at construction. If wasm
  memory grows (e.g. `memory.grow()` or a `Vec` reallocation), the old
  `ArrayBuffer` is replaced and any cached view becomes stale.
- Fix: rebuild the view each frame by re-fetching `memory.buffer` and the current
  buffer pointer (cheap, zero-copy), OR allocate the fixed buffer once and never
  let wasm grow during steady-state, then cache the view.
- This is the same caveat as the existing `get_cells()` pattern in the frontend.