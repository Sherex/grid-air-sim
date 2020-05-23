const { Grid } = require('./lib/grid')

const grid = new Grid([
  ['W', 'W', 'W', 'W', 'W', 'O', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'W', 'A', 'W', 'A', 'A', 'W', 'W', 'A', 'W'],
  ['W', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'W', 'A', 'W', 'W', 'W', 'W', 'W', 'A', 'W', 'W', 'W', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'W', 'A', 'W', 'A', 'A', 'W', 'W', 'A', 'W'],
  ['W', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'O', 'W', 'W', 'W', 'W', 'W']
])

let iteration = 0

const loop = setInterval(() => {
  iteration++
  grid.calculateAir()
  console.clear()
  grid.printGrid(true)
  if (grid.allOutletChecksDone) clearInterval(loop)
}, 100)
