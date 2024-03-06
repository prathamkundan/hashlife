#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Node {
    MacroCell(MacroCell),
    Leaf(Leaf),
    Empty(u32)
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Leaf {
    Dead,
    Alive,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct MacroCell {
    pub ul: Box<Node>,
    pub ur: Box<Node>,
    pub ll: Box<Node>,
    pub lr: Box<Node>,
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
                mc.ul.is_dead() && mc.ur.is_dead() && mc.ll.is_dead() && mc.lr.is_dead()
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
    pub fn new(ul: Box<Node>, ur: Box<Node>, ll: Box<Node>, lr: Box<Node>) -> Box<MacroCell> {
        assert!(
            ul.get_size() == ur.get_size()
                && ur.get_size() == ll.get_size()
                && ll.get_size() == lr.get_size()
        );

        let size = ul.as_ref().get_size();
        Box::new(MacroCell {
            ul: ul,
            ur: ur,
            ll: ll,
            lr: lr,
            size: size + 1,
            // this will be a SHA256 / SHA128 hash of the above.
            hash: String::from(""),
        })
    }

    pub fn new_empty(size: u32) -> Box<MacroCell> {
        if size == 1 {
            return MacroCell::new(
                Box::new(Node::Leaf(Leaf::Dead)),
                Box::new(Node::Leaf(Leaf::Dead)),
                Box::new(Node::Leaf(Leaf::Dead)),
                Box::new(Node::Leaf(Leaf::Dead)),
            );
        }

        MacroCell::new(
            Box::new(Node::Empty(size - 1)),
            Box::new(Node::Empty(size - 1)),
            Box::new(Node::Empty(size - 1)),
            Box::new(Node::Empty(size - 1)),
        )
    }
}
