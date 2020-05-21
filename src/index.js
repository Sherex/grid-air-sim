const { Grid } = require('./lib/grid')

const grid = new Grid([
  ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'O'],
  ['W', 'A', 'A', 'W', 'W', 'A', 'W'],
  ['W', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W']
])

let iteration = 0
const outlet = grid.getBlock(6, 3)

const loop = setInterval(() => {
  iteration++
  grid.calculateAir(6, 3)
  console.clear()
  grid.printGrid()
  console.log('I TB Ch Op')
  console.log(`${iteration} ${outlet.toBeCheckedTiles.length}  ${outlet.checkedTiles.length}  ${outlet.openTiles.length}`)
  if (outlet.tileCheckDone) clearInterval(loop)
}, 0)
