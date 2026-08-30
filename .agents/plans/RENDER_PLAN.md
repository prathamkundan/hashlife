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