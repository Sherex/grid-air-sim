# Grid-Air-Sim

Random idea I got to simulate gas in an 2D array. It does some pathfinding, then checks if the tile is open or not. It now also simulates gas movements between tiles based on the throughput of each tile.

![WebPreview](./assets/web-preview.gif)

## What it does
Currently it simulates one or more "outlets" on the grid. Each iteration it finds the neighbours to the current tile and checks if they are open (tile.gasThroughput > 0).  
Then adds it to the "checkedTiles" array, and to "openTiles" if it's open.

When it is done checking for open tiles, the outlets begin to push "gas" out to it's open neighbours. Then all open tiles that has more than 0 gas will try to equilize the gas between them. Based on the difference of gas between them and their max throughput.

## Previews:
[Web](./assets/previews.md#Web)  
[Terminal](./assets/previews.md#Terminal)  

## How to run
```sh
$ git clone https://github.com/Sherex/grid-air-sim.git
$ cd grid-air-sim
$ npm i
```
### CLI
Edit `src/cli/index.js` to your liking, for example editing the grid.
```sh
$ npm start
```

### Web
Edit `src/web/sketch.js` to your liking, for example editing the grid.
```sh
# Linux / Mac
$ npm run nix-dev # Runs build and web scripts concurrently
# Windows
$ npm run build # Run webpack
$ npm run web   # Run live-server and open browser
```
For easier development on Windows you should run
`npm run build -- -w` (watch mode) in one terminal and `npm run web` in another.

### As a lib
You can import it as a lib too:
```js
const { Grid } = require('path/to/lib/grid-air-sim')

const grid = new Grid([
  ['W', 'W', 'W', 'W', 'W', 'O', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'W', 'A', 'W'],
  ['W', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W']
])

;(async () => {
  while (true) {
    grid.nextIteration()
    console.clear()
    grid.printGrid({
      printOutletStats: true,
      showAmountOfGas: true
    })
    await timeout(100)
  }
})()

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

## Development
```sh
$ git clone https://github.com/Sherex/grid-air-sim.git
$ cd grid-air-sim
$ npm i
```

## License

[MIT](LICENSE)
