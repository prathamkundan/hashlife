use std::{collections::HashMap, iter::zip, rc::Rc};

use crate::cell::{Leaf, MacroCell, Node};

pub struct CellManager {
    cache: HashMap<String, Rc<Node>>,
    parent: Rc<Node>,
}

impl CellManager {
    fn setup(size: u32) -> CellManager {
        CellManager {
            cache: HashMap::new(),
            parent: Rc::new(Node::new_empty(size)),
        }
    }

    fn apply_rule(&self, node: &Node) -> Rc<Node> {
        // This is only supposed to be applied at the 4x4 level
        assert!(node.get_size() == 2);
        let dx = [1, 0, -1, 0, 1, 1, -1, -1];
        let dy = [0, 1, 0, -1, 1, -1, -1, 1];

        let mut result = Rc::new(Node::new_empty(1));

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
                    result = self._toggle(&mut result, i - 1, j - 1);
                }
            }
        }
        result
    }

    fn combine_left_right(&self, l: &Node, r: &Node) -> Rc<Node> {
        let combined = MacroCell::new(
            l.get_quad(0, 1),
            r.get_quad(0, 0),
            l.get_quad(1, 1),
            r.get_quad(1, 0),
        );
        Rc::new(Node::from(combined))
    }

    fn combine_top_bottom(&self, t: &Node, b: &Node) -> Rc<Node> {
        let combined = MacroCell::new(
            t.get_quad(1, 0),
            t.get_quad(1, 1),
            b.get_quad(0, 0),
            b.get_quad(0, 1),
        );
        Rc::new(Node::from(combined))
    }

    fn combine_results(
        &self,
        ul: Rc<Node>,
        um: Rc<Node>,
        ur: Rc<Node>,
        ml: Rc<Node>,
        mm: Rc<Node>,
        mr: Rc<Node>,
        ll: Rc<Node>,
        lm: Rc<Node>,
        lr: Rc<Node>,
    ) -> Rc<Node> {
        let new_ul = MacroCell::new(
            ul.get_quad(1, 1),
            um.get_quad(1, 0),
            ml.get_quad(0, 1),
            mm.get_quad(0, 0),
        );
        let new_ur = MacroCell::new(
            um.get_quad(1, 1),
            ur.get_quad(1, 0),
            mm.get_quad(0, 1),
            mr.get_quad(0, 0),
        );
        let new_ll = MacroCell::new(
            ml.get_quad(1, 1),
            mm.get_quad(1, 0),
            ll.get_quad(0, 1),
            lm.get_quad(0, 0),
        );
        let new_lr = MacroCell::new(
            mm.get_quad(1, 1),
            mr.get_quad(1, 0),
            lm.get_quad(0, 1),
            lr.get_quad(0, 0),
        );
        let result = MacroCell::new(
            Rc::new(Node::from(new_ul)),
            Rc::new(Node::from(new_ur)),
            Rc::new(Node::from(new_ll)),
            Rc::new(Node::from(new_lr)),
        );
        Rc::new(Node::from(result))
    }

    fn get_result(&self, node: &Node) -> Rc<Node> {
        if let Node::Empty(size) = node {
            return Rc::new(Node::new_empty(size - 1));
        }

        if node.get_size() == 2 {
            self.apply_rule(node)
        } else {
            let um = self.combine_left_right(&node.get_quad(0, 0), &node.get_quad(0, 1));
            let lm = self.combine_left_right(&node.get_quad(1, 0), &node.get_quad(1, 1));
            let ml = self.combine_top_bottom(&node.get_quad(0, 0), &node.get_quad(1, 0));
            let mr = self.combine_top_bottom(&node.get_quad(0, 1), &node.get_quad(1, 1));
            let mm = self.combine_top_bottom(&um, &lm);

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
                ul_result, um_result, ur_result, ml_result, mm_result, mr_result, ll_result,
                lm_result, lr_result,
            );
            final_result
        }
    }

    fn _step(&self, node: &Rc<Node>) -> Rc<Node> {
        let result = Rc::new(self.get_result(node.as_ref()));

        let empty_cell = Rc::new(Node::new_empty(result.get_size() - 1));

        let ul = Node::from(MacroCell::new(
            empty_cell.clone(),
            empty_cell.clone(),
            empty_cell.clone(),
            result.get_quad(0, 0),
        ));
        let ur = Node::from(MacroCell::new(
            empty_cell.clone(),
            empty_cell.clone(),
            result.get_quad(0, 1),
            empty_cell.clone(),
        ));

        let ll = Node::from(MacroCell::new(
            empty_cell.clone(),
            result.get_quad(1, 0),
            empty_cell.clone(),
            empty_cell.clone(),
        ));
        let lr = Node::from(MacroCell::new(
            result.get_quad(1, 1),
            empty_cell.clone(),
            empty_cell.clone(),
            empty_cell.clone(),
        ));

        Rc::new(Node::from(MacroCell::new(
            Rc::new(ul),
            Rc::new(ur),
            Rc::new(ll),
            Rc::new(lr),
        )))
    }

    fn step(&mut self) -> () {
        let parent = self._step(&self.parent);
        self.parent = parent;
    }

    fn _toggle(&self, curr: &Node, x: u32, y: u32) -> Rc<Node> {
        dbg!(curr.get_size());
        let curr_size = curr.get_size();
        let mut curr = curr.to_owned();

        if curr_size >= 1 {
            let nx = x % (1 << (curr_size - 1));
            let ny = y % (1 << (curr_size - 1));
            let q_x = x / (1 << (curr_size - 1));
            let q_y = y / (1 << (curr_size - 1));
            dbg!(nx, ny, x, y, q_x, q_y);
            match curr {
                Node::MacroCell(ref mut mc) => {
                    match (q_x, q_y) {
                        (0, 0) => mc.ul = self._toggle(mc.ul.as_ref(), nx, ny),
                        (0, 1) => mc.ur = self._toggle(mc.ur.as_ref(), nx, ny),
                        (1, 0) => mc.ll = self._toggle(mc.ll.as_ref(), nx, ny),
                        (1, 1) => mc.lr = self._toggle(mc.lr.as_ref(), nx, ny),
                        _ => panic!("Unreachable"),
                    };
                }
                Node::Empty(size) => {
                    let mut mc = MacroCell::new_empty(size);
                    match (q_x, q_y) {
                        (0, 0) => mc.ul = self._toggle(mc.ul.as_ref(), nx, ny),
                        (0, 1) => mc.ur = self._toggle(mc.ul.as_ref(), nx, ny),
                        (1, 0) => mc.ll = self._toggle(mc.ul.as_ref(), nx, ny),
                        (1, 1) => mc.lr = self._toggle(mc.ul.as_ref(), nx, ny),
                        _ => panic!("Unreachable"),
                    };
                    curr = Node::from(mc);
                }
                _ => panic!("Unreachable"),
            }
        } else {
            match curr {
                Node::Leaf(ref mut leaf) => {
                    leaf.toggle();
                    return Rc::new(curr);
                }
                _ => panic!("Unreachable"),
            }
        }

        if curr.is_dead() {
            Rc::new(Node::Empty(curr_size))
        } else {
            Rc::new(curr)
        }
    }

    fn toggle(&mut self, x: u32, y: u32) -> () {
        self.parent = self._toggle(self.parent.as_ref(), x, y);
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
        assert_eq!(cm.parent.state_at(0, 0), Leaf::Dead);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.state_at(5, 5), Leaf::Alive);

        cm.toggle(5, 5);
        assert_eq!(cm.parent.state_at(5, 5), Leaf::Dead);

        cm.toggle(5, 13);
        assert_eq!(cm.parent.state_at(5, 13), Leaf::Alive);

        assert!(matches!(*cm.parent, Node::MacroCell(_)));

        match &*cm.parent {
            // The node should be empty...
            Node::MacroCell(mc) => assert!(matches!(*mc.ul, Node::Empty(3))),
            _ => panic!("Macrocell not empty"),
        };
    }

    #[test]
    fn test_step() {
        let mut cm = CellManager::setup(3);
        let points = [(3, 3), (4, 3), (4, 4), (3, 5)];
        for (x, y) in points {
            cm.toggle(x, y);
        }

        assert_eq!(cm.parent.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.parent.state_at(3, 5), Leaf::Alive);
        assert_eq!(cm.parent.state_at(3, 4), Leaf::Dead);
        assert_eq!(cm.parent.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.parent.state_at(4, 3), Leaf::Alive);

        cm.step();

        println!("{}", cm.parent.is_dead());
        assert_eq!(cm.parent.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.parent.state_at(3, 5), Leaf::Dead);
        assert_eq!(cm.parent.state_at(3, 4), Leaf::Dead);
        assert_eq!(cm.parent.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.parent.state_at(4, 3), Leaf::Alive);

        cm.step();

        assert_eq!(cm.parent.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.parent.state_at(3, 5), Leaf::Dead);
        assert_eq!(cm.parent.state_at(3, 4), Leaf::Alive);
        assert_eq!(cm.parent.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.parent.state_at(4, 3), Leaf::Alive);
        
        cm.step();

        assert_eq!(cm.parent.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.parent.state_at(3, 5), Leaf::Dead);
        assert_eq!(cm.parent.state_at(3, 4), Leaf::Alive);
        assert_eq!(cm.parent.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.parent.state_at(4, 3), Leaf::Alive);
    }
}
