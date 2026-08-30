interface Universe
|-> HashLifeUniverse

HashLifeUniverse
|-> step(power) -> update root node
                |-> 9/13 step recursion + Base Automata
|-> NodeManager

NodeManager #Regular hashmap Rc for now, benchmark with Arenas and GCs later
|-> cache + factory
|-> new node() -> check child hashes -> return from cache
            |-> preconstructed list of empty nodes and nodes of size upto 4

