use core::panic;
use std::{borrow::Borrow, cell::RefCell, rc::Rc};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Node {
    MacroCell(MacroCell),
    Leaf(Leaf),
    Empty(u32),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Leaf {
    Dead,
    Alive,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MacroCell {
    pub ul: Rc<RefCell<Node>>,
    pub ur: Rc<RefCell<Node>>,
    pub ll: Rc<RefCell<Node>>,
    pub lr: Rc<RefCell<Node>>,
    pub size: u32,
    pub hash: String,
}

impl Node {
    pub fn get_size(&self) -> u32 {
        match self {
            Node::MacroCell(ref mc) => mc.size,
            Node::Leaf(_) => 0,
            Node::Empty(size) => *size,
        }
    }

    // pub fn get_child(&self) -> Option
    pub fn is_dead(&self) -> bool {
        match self {
            Node::Leaf(leaf) => leaf == &Leaf::Dead,
            Node::MacroCell(mc) => {
                mc.ul.as_ref().borrow().is_dead()
                    && mc.ur.as_ref().borrow().is_dead()
                    && mc.ll.as_ref().borrow().is_dead()
                    && mc.lr.as_ref().borrow().is_dead()
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
                    (0, 0) => mc.ul.as_ref().borrow().state_at(rel_x, rel_y),
                    (0, 1) => mc.ur.as_ref().borrow().state_at(rel_x, rel_y),
                    (1, 0) => mc.ll.as_ref().borrow().state_at(rel_x, rel_y),
                    (1, 1) => mc.lr.as_ref().borrow().state_at(rel_x, rel_y),
                    _ => panic!("Unreachable"),
                }
            }
            Node::Leaf(leaf) => leaf.clone(),
            Node::Empty(_) => Leaf::Dead,
        }
    }

    pub fn get_quad(&self, x: u32, y: u32) -> Rc<RefCell<Node>> {
        let result = match self {
            Node::MacroCell(mc) => match (x, y) {
                (0, 0) => mc.ul.clone(),
                (0, 1) => mc.ur.clone(),
                (1, 0) => mc.ll.clone(),
                (1, 1) => mc.lr.clone(),
                _ => panic!("Unreachable"),
            },
            Node::Empty(size) => Rc::new(RefCell::new(Node::Empty(*size - 1))),
            Node::Leaf(_) => panic!("get_quad called on a leaf node"),
        };

        result
    }

    pub fn new_empty(size: u32) -> Self {
        Node::from(MacroCell::new_empty(size))
    }
}

impl From<MacroCell> for Node {
    fn from(value: MacroCell) -> Self {
        if value.ul.as_ref().borrow().is_dead()
            && value.ur.as_ref().borrow().is_dead()
            && value.ll.as_ref().borrow().is_dead()
            && value.lr.as_ref().borrow().is_dead()
        {
            Node::Empty(value.size)
        } else {
            Node::MacroCell(value)
        }
    }
}

impl Leaf {
    pub fn toggle(&mut self) -> () {
        match *self {
            Leaf::Dead => *self = Leaf::Alive,
            Leaf::Alive => *self = Leaf::Dead,
        }
    }
}

impl MacroCell {
    pub fn new(
        ul: Rc<RefCell<Node>>,
        ur: Rc<RefCell<Node>>,
        ll: Rc<RefCell<Node>>,
        lr: Rc<RefCell<Node>>,
    ) -> MacroCell {
        assert!(
            ul.as_ref().borrow().get_size() == ur.as_ref().borrow().get_size()
                && ur.as_ref().borrow().get_size() == ll.as_ref().borrow().get_size()
                && ll.as_ref().borrow().get_size() == lr.as_ref().borrow().get_size()
        );

        let size = ul.as_ref().borrow().get_size();
        MacroCell {
            ul: ul,
            ur: ur,
            ll: ll,
            lr: lr,
            size: size + 1,
            // this will be a SHA256 / SHA128 hash of the above.
            hash: String::from(""),
        }
    }

    pub fn new_empty(size: u32) -> MacroCell {
        if size == 1 {
            return MacroCell::new(
                Rc::new(RefCell::new(Node::Leaf(Leaf::Dead))),
                Rc::new(RefCell::new(Node::Leaf(Leaf::Dead))),
                Rc::new(RefCell::new(Node::Leaf(Leaf::Dead))),
                Rc::new(RefCell::new(Node::Leaf(Leaf::Dead))),
            );
        }

        MacroCell::new(
            Rc::new(RefCell::new(Node::Empty(size - 1))),
            Rc::new(RefCell::new(Node::Empty(size - 1))),
            Rc::new(RefCell::new(Node::Empty(size - 1))),
            Rc::new(RefCell::new(Node::Empty(size - 1))),
        )
    }
}
