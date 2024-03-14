use std::{collections::HashMap, rc::Rc};

use crate::cell::Node;

struct CellFactory<'a> {
    cache: HashMap<&'a str, Rc<Node>>
}
