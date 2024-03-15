use sha2::{Digest, Sha256};

mod cell;
mod cell_manager;
mod node_factory;

fn main() {
    let x = Sha256::digest("Hello");
    let st = hex::encode(x);
    println!("{:?}", st);
}
