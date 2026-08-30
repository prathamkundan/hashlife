use std::{collections::HashMap, rc::Rc, usize};

use crate::gol::{Automata, Coordinate, Grid, State, Universe, C};

const DX: [i32; 8] = [-1, 0, 1, -1, 1, -1, 0, 1];
const DY: [i32; 8] = [-1, -1, -1, 0, 0, 1, 1, 1];

pub struct HashLifeUniverse {
    root: Rc<Node>,
    generation: u64,
    node_manager: HashlifeNodeManager,
}

impl Universe for HashLifeUniverse {
    fn population(&self) -> usize {
        return self.root.pop()
    }

    fn generation(&self) -> u64 {
        self.generation
    }

    fn step(&mut self, by: u32) {
        // Decompose `by` into a sum of powers of two and advance by each.
        let mut remaining = by;
        while remaining > 0 {
            let k = (31 - remaining.leading_zeros()) as u8;
            self.step_by_pow(k);
            remaining -= 1 << k;
        }
    }

    fn step_by_pow(&mut self, by: u8) {
        let root = self.node_manager.expand(self.root.clone());
        self.root = self.result(root, by);
        self.generation += 1u64 << by;
    }

    fn bounding_box(&self) -> (super::Coordinate, super::Coordinate) {
        todo!()
    }

    fn root_level(&self) -> u8 {
        self.root.level()
    }
}

impl HashLifeUniverse {
    pub fn new(levels: u8) -> HashLifeUniverse {
        let node_manager = HashlifeNodeManager::new(levels);
        let automata = ConwayGOLHashlife::new();
        let root = node_manager.empty(levels);
        HashLifeUniverse {
            root,
            generation: 0,
            node_manager,
        }
    }

    pub fn result(&mut self, node: Rc<Node>, pow: u8) -> Rc<Node> {
        debug_assert!(pow <= node.level()-2);
        let key = CellKey::for_cell(node.clone());
        if let Some(node) = self.node_manager.result_lookup.get(&(key.clone(), pow)) {
            return node.clone();
        }

        if node.level() - 2 == pow {
            return self._result(node);
        }

        let (nw, ne, sw, se) = self.node_manager.quad_of(&node);
        let um = self.node_manager.combine_lr(&nw, &ne);
        let lm = self.node_manager.combine_lr(&sw, &se);
        let ml = self.node_manager.combine_tb(&nw, &sw);
        let mr = self.node_manager.combine_tb(&ne, &se);
        let mm = self.node_manager.combine_tb(&um, &lm);

        let ul_result;
        let um_result;
        let ur_result;
        let ml_result;
        let mm_result;
        let mr_result;
        let ll_result;
        let lm_result;
        let lr_result;

        if node.level() - 3 == pow {
            ul_result = self._result(nw);
            um_result = self._result(um);
            ur_result = self._result(ne);
            ml_result = self._result(ml);
            mm_result = self._result(mm);
            mr_result = self._result(mr);
            ll_result = self._result(sw);
            lm_result = self._result(lm);
            lr_result = self._result(se);
        } else {
            ul_result = self.result(nw, pow);
            um_result = self.result(um, pow);
            ur_result = self.result(ne, pow);
            ml_result = self.result(ml, pow);
            mm_result = self.result(mm, pow);
            mr_result = self.result(mr, pow);
            ll_result = self.result(sw, pow);
            lm_result = self.result(lm, pow);
            lr_result = self.result(se, pow);
        }

        let nw_im = self.node_manager.get_or_create(
            ul_result,
            um_result.clone(),
            ml_result.clone(),
            mm_result.clone(),
        );
        let ne_im = self.node_manager.get_or_create(
            um_result.clone(),
            ur_result,
            mm_result.clone(),
            mr_result.clone(),
        );
        let sw_im = self.node_manager.get_or_create(
            ml_result.clone(),
            mm_result.clone(),
            ll_result,
            lm_result.clone(),
        );
        let se_im = self.node_manager.get_or_create(
            mm_result.clone(),
            mr_result.clone(),
            lm_result.clone(),
            lr_result,
        );

        let new_nw = self.node_manager.get_center(nw_im);
        let new_ne = self.node_manager.get_center(ne_im);
        let new_sw = self.node_manager.get_center(sw_im);
        let new_se = self.node_manager.get_center(se_im);

        let result = self.node_manager.get_or_create(new_nw, new_ne, new_sw, new_se);

        self.node_manager.result_lookup.insert((key, pow), result.clone());
        return result;
    }

