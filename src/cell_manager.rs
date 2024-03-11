use std::{cell::RefCell, collections::HashMap, iter::zip, rc::Rc};

use crate::cell::{Leaf, MacroCell, Node};

pub struct CellManager {
    cache: HashMap<String, Rc<RefCell<Node>>>,
    parent: Rc<RefCell<Node>>,
}

impl CellManager {
    fn setup(size: u32) -> CellManager {
        CellManager {
            cache: HashMap::new(),
            parent: Rc::new(RefCell::new(Node::new_empty(size))),
        }
    }

    fn apply_rule(&self, node: &Rc<RefCell<Node>>) -> Rc<RefCell<Node>> {
        // This is only supposed to be applied at the 4x4 level
        let node = node.as_ref().borrow();
        assert!(node.get_size() == 2);
        let dx = [1, 0, -1, 0, 1, 1, -1, -1];
        let dy = [0, 1, 0, -1, 1, -1, -1, 1];

        let result = Rc::new(RefCell::new(Node::new_empty(1)));

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
                let new_state = match (node.state_at(i, j), num_alive) {
                    (Leaf::Alive, 2..=3) => Leaf::Alive,
                    (Leaf::Alive, _) => Leaf::Dead,
                    (Leaf::Dead, 3) => Leaf::Alive,
                    (Leaf::Dead, _) => Leaf::Dead,
                };

                if new_state == Leaf::Alive {
                    self._toggle(&mut *result.borrow_mut(), i - 1, j - 1);
                }
            }
        }
        result
    }

    fn combine(&self, u: &Rc<RefCell<Node>>, v: &Rc<RefCell<Node>>) -> Rc<RefCell<Node>> {
        let (u, v) = (u.as_ref().borrow(), v.as_ref().borrow());
        Rc::new(RefCell::new(Node::new_empty(u.get_size())))
    }

    fn combine_left_right(
        &self,
        u: &Rc<RefCell<Node>>,
        v: &Rc<RefCell<Node>>,
    ) -> Rc<RefCell<Node>> {
        let (u, v) = (u.as_ref().borrow(), v.as_ref().borrow());
        let result = MacroCell::new_empty(u.get_size());
        Rc::new(RefCell::new(Node::from(result)))
    }

    fn get_result(&self, node: &Rc<RefCell<Node>>) -> Rc<RefCell<Node>> {
        let node_ref = node.as_ref().borrow();
        if let Node::Empty(size) = *node_ref {
            return Rc::new(RefCell::new(Node::new_empty(size - 1)));
        }

        if node_ref.get_size() == 2 {
            self.apply_rule(node)
        } else {
            self.get_result(&self.combine(node, node))
        }
    }

    fn _step(&self, node: &mut Rc<RefCell<Node>>) {}

    fn step(&mut self) -> () {
        let mut parent = self.parent.to_owned();
        self._step(&mut parent);
        self.parent = parent;
    }

    fn _toggle(&self, curr: &mut Node, x: u32, y: u32) -> () {
        dbg!(curr.get_size());
        let curr_size = curr.get_size();

        if curr_size >= 1 {
            let nx = x % (1 << (curr_size - 1));
            let ny = y % (1 << (curr_size - 1));
            let q_x = x / (1 << (curr_size - 1));
            let q_y = y / (1 << (curr_size - 1));
            dbg!(nx, ny, x, y);
            match curr {
                Node::MacroCell(mc) => {
                    let mut target_cell = match (q_x, q_y) {
                        (0, 0) => mc.ul.borrow_mut(),
                        (0, 1) => mc.ur.borrow_mut(),
                        (1, 0) => mc.ll.borrow_mut(),
                        (1, 1) => mc.lr.borrow_mut(),
                        _ => panic!("Unreachable"),
                    };
                    self._toggle(&mut *target_cell, nx, ny);
                }
                Node::Empty(size) => {
                    let mc = MacroCell::new_empty(*size);
                    // wtff??
                    {
                        let mut target_cell = match (q_x, q_y) {
                            (0, 0) => mc.ul.borrow_mut(),
                            (0, 1) => mc.ur.borrow_mut(),
                            (1, 0) => mc.ll.borrow_mut(),
                            (1, 1) => mc.lr.borrow_mut(),
                            _ => panic!("Unreachable"),
                        };
                        self._toggle(&mut target_cell, nx, ny);
                    }
                    *curr = Node::from(mc);
                }
                _ => panic!("Unreachable"),
            }
        } else {
            match curr {
                Node::Leaf(leaf) => {
                    leaf.toggle();
                }
                _ => panic!("Unreachable"),
            }
        }

        if curr.is_dead() {
            *curr = Node::Empty(curr_size);
        }
    }

    fn toggle(&mut self, x: u32, y: u32) -> () {
        self._toggle(&mut *self.parent.borrow_mut(), x, y);
        let mut result = self.parent.clone();
        if let Node::Empty(size) = *self.parent.as_ref().borrow() {
            result = Rc::new(RefCell::new(Node::new_empty(size)));
        }
        self.parent = result;
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
        assert_eq!(cm.parent.as_ref().borrow().state_at(0, 0), Leaf::Alive);

        cm.toggle(0, 0);
        assert_eq!(cm.parent.as_ref().borrow().state_at(0, 0), Leaf::Dead);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.as_ref().borrow().state_at(5, 5), Leaf::Alive);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.as_ref().borrow().state_at(5, 5), Leaf::Dead);

        assert!(matches!(*cm.parent.as_ref().borrow(), Node::MacroCell(_)));

        match &*cm.parent.borrow() {
            // The node should be empty...
            Node::MacroCell(mc) => assert!(matches!(*mc.ul.as_ref().borrow(), Node::Empty(3))),
            _ => panic!("Macrocell not empty"),
        };
    }
}
