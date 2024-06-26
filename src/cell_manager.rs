use std::{iter::zip, rc::Rc};

use crate::{
    cell::{Leaf, Node},
    cell_factory::CellFactory,
};

/// CellManager, a class for managing the state of the cells.
/// 
/// Cell manager has a reference to the root node of the tree and a cell factory. It is responsible for
/// toggling cells and stepping the simulation.
pub struct CellManager {
    /// Implementation of the cell factory that uses caching.
    nf: CellFactory,
    root: Rc<Node>,
}

impl CellManager {
    /// Setup a new cell manager with a given size.
    pub fn setup(size: u32) -> CellManager {
        CellManager {
            nf: CellFactory::new(),
            root: Rc::new(Node::new_empty(size)),
        }
    }

    /// Reset the cell manager with a new size.
    /// 
    /// ### Arguments
    /// * `size` - The log_2 of size of the root node.
    pub fn reset(&mut self, size: u32) {
        self.root = Rc::new(Node::new_empty(size));
    }

    /// Apply the rule to a 4x4 node.
    /// 
    /// Panics if the node is not 4x4 i.e. if node.get_size() != 2.
    fn apply_rule(&mut self, node: &Node) -> Rc<Node> {
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

    /// Combine the left and right nodes.
    fn combine_left_right(&mut self, l: &Node, r: &Node) -> Rc<Node> {
        let (ul, ur, ll, lr) = (
            self.nf.get_quad(l, 0, 1),
            self.nf.get_quad(r, 0, 0),
            self.nf.get_quad(l, 1, 1),
            self.nf.get_quad(r, 1, 0),
        );
        self.nf.node_from(ul, ur, ll, lr)
    }

    /// Combine the top and bottom nodes.
    fn combine_top_bottom(&mut self, t: &Node, b: &Node) -> Rc<Node> {
        let (ul, ur, ll, lr) = (
            self.nf.get_quad(t, 1, 0),
            self.nf.get_quad(t, 1, 1),
            self.nf.get_quad(b, 0, 0),
            self.nf.get_quad(b, 0, 1),
        );
        self.nf.node_from(ul, ur, ll, lr)
    }

    /// Combine the results from the 9 sub results
    fn combine_results(
        &mut self,
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
        let (ul_ul, ul_ur, ul_ll, ul_lr) = (
            self.nf.get_quad(&ul, 1, 1),
            self.nf.get_quad(&um, 1, 0),
            self.nf.get_quad(&ml, 0, 1),
            self.nf.get_quad(&mm, 0, 0),
        );
        let new_ul = self.nf.node_from(ul_ul, ul_ur, ul_ll, ul_lr);

        let (ur_ul, ur_ur, ur_ll, ur_lr) = (
            self.nf.get_quad(&um, 1, 1),
            self.nf.get_quad(&ur, 1, 0),
            self.nf.get_quad(&mm, 0, 1),
            self.nf.get_quad(&mr, 0, 0),
        );
        let new_ur = self.nf.node_from(ur_ul, ur_ur, ur_ll, ur_lr);

        let (ll_ul, ll_ur, ll_ll, ll_lr) = (
            self.nf.get_quad(&ml, 1, 1),
            self.nf.get_quad(&mm, 1, 0),
            self.nf.get_quad(&ll, 0, 1),
            self.nf.get_quad(&lm, 0, 0),
        );
        let new_ll = self.nf.node_from(ll_ul, ll_ur, ll_ll, ll_lr);

        let (lr_ul, lr_ur, lr_lr, ll_lr) = (
            self.nf.get_quad(&mm, 1, 1),
            self.nf.get_quad(&mr, 1, 0),
            self.nf.get_quad(&lm, 0, 1),
            self.nf.get_quad(&lr, 0, 0),
        );
        let new_lr = self.nf.node_from(lr_ul, lr_ur, lr_lr, ll_lr);

        self.nf.node_from(new_ul, new_ur, new_ll, new_lr)
    }

    /// Get the result of a node.
    /// 
    /// Uses the hashlife algorithm to get the result of a node. Advances time by 1.
    /// returns a node with size = size - 1.
    fn get_result(&mut self, node: Rc<Node>) -> Rc<Node> {
        // If the node is empty, return an empty node of size size - 1.
        if let Node::Empty(size) = *node {
            return self.nf.get_empty(size - 1);
        }
        if let Some(result) = self.nf.get_result(node.clone()) {
            return result;
        }

        if node.get_size() == 2 {
            self.apply_rule(&node)
        } else {
            let ul_quad = self.nf.get_quad(&node, 0, 0);
            let ur_quad = self.nf.get_quad(&node, 0, 1);
            let ll_quad = self.nf.get_quad(&node, 1, 0);
            let lr_quad = self.nf.get_quad(&node, 1, 1);

            let um = self.combine_left_right(&ul_quad, &ur_quad);
            let lm = self.combine_left_right(&ll_quad, &lr_quad);
            let ml = self.combine_top_bottom(&ul_quad, &ll_quad);
            let mr = self.combine_top_bottom(&ur_quad, &lr_quad);
            let mm = self.combine_top_bottom(&um, &lm);

            // 9 holy recursions
            let ul_result = self.get_result(ul_quad);
            let ur_result = self.get_result(ur_quad);
            let ll_result = self.get_result(ll_quad);
            let lr_result = self.get_result(lr_quad);
            let um_result = self.get_result(um);
            let lm_result = self.get_result(lm);
            let ml_result = self.get_result(ml);
            let mr_result = self.get_result(mr);
            let mm_result = self.get_result(mm);

            // Combine the results of the 9 sub results
            let final_result = self.combine_results(
                ul_result, um_result, ur_result, ml_result, mm_result, mr_result, ll_result,
                lm_result, lr_result,
            );

            // Cache the result for future use
            self.nf.cache_result(node, final_result.clone());
            final_result
        }
    }

    /// Advance the simulation by 1 step.
    fn _step(&mut self, node: &Rc<Node>) -> Rc<Node> {
        // let _timer = Timer::new("get_result");
        let result = self.get_result(node.clone());
        // drop(_timer);

        let empty_cell = self.nf.get_empty(result.get_size() - 1);
        let (ul_quad, ur_quad, ll_quad, lr_quad) = (
            self.nf.get_quad(&result, 0, 0),
            self.nf.get_quad(&result, 0, 1),
            self.nf.get_quad(&result, 1, 0),
            self.nf.get_quad(&result, 1, 1),
        );
        // drop(_timer);
        // let _timer = Timer::new("Combine Results");

        // Constructing a bigger node from the 4 quadrants of the result of size - 1
        let ul = self.nf.node_from(
            empty_cell.clone(),
            empty_cell.clone(),
            empty_cell.clone(),
            ul_quad,
        );
        let ur = self.nf.node_from(
            empty_cell.clone(),
            empty_cell.clone(),
            ur_quad,
            empty_cell.clone(),
        );

        let ll = self.nf.node_from(
            empty_cell.clone(),
            ll_quad,
            empty_cell.clone(),
            empty_cell.clone(),
        );
        let lr = self.nf.node_from(
            lr_quad,
            empty_cell.clone(),
            empty_cell.clone(),
            empty_cell.clone(),
        );

        // Creating a new node from the 4 result quadrants
        self.nf.node_from(ul, ur, ll, lr)
    }

    /// Advance the simulation by 1 step and update the root node.
    pub fn step(&mut self) -> () {
        let parent = self._step(&self.root.clone());
        self.root = parent;
    }

    /// Toggle a cell at a given position.
    /// 
    /// Does so recursively by toggling the cell at the given position and then updating the parent nodes.
    fn _toggle(&mut self, curr: &Node, mut x: u32, mut y: u32) -> Rc<Node> {
        dbg!(curr.get_size());
        let curr_size = curr.get_size();
        let result;

        if curr_size >= 1 {
            // Find the quadrant where x and y lie
            let q_x = x / (1 << (curr_size - 1));
            let q_y = y / (1 << (curr_size - 1));
            // Find the new x and y coordinates wrt to the containing quadrant
            x = x % (1 << (curr_size - 1));
            y = y % (1 << (curr_size - 1));
            dbg!(x, y, q_x, q_y);

            // Get references to the 4 quadrants of the current node
            let (mut ul, mut ur, mut ll, mut lr) = (
                self.nf.get_quad(curr, 0, 0),
                self.nf.get_quad(curr, 0, 1),
                self.nf.get_quad(curr, 1, 0),
                self.nf.get_quad(curr, 1, 1),
            );

            match curr {
                Node::MacroCell(ref mc) => {
                    // Update the quadrant where the cell lies
                    match (q_x, q_y) {
                        (0, 0) => ul = self._toggle(&mc.ul, x, y),
                        (0, 1) => ur = self._toggle(&mc.ur, x, y),
                        (1, 0) => ll = self._toggle(&mc.ll, x, y),
                        (1, 1) => lr = self._toggle(&mc.lr, x, y),
                        _ => panic!("Unreachable"),
                    };
                }
                Node::Empty(_) => {
                    // If the cell is empty, a new MacrocCell is created with the new cell toggled
                    match (q_x, q_y) {
                        (0, 0) => ul = self._toggle(&ul, x, y),
                        (0, 1) => ur = self._toggle(&ur, x, y),
                        (1, 0) => ll = self._toggle(&ll, x, y),
                        (1, 1) => lr = self._toggle(&lr, x, y),
                        _ => panic!("Unreachable"),
                    };
                }
                _ => panic!("Unreachable"),
            }

            // Create a new node from the 4 quadrants
            result = self.nf.node_from(ul, ur, ll, lr)
        } else {
            match curr {
                Node::Leaf(ref leaf) => {
                    result = self.nf.get_leaf(leaf.toggle());
                }
                _ => panic!("Unreachable"),
            }
        }

        /// probably not needed
        if result.is_dead() {
            self.nf.get_empty(curr_size)
        } else {
            result
        }
    }

    /// Toggle a cell at a given position and update the root node.
    pub fn toggle(&mut self, x: u32, y: u32) -> () {
        let parent = self.root.clone();
        self.root = self._toggle(&parent, x, y);
    }

    pub fn root_ref(&self) -> Rc<Node> {
        self.root.clone()
    }
}

#[cfg(test)]
mod test {
    use std::env;

