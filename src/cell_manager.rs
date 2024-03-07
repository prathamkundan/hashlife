use std::{collections::HashMap, iter::zip};

use crate::cell::{Leaf, MacroCell, Node};

pub struct CellManager {
    cache: HashMap<String, Box<Node>>,
    parent: Box<Node>,
}

impl CellManager {
    fn setup(size: u32) -> CellManager {
        CellManager {
            cache: HashMap::new(),
            parent: Box::new(Node::MacroCell(*MacroCell::new_empty(size))),
        }
    }

    fn apply_rule(&self, node: &mut Box<Node>) {
        // This is only supposed to be applied at the 4x4 level
        assert!(node.get_size() == 2);
        let dx = [1, 0, -1, 0, 1, 1, -1, -1];
        let dy = [0, 1, 0, -1, 1, -1, -1, 1];

        let result = MacroCell::new_empty(1);

        for i in 1..=2 {
            for j in 1..=2 {
                let num_alive = zip(dx, dy)
                    .map(|(x, y)| {
                        let cx = i as i32 + x;
                        let cy = j as i32 + y;
                        if node.state_at(cx as u32, cy as u32) == Leaf::Dead {
                            0
                        } else {
                            1
                        }
                    })
                    .sum::<u32>();
                if 
            }
        }
    }

    fn _step(&self, node: &mut Box<Node>) {}

    fn step(&mut self) -> () {
        let mut parent = self.parent.to_owned();
        self._step(&mut parent);
        self.parent = parent;
    }

    fn _toggle(&self, curr: &mut Box<Node>, mut x: u32, mut y: u32) -> () {
        dbg!(curr.get_size());
        let curr_size = curr.get_size();

        if curr_size >= 1 {
            let nx = x % (1 << (curr_size - 1));
            let ny = y % (1 << (curr_size - 1));
            x = x / (1 << (curr_size - 1));
            y = y / (1 << (curr_size - 1));
            dbg!(nx, ny, x, y);
            match curr.as_mut() {
                Node::MacroCell(ref mut mc) => {
                    let target_cell = match (x, y) {
                        (0, 0) => &mut mc.ul,
                        (0, 1) => &mut mc.ur,
                        (1, 0) => &mut mc.ll,
                        (1, 1) => &mut mc.lr,
                        _ => panic!("Unreachable"),
                    };
                    self._toggle(target_cell, nx, ny);
                }
                Node::Empty(size) => {
                    let mut mc = MacroCell::new_empty(*size);
                    let target_cell = match (x, y) {
                        (0, 0) => &mut mc.ul,
                        (0, 1) => &mut mc.ur,
                        (1, 0) => &mut mc.ll,
                        (1, 1) => &mut mc.lr,
                        _ => panic!("Unreachable"),
                    };
                    self._toggle(target_cell, nx, ny);
                    *curr = Box::new(Node::MacroCell(*mc));
                }
                _ => panic!("Unreachable"),
            }
        } else {
            match curr.as_mut() {
                Node::Leaf(leaf) => leaf.toggle(),
                _ => panic!("Unreachable"),
            }
        }

        if curr.is_dead() {
            let size = curr.as_ref().get_size();
            *curr = Box::new(Node::Empty(size));
        }
    }

    fn toggle(&mut self, x: u32, y: u32) -> () {
        let mut parent = self.parent.to_owned();
        self._toggle(&mut parent, x, y);
        self.parent = parent;
        if let Node::Empty(size) = self.parent.as_ref() {
            self.parent = Box::new(Node::MacroCell(*MacroCell::new_empty(*size)));
        }
    }

    //fn step(&mut self) { self.parent = self._step(parent) }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::cell::*;

    #[test]
    fn test_toggle() {
        let mut cm = CellManager::setup(4);
        cm.toggle(0, 0);
        assert_eq!(cm.parent.state_at(0, 0), Leaf::Alive);

        cm.toggle(0, 0);
        assert_eq!(cm.parent.state_at(0, 0), Leaf::Dead);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.state_at(5, 5), Leaf::Alive);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.state_at(5, 5), Leaf::Dead);

        assert!(matches!(*cm.parent, Node::MacroCell(_)));

        match *cm.parent {
            // The node should be empty...
            Node::MacroCell(mc) => assert!(matches!(*mc.ul, Node::Empty(4))),
            _ => panic!("Macrocell not empty"),
        };
    }
}
