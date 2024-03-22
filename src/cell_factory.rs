use std::{collections::HashMap, rc::Rc};

use web_sys::console;

use crate::{cell::{Leaf, MacroCell, Node}, utils::Timer};

pub struct CellFactory {
    node_cache: HashMap<String, Rc<Node>>,
    result_cache: HashMap<String, Rc<Node>>,
}

impl CellFactory {
    pub fn new() -> Self {
        CellFactory {
            node_cache: HashMap::new(),
            result_cache: HashMap::new(),
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
        if ul.is_dead() && ur.is_dead() && ll.is_dead() && lr.is_dead() {
            return self.get_empty(ul.get_size() + 1);
        }
        let ans = Rc::new(Node::from(MacroCell::new(ul, ur, ll, lr)));
        // self.node_cache.insert(node_hash, ans.clone());
        return ans;
        let node_hash = Node::calculate_hash(
            &ul.get_hash(),
            &ur.get_hash(),
            &ll.get_hash(),
            &lr.get_hash(),
        );
        // let timer = Timer::new("construct node");
        if let Some(node) = self.node_cache.get(&node_hash) {
            console::log_1(&"Hit".into());
            node.clone()
        } else {
            if ul.is_dead() && ur.is_dead() && ll.is_dead() && lr.is_dead() {
                return self.get_empty(ul.get_size() + 1);
            }
            let ans = Rc::new(Node::from(MacroCell::new(ul, ur, ll, lr)));
            self.node_cache.insert(node_hash, ans.clone());
            ans
        }
    }

    pub fn get_result(&self, node: &Node) -> Option<Rc<Node>> {
        let node_hash = node.get_hash();
        self.result_cache.get(&node_hash).cloned()
    }

    pub fn cache_result(&mut self, node: &Node, result: Rc<Node>) {
        self.result_cache.insert(node.get_hash(), result);
    }

    pub fn get_empty(&mut self, size: u32) -> Rc<Node> {
        if size == 0 {
            return self.get_leaf(Leaf::Dead);
        }
        let mut hash = Node::calculate_hash("0", "0", "0", "0");
        for _ in 0..size - 1 {
            hash = Node::calculate_hash(&hash, &hash, &hash, &hash)
        }
        if let Some(node) = self.node_cache.get(&hash) {
            node.clone()
        } else {
            let ans = Rc::new(Node::new_empty(size));
            self.node_cache.insert(hash, ans.clone());
            ans
        }
    }

    pub fn get_leaf(&mut self, variant: Leaf) -> Rc<Node> {
        let hash = match variant {
            Leaf::Dead => "0".to_owned(),
            Leaf::Alive => "1".to_owned(),
        };
        if let Some(node) = self.node_cache.get(&hash) {
            node.clone()
        } else {
            let leaf = Rc::new(Node::Leaf(variant));
            self.node_cache.insert(hash, leaf.clone());
            leaf
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