    use super::*;
    use crate::cell::*;

    #[test]
    fn test_toggle() {
        env::set_var("RUST_BACKTRACE", "1");
        let mut cm = CellManager::setup(4);

        for i in 0..1 << 4 {
            for j in 0..1 << 4 {
                cm.toggle(i, j);
                assert_eq!(cm.root.state_at(i, j), Leaf::Alive);
                cm.toggle(i, j);
                assert_eq!(cm.root.state_at(i, j), Leaf::Dead);
            }
        }

        match &*cm.root {
            // The node should be empty...
            Node::Empty(size) => assert_eq!(*size, 4),
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

        assert_eq!(cm.root.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.root.state_at(3, 5), Leaf::Alive);
        assert_eq!(cm.root.state_at(3, 4), Leaf::Dead);
        assert_eq!(cm.root.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.root.state_at(4, 3), Leaf::Alive);

        cm.step();

        assert_eq!(cm.root.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.root.state_at(3, 5), Leaf::Dead);
        assert_eq!(cm.root.state_at(3, 4), Leaf::Dead);
        assert_eq!(cm.root.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.root.state_at(4, 3), Leaf::Alive);

        cm.step();

        assert_eq!(cm.root.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.root.state_at(3, 5), Leaf::Dead);
        assert_eq!(cm.root.state_at(3, 4), Leaf::Alive);
        assert_eq!(cm.root.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.root.state_at(4, 3), Leaf::Alive);

        cm.step();

        assert_eq!(cm.root.state_at(3, 3), Leaf::Alive);
        assert_eq!(cm.root.state_at(3, 5), Leaf::Dead);
        assert_eq!(cm.root.state_at(3, 4), Leaf::Alive);
        assert_eq!(cm.root.state_at(4, 4), Leaf::Alive);
        assert_eq!(cm.root.state_at(4, 3), Leaf::Alive);
    }
}