    pub fn _result(&mut self, node: Rc<Node>) -> Rc<Node> {
        let level = node.level();
        assert!(level >= 2, "result is only defined for nodes of level >= 2");

        // Empty node -> empty result one level down.
        if node.is_empty() {
            return self.node_manager.empty(level - 1);
        }

        // Hash-consed cache: looked up by the node's 4 quadrant pointers.
        let key = CellKey::for_cell(node.clone());

        if let Some(cached) = self.node_manager.result_lookup.get(&(key.clone(), level - 2)) {
            return cached.clone();
        }

        let result = if level == 2 {
            let nw = self.node_manager.rule(node.clone(), &C(-1, -1));
            let ne = self.node_manager.rule(node.clone(), &C(0, -1));
            let sw = self.node_manager.rule(node.clone(), &C(-1, 0));
            let se = self.node_manager.rule(node, &C(0, 0));
            self.node_manager.get_or_create(nw, ne, sw, se)
        } else {
            // The 13 unholy recursions: 9 overlapping sub-nodes one level down,
            // each advanced by 2^(level - 1 - 2) = 2^(level - 3) generations.
            // The nine results (level - 2) combine into a level - 1 node that is
            // the original advanced by 2^(level - 2) generations.

            let (nw, ne, sw, se) = self.node_manager.quad_of(&node);
            let um = self.node_manager.combine_lr(&nw, &ne);
            let lm = self.node_manager.combine_lr(&sw, &se);
            let ml = self.node_manager.combine_tb(&nw, &sw);
            let mr = self.node_manager.combine_tb(&ne, &se);
            let mm = self.node_manager.combine_tb(&um, &lm);

            // The 9 holy recursions.
            let ul_result = self._result(nw);
            let um_result = self._result(um);
            let ur_result = self._result(ne);
            let ml_result = self._result(ml);
            let mm_result = self._result(mm);
            let mr_result = self._result(mr);
            let ll_result = self._result(sw);
            let lm_result = self._result(lm);
            let lr_result = self._result(se);

            let nw_im = self.node_manager.get_or_create(
                ul_result,
                um_result.clone(),
                ml_result.clone(),
                mm_result.clone(),
            );
            let ne_im = self.node_manager.get_or_create(
                um_result.clone(),
                ur_result,
                mm_result.clone(),
                mr_result.clone(),
            );
            let sw_im = self.node_manager.get_or_create(
                ml_result.clone(),
                mm_result.clone(),
                ll_result,
                lm_result.clone(),
            );
            let se_im = self.node_manager.get_or_create(
                mm_result.clone(),
                mr_result.clone(),
                lm_result.clone(),
                lr_result,
            );

            let new_nw = self._result(nw_im);
            let new_ne = self._result(ne_im);
            let new_sw = self._result(sw_im);
            let new_se = self._result(se_im);

            self.node_manager.get_or_create(new_nw, new_ne, new_sw, new_se)
        };

        self.node_manager.result_lookup.insert((key, level - 2), result.clone());
        result
    }
}

pub struct ConwayGOLHashlife {}

impl Automata<Rc<Node>> for ConwayGOLHashlife {
    fn step(&self, grid: Rc<Node>, coordinate: &Coordinate) -> State {
        let is_alive = |x: i32, y: i32| grid.at(&Coordinate { x, y }) == 1;
        let alive = (0..8)
            .map(|i| is_alive(coordinate.x + DX[i], coordinate.y + DY[i]) as u8)
            .sum::<u8>();
        let cur = grid.at(coordinate);
        match (cur, alive) {
            (1, 2) | (1, 3) => State::ALIVE,
            (0, 3) => State::ALIVE,
            _ => State::DEAD,
        }
    }
}

