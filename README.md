# HashLife

This repository contains the implementation of HashLife algorithm in Rust, visualized using HTML and JavaScript through WebAssembly.

## HashLife Algorithm

The hash life algorithm is a space and time compression algorithm that is capable of simulating very large cellular automata efficiently. It was proposed by Bill Gosper in the paper titled [Exploiting Regularities In Large Cellular Spaces ](https://www.lri.fr/~filliatr/m1/gol/gosper-84.pdf). A demo can be found [here](https://prathamkundan.github.io/hashlife/).

## Development
### Prerequisites to build
- Rust toolchain
- wasm-pack
- npm

### Building
Clone this repository and run `wasm-pack build` in the root directory. This will generate a `pkg` directory containing the wasm module.

Then, navigate to the `www` directory and run `npm install` to install the required dependencies.

Finally, run `npm run start` to start the development server. You can now access the visualization at `http://localhost:8080`

## TODO
- [x] Implement the algorithm
- [x] Visualize the algorithm
- [ ] Add time skipping
- [ ] Make it faster :' )
- [ ] Improve UI
