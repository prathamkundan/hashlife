use std::collections::HashMap;

use crate::cell::{MacroCell, Node};

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

    fn _toggle(&mut self, mut curr: Box<Node>, mut x: u32, mut y: u32) -> Box<Node> {
        dbg!(curr.get_size());
        let curr_size = curr.get_size();

        if curr_size >= 1 {
            x = x / 1 << (curr_size - 1);
            y = y / 1 << (curr_size - 1);
            let nx = x % 1 << (curr_size - 1);
            let ny = y % 1 << (curr_size - 1);
            match curr.as_mut() {
                Node::MacroCell(ref mut mc) => {
                    let target_cell = match (x, y) {
                        (0, 0) => &mut mc.ul,
                        (0, 1) => &mut mc.ur,
                        (1, 0) => &mut mc.ll,
                        (1, 1) => &mut mc.lr,
                        _ => panic!("Unreachable"),
                    };
                    *target_cell = self._toggle(target_cell.to_owned(), nx, ny);
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
                    *target_cell = self._toggle(target_cell.to_owned(), nx, ny);
                    curr = Box::new(Node::MacroCell(*mc));
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
            curr = Box::new(Node::Empty(curr.get_size()));
        }
        return curr;
    }

    fn toggle(&mut self, x: u32, y: u32) -> () {
        self.parent = self._toggle(self.parent.to_owned(), x, y);
        if let Node::Empty(size) = self.parent.as_ref() {
            self.parent = Box::new(Node::MacroCell(*MacroCell::new_empty(*size)));
        }
    }
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
        assert_eq!(cm.parent.get_size(), 4);
        assert_eq!(cm.parent.state_at(0, 0), Leaf::Dead);
    }
}