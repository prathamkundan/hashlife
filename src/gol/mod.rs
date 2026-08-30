pub mod hashlife;

pub trait Universe {
    fn step(&mut self, by: u32);

    fn step_by_pow(&mut self, by: u8);

    /// Toggle the state of the cell at world coordinate `loc`.
    fn toggle(&mut self, loc: Coordinate);

    /// Rasterize the region `[nw, se)` into the RGBA `window` buffer of size
    /// `vpw x vph` (row-major, `vpw*vph*4` bytes).
    /// `nw` and `se` are world coordinates of the north-west and south-east
    /// corners of the viewport. Each output pixel maps to one world cell when
    /// zoomed in (nearest-neighbor upscale) and to many cells when zoomed out
    /// (single lit/dark pixel from the node's cached `pop()`).
    fn window(&self, nw: Coordinate, se: Coordinate, vpw: u32, vph: u32, window: &mut [u8]);

    fn population(&self) -> usize;
    fn generation(&self) -> u64;
    fn bounding_box(&self) -> (Coordinate, Coordinate);
    fn root_level(&self) -> u8;
}

#[derive(Clone, Copy)]
pub struct Coordinate {
    pub x: i32,
    pub y: i32,
}

pub fn C(x: i32, y: i32) -> Coordinate {
    Coordinate { x, y }
}

pub trait Grid {
    fn at(&self, loc: &Coordinate) -> u8;
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum State {
    ALIVE,
    DEAD,
}

pub trait Automata<T: Grid> {
    // The returns the state at a given position after 1 time step
    fn step(&self, grid: T, coordinate: &Coordinate) -> State;
}
