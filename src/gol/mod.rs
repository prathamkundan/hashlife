mod hashlife;

pub trait Universe {
    fn step(&mut self, by: u32);

    fn step_by_pow(&mut self, by: u8);

    fn window(nw: Coordinate, se: Coordinate, window: &mut [u8]) -> () {}

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
