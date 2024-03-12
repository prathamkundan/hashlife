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

    fn apply_rule(&self, node: &Node) -> Node {
        // This is only supposed to be applied at the 4x4 level
        assert!(node.get_size() == 2);
        let dx = [1, 0, -1, 0, 1, 1, -1, -1];
        let dy = [0, 1, 0, -1, 1, -1, -1, 1];

        let mut result = Node::new_empty(1);

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
                    self._toggle(&mut result, i - 1, j - 1);
                }
            }
        }
        result
    }

    fn combine_left_right(&self, l: &Node, r: &Node) -> Node {
        let combined = MacroCell::new(
            Rc::new(RefCell::new(*l.get_quad(0, 1))),
            Rc::new(RefCell::new(*r.get_quad(0, 0))),
            Rc::new(RefCell::new(*l.get_quad(1, 1))),
            Rc::new(RefCell::new(*r.get_quad(1, 0))),
        );
        Node::from(combined)
    }

    fn combine_top_bottom(&self, t: &Node, b: &Node) -> Node {
        let combined = MacroCell::new(
            Rc::new(RefCell::new(*t.get_quad(1, 0))),
            Rc::new(RefCell::new(*t.get_quad(1, 1))),
            Rc::new(RefCell::new(*b.get_quad(0, 0))),
            Rc::new(RefCell::new(*b.get_quad(0, 1))),
        );
        Node::from(combined)
    }

    fn combine(&self, u: &Node, v: &Node) -> Node {
        let result = MacroCell::new_empty(u.get_size());
        Node::from(result)
    }

    fn combine_results(
        &self,
        ul: &Node,
        um: &Node,
        ur: &Node,
        ml: &Node,
        mm: &Node,
        mr: &Node,
        ll: &Node,
        lm: &Node,
        lr: &Node,
    ) -> Node {
        let new_ul = MacroCell::new(
            Rc::new(RefCell::new(*ul.get_quad(1, 1))),
            Rc::new(RefCell::new(*um.get_quad(1, 0))),
            Rc::new(RefCell::new(*ml.get_quad(0, 1))),
            Rc::new(RefCell::new(*mm.get_quad(0, 0))),
        );
        let new_ur = MacroCell::new(
            Rc::new(RefCell::new(*um.get_quad(1, 1))),
            Rc::new(RefCell::new(*ur.get_quad(1, 0))),
            Rc::new(RefCell::new(*mm.get_quad(0, 1))),
            Rc::new(RefCell::new(*mr.get_quad(0, 0))),
        );
        let new_ll = MacroCell::new(
            Rc::new(RefCell::new(*ml.get_quad(1, 1))),
            Rc::new(RefCell::new(*mm.get_quad(1, 0))),
            Rc::new(RefCell::new(*ll.get_quad(0, 1))),
            Rc::new(RefCell::new(*lm.get_quad(0, 0))),
        );
        let new_lr = MacroCell::new(
            Rc::new(RefCell::new(*mm.get_quad(1, 1))),
            Rc::new(RefCell::new(*mr.get_quad(1, 0))),
            Rc::new(RefCell::new(*lm.get_quad(0, 1))),
            Rc::new(RefCell::new(*lr.get_quad(0, 0))),
        );
        let result = MacroCell::new(
            Rc::new(RefCell::new(Node::from(new_ul))),
            Rc::new(RefCell::new(Node::from(new_ur))),
            Rc::new(RefCell::new(Node::from(new_ll))),
            Rc::new(RefCell::new(Node::from(new_lr))),
        );
        Node::from(result)
    }

    fn get_result(&self, node: &Node) -> Node {
        if let Node::Empty(size) = node {
            return Node::new_empty(size - 1);
        }

        if node.get_size() == 2 {
            self.apply_rule(node)
        } else {
            let um = self.combine_left_right(&node.get_quad(0, 0), &node.get_quad(0, 1));
            let lm = self.combine_left_right(&node.get_quad(1, 0), &node.get_quad(1, 1));
            let ml = self.combine_top_bottom(&node.get_quad(0, 0), &node.get_quad(1, 0));
            let mr = self.combine_top_bottom(&node.get_quad(0, 1), &node.get_quad(1, 1));
            let mm = self.combine_top_bottom(&lm, &um);

            let ul_result = self.get_result(&node.get_quad(0, 0));
            let ur_result = self.get_result(&node.get_quad(0, 1));
            let ll_result = self.get_result(&node.get_quad(1, 0));
            let lr_result = self.get_result(&node.get_quad(1, 1));
            let um_result = self.get_result(&um);
            let lm_result = self.get_result(&lm);
            let ml_result = self.get_result(&ml);
            let mr_result = self.get_result(&mr);
            let mm_result = self.get_result(&mm);

            let final_result = self.combine_results(
                &ul_result, &um_result, &ur_result, &ml_result, &mm_result, &mr_result, &ll_result,
                &lm_result, &lr_result,
            );
            final_result
        }
    }

    fn join(&mut self, ul: Node, ur: Node, ll: Node, lr: Node) -> Node {
        Node::from(MacroCell::new(
            Rc::new(RefCell::new(ul)),
            Rc::new(RefCell::new(ur)),
            Rc::new(RefCell::new(ll)),
            Rc::new(RefCell::new(lr)),
        ))
    }

    fn _step(&mut self, node: &mut Rc<RefCell<Node>>) {
        let result = self.get_result(&*node.borrow());

        let mut ul = Node::new_empty(node.borrow().get_size() - 1);
        *ul.get_quad(1, 1) = *result.get_quad(0, 0);

        let mut ur = Node::new_empty(node.borrow().get_size() - 1);
        *ur.get_quad(1, 0) = *result.get_quad(0, 1);

        let mut ll = Node::new_empty(node.borrow().get_size() - 1);
        *ll.get_quad(0, 1) = *result.get_quad(1, 0);

        let mut lr = Node::new_empty(node.borrow().get_size() - 1);
        *lr.get_quad(0, 0) = *result.get_quad(1, 1);

        *node = Rc::new(RefCell::new(self.join(ul, ur, ll, lr)));
    }

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
        if let Node::Empty(size) = *self.parent.borrow() {
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
        assert_eq!(cm.parent.borrow().state_at(0, 0), Leaf::Alive);

        cm.toggle(0, 0);
        assert_eq!(cm.parent.borrow().state_at(0, 0), Leaf::Dead);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.borrow().state_at(5, 5), Leaf::Alive);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.borrow().state_at(5, 5), Leaf::Dead);

        cm.toggle(5, 13);
        assert_eq!(cm.parent.borrow().state_at(5, 13), Leaf::Alive);

        assert!(matches!(*cm.parent.borrow(), Node::MacroCell(_)));

        match &*cm.parent.borrow() {
            // The node should be empty...
            Node::MacroCell(mc) => assert!(matches!(*mc.ul.borrow(), Node::Empty(3))),
            _ => panic!("Macrocell not empty"),
        };
    }

    #[test]
    fn test_step() {
        let mut cm = CellManager::setup(3);
        let points = [(6, 6), (7, 6), (7, 7), (6, 8)];
        for (x, y) in points {
            cm.toggle(x, y);
        }
        cm.step();
    }
}
