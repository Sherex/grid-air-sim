/* eslint-disable no-undef */
const { Grid } = airSim
const grid = new Grid([
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'W', 'A', 'W', 'A', 'A', 'W', 'W', 'A', 'W'],
  ['W', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'W', 'A', 'W', 'W', 'W', 'W', 'W', 'V', 'W', 'W', 'W', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'A', 'A', 'O', 'A', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'W', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'A', 'A', 'V', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']
])

const canvasWidth = 800
const canvasHeight = 800
const squareWidth = canvasWidth / grid.grid[0].length
const squareHeight = canvasHeight / grid.grid.length

// eslint-disable-next-line no-unused-vars
function setup () {
  createCanvas(canvasWidth, canvasHeight)
}

// eslint-disable-next-line no-unused-vars
function draw () {
  background(220)
  grid.loopGrid((tile, row, x, y) => {
    fill(getColor(tile.name, tile.gasAmount).block)
    rect(x * squareWidth, y * squareHeight, squareWidth, squareHeight)
    fill(getColor(tile.name, tile.gasAmount).text)
    text(tile.name, x * squareWidth + squareWidth / 2, y * squareHeight + squareHeight / 2)
    textAlign(CENTER, CENTER)
    if (tile.gasAmount > 0) text(tile.gasAmount, x * squareWidth + squareWidth / 2, (y * squareHeight + squareHeight / 2) + 20)
  })
  grid.nextIteration()
  fill(255, 255, 255)
}

function getColor (name, val) {
  if (name === 'Wall') return { block: color(32, 32, 32), text: color(128, 128, 128) }
  else if (name === 'Air') return { block: color(128, 255 / 100 * val, 128), text: color(0, 0, 0) }
  else if (name === 'Outlet') return { block: color(0, 128, 255), text: color(0, 0, 0) }
  else if (name === 'Vent') return { block: color(255, 0, 255), text: color(0, 0, 0) }
  else if (name === 'BigVent') return { block: color(255, 0, 255), text: color(0, 0, 0) }
}
