use std::{collections::HashMap, rc::Rc};

use crate::cell::{Leaf, MacroCell, Node};

pub struct CellFactory {
    node_cache: HashMap<[Rc<Node>; 4], Rc<Node>>,
    result_cache: HashMap<Rc<Node>, Rc<Node>>,
    empty_cache: Vec<Option<Rc<Node>>>,
    leaf_cache: [Rc<Node>; 2],
}

impl CellFactory {
    pub fn new() -> Self {
        CellFactory {
            node_cache: HashMap::new(),
            result_cache: HashMap::new(),
            empty_cache: (0..64).map(|_| None).collect(),
            leaf_cache: [
                Rc::new(Node::Leaf(Leaf::Dead)),
                Rc::new(Node::Leaf(Leaf::Alive)),
            ],
        }
    }

    pub fn node_from(
        &mut self,
        ul: Rc<Node>,
        ur: Rc<Node>,
        ll: Rc<Node>,
        lr: Rc<Node>,
    ) -> Rc<Node> {
        // let timer = Timer::new("calculate_hash");
        // let timer = Timer::new("construct node");
        if let Some(node) = self
            .node_cache
            .get(&[ul.clone(), ur.clone(), ll.clone(), lr.clone()])
        {
            // console::log_1(&"Hit".into());
            node.clone()
        } else {
            if ul.is_dead() && ur.is_dead() && ll.is_dead() && lr.is_dead() {
                return self.get_empty(ul.get_size() + 1);
            }
            let ans = Rc::new(Node::from(MacroCell::new(
                ul.clone(),
                ur.clone(),
                ll.clone(),
                lr.clone(),
            )));
            self.node_cache.insert([ul, ur, ll, lr], ans.clone());
            ans
        }
    }

    pub fn get_result(&self, node: Rc<Node>) -> Option<Rc<Node>> {
        self.result_cache.get(&node).cloned()
    }

    pub fn cache_result(&mut self, node: Rc<Node>, result: Rc<Node>) {
        self.result_cache.insert(node, result);
    }

    pub fn get_empty(&mut self, size: u32) -> Rc<Node> {
        if let Some(node) = self.empty_cache[size as usize].clone() {
            node
        } else {
            if size == 0 {
                return self.get_leaf(Leaf::Dead);
            }
            let ans = Rc::new(Node::new_empty(size));
            self.empty_cache[size as usize]= Some(ans.clone());
            ans
        }
    }

    pub fn get_leaf(&mut self, variant: Leaf) -> Rc<Node> {
        match variant {
            Leaf::Alive => self.leaf_cache[1].clone(),
            Leaf::Dead => self.leaf_cache[0].clone(),
        }
    }

    pub fn get_quad(&mut self, node: &Node, x: u32, y: u32) -> Rc<Node> {
        let result = match node {
            Node::MacroCell(mc) => match (x, y) {
                (0, 0) => mc.ul.clone(),
                (0, 1) => mc.ur.clone(),
                (1, 0) => mc.ll.clone(),
                (1, 1) => mc.lr.clone(),
                _ => panic!("Unreachable"),
            },
            Node::Empty(size) => self.get_empty(*size - 1),
            Node::Leaf(_) => panic!("get_quad called on a leaf node"),
        };

        result
    }
}