impl ConwayGOLHashlife {
    fn new() -> ConwayGOLHashlife {
        ConwayGOLHashlife {}
    }
}

/// Node
/// Coordinates centered at `(0,0)`
/// Can be a leaf, a macrocell or a dead chunk
pub enum Node {
    Cell {
        level: u8,
        nw: Rc<Node>,
        ne: Rc<Node>,
        sw: Rc<Node>,
        se: Rc<Node>,
        pop: usize,
    },
    Leaf(u8),
    Empty(u8),
}

impl Node {
    pub fn level(&self) -> u8 {
        match self {
            Node::Cell {
                level,
                nw: _,
                ne: _,
                sw: _,
                se: _,
                pop: _,
            } => *level,
            Node::Leaf(_) => 0,
            Node::Empty(level) => *level,
        }
    }

    pub fn empty(level: u8) -> Node {
        Node::Empty(level)
    }

    pub fn is_empty(&self) -> bool {
        match self {
            Node::Cell {
                level: _,
                nw,
                ne,
                sw,
                se,
                pop: _,
            } => nw.is_empty() && ne.is_empty() && sw.is_empty() && se.is_empty(),
            Node::Leaf(state) => *state == 0,
            Node::Empty(_) => true,
        }
    }

    pub fn new(nw: Rc<Node>, ne: Rc<Node>, sw: Rc<Node>, se: Rc<Node>) -> Node {
        if nw.is_empty() && ne.is_empty() && sw.is_empty() && se.is_empty() {
            Node::Empty(nw.level() + 1)
        } else {
            let pop = nw.pop() + ne.pop() + sw.pop() + se.pop();
            Node::Cell {
                level: nw.level() + 1,
                nw,
                ne,
                sw,
                se,
                pop,
            }
        }
    }

    pub fn pop(&self) -> usize {
        match self {
            Node::Cell {
                level: _,
                nw: _,
                ne: _,
                sw: _,
                se: _,
                pop,
            } => *pop,
            Node::Leaf(state) => usize::from(*state),
            Node::Empty(_) => 0,
        }
    }
}

impl Grid for Rc<Node> {
    fn at(&self, loc: &Coordinate) -> u8 {
        match &**self {
            Node::Cell {
                level,
                nw,
                ne,
                sw,
                se,
                pop: _,
            } => {
                // The child of level `L` has a half-size of 2^(L-2).
                let half_sub = if *level >= 2 { 1 << (*level - 2) } else { 0 };
                let dx = if loc.x < 0 { half_sub } else { -half_sub };
                let dy = if loc.y < 0 { half_sub } else { -half_sub };
                let child_loc = Coordinate {
                    x: loc.x + dx,
                    y: loc.y + dy,
                };

                if loc.x < 0 && loc.y < 0 {
                    nw.at(&child_loc)
                } else if loc.x >= 0 && loc.y < 0 {
                    ne.at(&child_loc)
                } else if loc.x < 0 && loc.y >= 0 {
                    sw.at(&child_loc)
                } else {
                    se.at(&child_loc)
                }
            }
            Node::Leaf(state) => *state,
            Node::Empty(_) => 0,
        }
    }
}

#[derive(Hash, PartialEq, Eq, Clone)]
pub struct CellKey {
    pub level: u8,

    pub nw: usize,
    pub ne: usize,
    pub sw: usize,
    pub se: usize,
}

impl CellKey {
    pub fn from_quads(nw: Rc<Node>, ne: Rc<Node>, sw: Rc<Node>, se: Rc<Node>) -> CellKey {
        CellKey {
            level: nw.level() + 1,
            nw: Rc::as_ptr(&nw) as usize,
            ne: Rc::as_ptr(&ne) as usize,
            sw: Rc::as_ptr(&sw) as usize,
            se: Rc::as_ptr(&se) as usize,
        }
    }

