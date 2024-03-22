use core::panic;
use std::rc::Rc;

use sha2::{Digest, Sha256};

#[derive(Debug, PartialEq, Eq)]
pub enum Node {
    MacroCell(MacroCell),
    Leaf(Leaf),
    Empty(u32),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Leaf {
    Dead = 0,
    Alive = 1,
}

#[derive(Debug, PartialEq, Eq)]
pub struct MacroCell {
    pub ul: Rc<Node>,
    pub ur: Rc<Node>,
    pub ll: Rc<Node>,
    pub lr: Rc<Node>,
    pub size: u32,
    pub hash: String,
}

impl Node {
    pub fn calculate_hash(ul: &str, ur: &str, ll: &str, lr: &str) -> String {
        let hash_buf = Sha256::digest(ul.to_owned() + &ur + &ll + &lr);
        hex::encode(hash_buf)
    }

    pub fn get_hash(&self) -> String {
        match self {
            Node::MacroCell(mc) => mc.hash.clone(),
            Node::Empty(size) => {
                let mut result = Self::calculate_hash("0", "0", "0", "0");
                for _ in 0..*size - 1 {
                    result = Self::calculate_hash(&result, &result, &result, &result);
                }
                result
            }
            Node::Leaf(l) => {
                if let Leaf::Alive = l {
                    "1".to_owned()
                } else {
                    "0".to_owned()
                }
            }
        }
    }

    pub fn get_size(&self) -> u32 {
        match self {
            Node::MacroCell(ref mc) => mc.size,
            Node::Leaf(_) => 0,
            Node::Empty(size) => *size,
        }
    }

    pub fn is_dead(&self) -> bool {
        match self {
            Node::Leaf(leaf) => leaf == &Leaf::Dead,
            Node::MacroCell(mc) => {
                mc.ul.is_dead()
                    && mc.ur.as_ref().is_dead()
                    && mc.ll.as_ref().is_dead()
                    && mc.lr.as_ref().is_dead()
            }
            Node::Empty(_) => true,
        }
    }

    pub fn state_at(&self, x: u32, y: u32) -> Leaf {
        match self {
            Node::MacroCell(mc) => {
                let child_block_size = 1 << (mc.size - 1);
                let rel_x = x % (child_block_size);
                let rel_y = y % (child_block_size);
                let x = x / child_block_size;
                let y = y / child_block_size;
                match (x, y) {
                    (0, 0) => mc.ul.state_at(rel_x, rel_y),
                    (0, 1) => mc.ur.state_at(rel_x, rel_y),
                    (1, 0) => mc.ll.state_at(rel_x, rel_y),
                    (1, 1) => mc.lr.state_at(rel_x, rel_y),
                    _ => panic!("Unreachable"),
                }
            }
            Node::Leaf(leaf) => leaf.clone(),
            Node::Empty(_) => Leaf::Dead,
        }
    }

    pub fn new_empty(size: u32) -> Self {
        Node::from(MacroCell::new_empty(size))
    }
}

impl From<MacroCell> for Node {
    fn from(value: MacroCell) -> Self {
        if value.ul.is_dead() && value.ur.is_dead() && value.ll.is_dead() && value.lr.is_dead() {
            Node::Empty(value.size)
        } else {
            Node::MacroCell(value)
        }
    }
}

impl Leaf {
    pub fn toggle(&self) -> Self {
        match *self {
            Leaf::Dead => Leaf::Alive,
            Leaf::Alive => Leaf::Dead,
        }
    }
}

impl MacroCell {
    pub fn new(ul: Rc<Node>, ur: Rc<Node>, ll: Rc<Node>, lr: Rc<Node>) -> MacroCell {
        assert!(
            ul.get_size() == ur.get_size()
                && ur.get_size() == ll.get_size()
                && ll.get_size() == lr.get_size()
        );

        let size = ul.get_size();
        MacroCell {
            ul: ul.clone(),
            ur: ur.clone(),
            ll: ll.clone(),
            lr: lr.clone(),
            size: size + 1,
            // this will be a SHA256 / SHA128 hash of the above.
            hash: Node::calculate_hash(
                &ul.get_hash(),
                &ur.get_hash(),
                &ll.get_hash(),
                &lr.get_hash(),
            ),
        }
    }

    pub fn new_empty(size: u32) -> MacroCell {
        if size == 1 {
            let dead_ref = Rc::new(Node::Leaf(Leaf::Dead));
            return MacroCell::new(
                dead_ref.clone(),
                dead_ref.clone(),
                dead_ref.clone(),
                dead_ref.clone(),
            );
        }

        let empty_ref = Rc::new(Node::Empty(size - 1));
        MacroCell::new(
            empty_ref.clone(),
            empty_ref.clone(),
            empty_ref.clone(),
            empty_ref.clone(),
        )
    }
}
