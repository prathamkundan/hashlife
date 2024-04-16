use core::panic;
use std::{hash::Hash, ptr, rc::Rc};

#[derive(Debug)]
/// Represents a node in the quadtree
/// 
/// A node can be a macrocell, a leaf or an empty cell.
pub enum Node {
    MacroCell(MacroCell),
    Leaf(Leaf),
    Empty(u32),
}

#[derive(Debug, Clone, PartialEq, Eq)]
/// Represents the state of a cell in the game of life.
pub enum Leaf {
    Dead = 0,
    Alive = 1,
}

#[derive(Debug)]
/// Represents a macrocell in the quadtree
/// 
/// A MacroCell is a cell that contains 4 other cells. Its size
/// is always one greater than the size of its children.
pub struct MacroCell {
    pub ul: Rc<Node>,
    pub ur: Rc<Node>,
    pub ll: Rc<Node>,
    pub lr: Rc<Node>,
    pub size: u32,
}

/// Implementing the Hash trait for the Node enum
/// 
/// This implementation is necessary to use the Node enum as a key in a HashMap.
/// The implementation uses the pointer of Node as the hash value. There is 
/// probably a better way to implement this.
impl Hash for Node {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        ptr::hash(&*self, state);
    }

}

/// Implementing the PartialEq trait for the Node enum
/// 
/// This implementation is necessary to compare two Node instances.
impl PartialEq for Node {
    fn eq(&self, other: &Self) -> bool {
        ptr::eq(&*self, &*other)
    }

}

/// Implementing the Eq trait for the Node enum
impl Eq for Node {}

impl Node {
    /// Returns the size of the node. 
    /// 
    /// The size is log2 of the number of cells in row/column of the node.
    pub fn get_size(&self) -> u32 {
        match self {
            Node::MacroCell(ref mc) => mc.size,
            Node::Leaf(_) => 0,
            Node::Empty(size) => *size,
        }
    }

    /// Returns true if the node is dead.
    /// 
    /// Recursive function that checks if all the quadrants of the node are dead.
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

    /// Returns the state of the cell at the given coordinates.
    /// 
    /// A recursive function that traverses the quadtree to find the cell at the given coordinates.
    pub fn state_at(&self, x: u32, y: u32) -> Leaf {
        match self {
            Node::MacroCell(mc) => {
                let child_block_size = 1 << (mc.size - 1);
                // Find the relative coordinates of the cell in the quadrant
                let rel_x = x % (child_block_size);
                let rel_y = y % (child_block_size);
                // Find the quadrant where x and y lie
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

    /// Returns an empty node of the given size.
    pub fn new_empty(size: u32) -> Self {
        // Probably should just return an Empty node
        Node::from(MacroCell::new_empty(size))
    }
}

/// Implementing the From trait for the Node enum for convenience.
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
    /// Toggles the state of the cell.
    /// 
    /// If the cell is dead, it returns an Alive cell and vice versa.
    pub fn toggle(&self) -> Self {
        match *self {
            Leaf::Dead => Leaf::Alive,
            Leaf::Alive => Leaf::Dead,
        }
    }
}

impl MacroCell {
    /// Creates a new MacroCell with the given quadrants.
    /// 
    /// The size of the MacroCell is one greater than the size of the quadrants.
    pub fn new(ul: Rc<Node>, ur: Rc<Node>, ll: Rc<Node>, lr: Rc<Node>) -> MacroCell {
        // Assert that all the quadrants have the same size.
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
        }
    }

    /// Creates a new empty MacroCell of the given size.
    /// 
    /// If the size is 1, it returns a MacroCell with all dead cells.
    pub fn new_empty(size: u32) -> MacroCell {
        // probably an unnecessary function.
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