    pub fn for_cell(node: Rc<Node>) -> CellKey {
        match &*node {
            Node::Cell {
                level,
                nw,
                ne,
                sw,
                se,
                pop: _,
            } => CellKey {
                level: *level,
                nw: Rc::as_ptr(nw) as usize,
                ne: Rc::as_ptr(ne) as usize,
                sw: Rc::as_ptr(sw) as usize,
                se: Rc::as_ptr(se) as usize,
            },
            Node::Leaf(_) | Node::Empty(_) => unreachable!("empty handled above"),
        }
    }
}

pub struct HashlifeNodeManager {
    levels: u8,
    max_width: i32,
    radius: i32,

    automata: Box<dyn Automata<Rc<Node>>>,

    pub result_lookup: HashMap<(CellKey, u8), Rc<Node>>,
    node_lookup: HashMap<CellKey, Rc<Node>>,

    dead_leaf: Rc<Node>,
    live_leaf: Rc<Node>,
    empty_nodes: Vec<Rc<Node>>,
}

impl Default for HashlifeNodeManager {
    fn default() -> Self {
        Self {
            levels: Default::default(),
            max_width: Default::default(),
            radius: Default::default(),
            result_lookup: Default::default(),
            node_lookup: Default::default(),
            dead_leaf: Rc::new(Node::Leaf(0)),
            live_leaf: Rc::new(Node::Leaf(1)),
            empty_nodes: Default::default(),
            automata: Box::new(ConwayGOLHashlife::new()),
        }
    }
}

const TRANSFORM: [i32; 4] = [1, -1, 1, -1];

impl HashlifeNodeManager {
    pub fn new(levels: u8) -> HashlifeNodeManager {
        let mut empty_nodes: Vec<Rc<Node>> = Vec::with_capacity(usize::from(levels));
        for idx in 0..=empty_nodes.capacity() {
            empty_nodes.push(Rc::new(Node::empty(idx as u8)));
        }

        HashlifeNodeManager {
            levels: levels,
            max_width: 1 << levels,
            radius: 1 << (levels - 1),
            empty_nodes: empty_nodes,
            ..Default::default()
        }
    }

    pub fn new_with_rule(levels: u8, automata: Box<dyn Automata<Rc<Node>>>) -> HashlifeNodeManager {
        let mut empty_nodes: Vec<Rc<Node>> = Vec::with_capacity(usize::from(levels));
        for idx in 0..=empty_nodes.capacity() {
            empty_nodes.push(Rc::new(Node::empty(idx as u8)));
        }

        HashlifeNodeManager {
            levels: levels,
            max_width: 1 << levels,
            radius: 1 << (levels - 1),
            empty_nodes: empty_nodes,
            automata: automata,
            ..Default::default()
        }
    }

    pub fn empty(&self, level: u8) -> Rc<Node> {
        assert!(level <= self.levels, "node manager cannot handle the level");
        let idx = usize::from(level);
        self.empty_nodes[idx].clone()
    }

    pub fn get_or_create(
        &mut self,
        nw: Rc<Node>,
        ne: Rc<Node>,
        sw: Rc<Node>,
        se: Rc<Node>,
    ) -> Rc<Node> {
        if nw.is_empty() && ne.is_empty() && sw.is_empty() && se.is_empty() {
            self.empty(nw.level() + 1)
        } else {
            let key = CellKey::from_quads(nw.clone(), ne.clone(), sw.clone(), se.clone());
            if let Some(node) = self.node_lookup.get(&key) {
                node.clone()
            } else {
                let node = Rc::new(Node::new(nw, ne, sw, se));
                self.node_lookup.insert(key, node.clone());
                node
            }
        }
    }

    pub fn toggle(&mut self, node: Rc<Node>, loc: Coordinate) -> Rc<Node> {
        match &*node {
            Node::Cell {
                level,
                nw,
                ne,
                sw,
                se,
                pop: _,
            } => self.toggle_in_cell(*level, nw.clone(), ne.clone(), sw.clone(), se.clone(), loc),
            Node::Leaf(state) => {
                if *state == 1 {
                    self.dead_leaf.clone()
                } else {
                    self.live_leaf.clone()
                }
            }
            Node::Empty(level) => {
                let level = *level;
                self.toggle_in_empty(level, loc)
            }
        }
    }

    fn toggle_in_cell(
        &mut self,
        level: u8,
        nw: Rc<Node>,
        ne: Rc<Node>,
        sw: Rc<Node>,
        se: Rc<Node>,
        loc: Coordinate,
    ) -> Rc<Node> {
        let child_loc: Coordinate;

        if level < 2 {
            child_loc = loc;
        } else {
            let half_sub = 1 << (level - 2);
            let dx = if loc.x < 0 { half_sub } else { -half_sub };
            let dy = if loc.y < 0 { half_sub } else { -half_sub };
            child_loc = Coordinate {
                x: loc.x + dx,
                y: loc.y + dy,
            };
        }

        let (nw, ne, sw, se): (Rc<Node>, Rc<Node>, Rc<Node>, Rc<Node>) = if loc.x < 0 && loc.y < 0 {
            (self.toggle(nw, child_loc), ne, sw, se)
        } else if loc.x >= 0 && loc.y < 0 {
            (nw, self.toggle(ne, child_loc), sw, se)
        } else if loc.x < 0 && loc.y >= 0 {
            (nw, ne, self.toggle(sw, child_loc), se)
        } else {
            (nw, ne, sw, self.toggle(se, child_loc))
        };

        self.get_or_create(nw, ne, sw, se)
    }

    fn toggle_in_empty(&mut self, level: u8, loc: Coordinate) -> Rc<Node> {
        if level == 0 {
            return self.live_leaf.clone();
        }

        let e = self.empty(level - 1);
        let half_sub = if level >= 2 { 1 << (level - 2) } else { 0 };
        let dx = if loc.x < 0 { half_sub } else { -half_sub };
        let dy = if loc.y < 0 { half_sub } else { -half_sub };
        let child_loc = Coordinate {
            x: loc.x + dx,
            y: loc.y + dy,
        };

        let toggled = self.toggle(e.clone(), child_loc);
        let (nw, ne, sw, se): (Rc<Node>, Rc<Node>, Rc<Node>, Rc<Node>) = if loc.y < 0 {
            if loc.x < 0 {
                (toggled, e.clone(), e.clone(), e.clone())
            } else {
                (e.clone(), toggled, e.clone(), e.clone())
            }
        } else if loc.x < 0 {
            (e.clone(), e.clone(), toggled, e.clone())
        } else {
            (e.clone(), e.clone(), e.clone(), toggled)
        };

        self.get_or_create(nw, ne, sw, se)
    }

    pub fn rule(&self, node: Rc<Node>, loc: &Coordinate) -> Rc<Node> {
        if self.automata.step(node, loc) == State::ALIVE {
            self.live_leaf.clone()
        } else {
            self.dead_leaf.clone()
        }
    }

    /// Extract the 4 quadrant children of a level `n` node.
    pub fn quad_of(&mut self, n: &Rc<Node>) -> (Rc<Node>, Rc<Node>, Rc<Node>, Rc<Node>) {
        match &**n {
            Node::Cell { nw, ne, sw, se, .. } => (nw.clone(), ne.clone(), sw.clone(), se.clone()),
            Node::Empty(lvl) => {
                let e = self.empty(*lvl - 1);
                (e.clone(), e.clone(), e.clone(), e.clone())
            }
            Node::Leaf(_) => unreachable!("leaf has no quadrants"),
        }
    }

    /// Get quadrant `q` (0=nw, 1=ne, 2=sw, 3=se) of a level `n` node.
    pub fn quad(&mut self, n: &Rc<Node>, q: usize) -> Rc<Node> {
        match &**n {
            Node::Cell { nw, ne, sw, se, .. } => match q {
                0 => nw.clone(),
                1 => ne.clone(),
                2 => sw.clone(),
                _ => se.clone(),
            },
            Node::Empty(lvl) => self.empty(*lvl - 1),
            Node::Leaf(_) => unreachable!("leaf has no quadrants"),
        }
    }

    /// node_from(l.ne, r.nw, l.se, r.sw)
    pub fn combine_lr(&mut self, l: &Rc<Node>, r: &Rc<Node>) -> Rc<Node> {
        let (_, l_ne, _, l_se) = self.quad_of(l);
        let (r_nw, _, r_sw, _) = self.quad_of(r);
        self.get_or_create(l_ne, r_nw, l_se, r_sw)
    }

    /// node_from(t.sw, t.se, b.nw, b.ne)
    pub fn combine_tb(&mut self, t: &Rc<Node>, b: &Rc<Node>) -> Rc<Node> {
        let (_, _, t_sw, t_se) = self.quad_of(t);
        let (b_nw, b_ne, _, _) = self.quad_of(b);
        self.get_or_create(t_sw, t_se, b_nw, b_ne)
    }

    /// Pad `node` up one level, wrapping it in a border of empty cells.
    /// The node stays centered at the origin.
    fn expand(&mut self, node: Rc<Node>) -> Rc<Node> {
        let level = node.level();
        let e = self.empty(level - 1);
        let (nw, ne, sw, se) = self.quad_of(&node);
        let c_nw = self.get_or_create(e.clone(), e.clone(), e.clone(), nw);
        let c_ne = self.get_or_create(e.clone(), e.clone(), ne, e.clone());
        let c_sw = self.get_or_create(e.clone(), sw, e.clone(), e.clone());
        let c_se = self.get_or_create(se, e.clone(), e.clone(), e.clone());
        self.get_or_create(c_nw, c_ne, c_sw, c_se)
    }

    /// Extract the overlapping center of a node. The center of a level `n` node
    /// is a level `n-1` node whose quadrants are the adjoining inner quadrants of
    /// the four children: `se(nw), sw(ne), ne(sw), nw(se)`. For an empty node it
    /// is simply the empty node one level down.
    pub fn get_center(&mut self, node: Rc<Node>) -> Rc<Node> {
        let e = self.empty(node.level() - 1);
        if node.is_empty() {
            return e;
        }

        let (nw, ne, sw, se) = self.quad_of(&node);
        let new_nw = self.quad(&nw, 3); // se
        let new_ne = self.quad(&ne, 2); // sw
        let new_sw = self.quad(&sw, 1); // ne
        let new_se = self.quad(&se, 0); // nw
        self.get_or_create(new_nw, new_ne, new_sw, new_se)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn leaf(nm: &mut HashlifeNodeManager, on: &[(i32, i32)], x: i32, y: i32) -> Rc<Node> {
        if on.contains(&(x, y)) {
            nm.live_leaf.clone()
        } else {
            nm.empty(0)
        }
    }

    /// Build a level-2 (4x4) node with cells `((x,y),1)` in the range x,y in {-2,-1,0,1}.
    fn quad(nm: &mut HashlifeNodeManager, on: &[(i32, i32)], xlo: i32, ylo: i32) -> Rc<Node> {
        let nw = leaf(nm, on, xlo, ylo);
        let ne = leaf(nm, on, xlo + 1, ylo);
        let sw = leaf(nm, on, xlo, ylo + 1);
        let se = leaf(nm, on, xlo + 1, ylo + 1);
        nm.get_or_create(nw, ne, sw, se)
    }

    fn build4x4(nm: &mut HashlifeNodeManager, on: &[(i32, i32)]) -> Rc<Node> {
        let nw = quad(nm, on, -2, -2);
        let ne = quad(nm, on, 0, -2);
        let sw = quad(nm, on, -2, 0);
        let se = quad(nm, on, 0, 0);
        nm.get_or_create(nw, ne, sw, se)
    }

    // ---- toggle ----

    #[test]
    fn test_toggle_single_cell() {
        let mut nm = HashlifeNodeManager::new(4);
        let g = nm.empty(2);

        let g = nm.toggle(g, C(-1, -1));
        assert_eq!(g.at(&C(-1, -1)), 1);
        assert_eq!(g.at(&C(0, 0)), 0);

        let g = nm.toggle(g, C(-1, -1));
        assert_eq!(g.at(&C(-1, -1)), 0);
        assert_eq!(g.at(&C(1, 1)), 0);
    }

    #[test]
    fn test_toggle_restores_empty() {
        let mut nm = HashlifeNodeManager::new(4);
        let g = nm.empty(2);

        let g = nm.toggle(g, C(-2, -2));
        assert_eq!(g.level(), 2);
        let g = nm.toggle(g, C(-2, -2));
        assert!(g.is_empty());
        assert_eq!(g.level(), 2);
    }

    #[test]
    fn test_toggle_preserves_others() {
        let mut nm = HashlifeNodeManager::new(4);
        let g = nm.empty(2);

        let g = nm.toggle(g, C(-1, -1));
        let g = nm.toggle(g, C(1, 1)); // far corner
        assert_eq!(g.at(&C(-1, -1)), 1);
        assert_eq!(g.at(&C(1, 1)), 1);
        assert_eq!(g.at(&C(-1, 0)), 0);
        assert_eq!(g.at(&C(0, 0)), 0);
        assert_eq!(g.at(&C(1, -1)), 0);
    }

    #[test]
    fn test_toggle_every_cell_roundtrip() {
        let mut nm = HashlifeNodeManager::new(4);
        let mut g = nm.empty(2);

        for x in -2..=1 {
            for y in -2..=1 {
                g = nm.toggle(g, C(x, y));
                assert_eq!(g.at(&C(x, y)), 1, "cell ({x},{y}) should be on");
                g = nm.toggle(g, C(x, y));
                assert_eq!(g.at(&C(x, y)), 0, "cell ({x},{y}) should be off");
            }
        }
        assert!(g.is_empty());
        assert_eq!(g.level(), 2);
    }

    // ---- step ----

    #[test]
    fn test_result_empty_level() {
        let mut uni = HashLifeUniverse::new(4);
        let g = uni.node_manager.empty(3);
        let r = uni._result(g);
        assert_eq!(r.level(), 2);
        assert!(r.is_empty());
    }

    #[test]
    fn test_result_level2_block_still_life() {
        let mut uni = HashLifeUniverse::new(4);
        let on = [(-1, -1), (0, -1), (-1, 0), (0, 0)];
        let g = build4x4(&mut uni.node_manager, &on);
        let r = uni._result(g);
        for &(x, y) in &on {
            assert_eq!(r.at(&C(x, y)), 1, "cell ({x},{y}) alive");
        }
    }

    /// Build a level-2 (4x4) node whose cells map relative to origin (xlo, ylo).
    fn build4x4_at(
        nm: &mut HashlifeNodeManager,
        on: &[(i32, i32)],
        xlo: i32,
        ylo: i32,
    ) -> Rc<Node> {
        let nw = quad(nm, on, xlo, ylo);
        let ne = quad(nm, on, xlo + 2, ylo);
        let sw = quad(nm, on, xlo, ylo + 2);
        let se = quad(nm, on, xlo + 2, ylo + 2);
        nm.get_or_create(nw, ne, sw, se)
    }

    /// Build a level-3 (8x8) node spanning x,y in {-4,-3,...,3}.
    fn build8x8(nm: &mut HashlifeNodeManager, on: &[(i32, i32)]) -> Rc<Node> {
        let nw = build4x4_at(nm, on, -4, -4);
        let ne = build4x4_at(nm, on, 0, -4);
        let sw = build4x4_at(nm, on, -4, 0);
        let se = build4x4_at(nm, on, 0, 0);
        nm.get_or_create(nw, ne, sw, se)
    }

    fn render8(nm: &mut HashlifeNodeManager, label: &str, g: &Rc<Node>) {
        eprintln!("--- {label} (level {}) ---", g.level());
        let half = 1 << (g.level() - 1);
        for y in (-half..half).rev() {
            let mut row = String::new();
            for x in -half..half {
                let v = g.at(&Coordinate { x: x, y: y });
                row.push(if v == 1 { '#' } else { '.' });
            }
            eprintln!("{row}");
        }
    }

    #[test]
    fn test_result_level3_dbg() {
        let mut uni = HashLifeUniverse::new(4);
        let on = [(-1, 0), (0, 0), (1, 0)];
        let g = build8x8(&mut uni.node_manager, &on);
        render8(&mut uni.node_manager, "input (y=-4..3 ascending)", &g);
        let r = uni._result(g.clone());
        render8(&mut uni.node_manager, "result level-2", &r);
    }
    #[test]
    fn test_result_level3_blinker_period_2() {
        // A horizontal blinker has period 2; result of a level-3 node advances
        // by 2^(3-2) = 2 generations, so it should reproduce the blinker.
        let mut uni = HashLifeUniverse::new(4);
        let on = [(-1, 0), (0, 0), (1, 0)];
        let g = build8x8(&mut uni.node_manager, &on);
        let r = uni._result(g);
        assert_eq!(r.level(), 2);

        assert_eq!(r.at(&C(-1, 0)), 1, "left blinker cell");
        assert_eq!(r.at(&C(0, 0)), 1, "center blinker cell");
        assert_eq!(r.at(&C(1, 0)), 1, "right blinker cell");
        assert_eq!(r.at(&C(0, -1)), 0);
        assert_eq!(r.at(&C(0, 1)), 0);
    }

    #[test]
    fn test_result_general_pow_blinker() {
        // Horizontal blinker has period 2. result(node, pow) advances by 2^pow
        // generations. For a level-3 (8x8) node, pow=1 must reproduce it.
        let mut uni = HashLifeUniverse::new(4);
        let on = [(-1, 0), (0, 0), (1, 0)];
        let g = build8x8(&mut uni.node_manager, &on);
        let r = uni.result(g, 1);
        assert_eq!(r.level(), 2);
        assert_eq!(r.at(&C(-1, 0)), 1, "left blinker cell");
        assert_eq!(r.at(&C(0, 0)), 1, "center blinker cell");
        assert_eq!(r.at(&C(1, 0)), 1, "right blinker cell");
        assert_eq!(r.at(&C(0, -1)), 0);
        assert_eq!(r.at(&C(0, 1)), 0);
    }

    #[test]
    fn test_population() {
        let mut uni = HashLifeUniverse::new(4);
        let on = [(-1, 0), (0, 0), (1, 0)];
        let g = build8x8(&mut uni.node_manager, &on);
        assert_eq!(g.pop(), 3);

        let r = uni.result(g.clone(), 1);
        assert_eq!(r.pop(), 3, "blinker keeps population");
        assert_eq!(g.pop(), 3, "source node untouched");

        let empty = uni.node_manager.empty(3);
        assert_eq!(empty.pop(), 0);
    }

    #[test]
    fn test_universe_step_by_pow_advances_generation() {
        // A horizontal blinker at level 3 (8x8). step_by_pow(1) advances by
        // 2^1 = 2 generations, reproducing the blinker.
        let mut uni = HashLifeUniverse::new(4);
        let on = [(-1, 0), (0, 0), (1, 0)];
        let g = build8x8(&mut uni.node_manager, &on);
        let root = uni._result(g);

        uni.root = root;
        uni.step_by_pow(1);

        assert_eq!(uni.generation(), 2);
        assert_eq!(uni.root.at(&C(-1, 0)), 1, "left blinker cell");
        assert_eq!(uni.root.at(&C(0, 0)), 1, "center blinker cell");
        assert_eq!(uni.root.at(&C(1, 0)), 1, "right blinker cell");
        assert_eq!(uni.root.at(&C(0, -1)), 0);
        assert_eq!(uni.root.at(&C(0, 1)), 0);
    }
}
