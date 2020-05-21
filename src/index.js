require('colors')

class Grid {
  constructor () {
    this.grid = [
      [cWall(), cWall(), cWall(), cWall(), cWall(), cWall(), cWall()],
      [cWall(), cAir(), cAir(), cWall(), cAir(), cAir(), cWall()],
      [cWall(), cAir(), cAir(), cWall(), cAir(), cAir(), cWall()],
      [cWall(), cAir(), cAir(), cWall(), cAir(), cAir(), cPump()],
      [cWall(), cAir(), cAir(), cWall(), cWall(), cAir(), cWall()],
      [cWall(), cAir(), cAir(), cAir(), cAir(), cAir(), cWall()],
      [cWall(), cWall(), cWall(), cWall(), cWall(), cWall(), cWall()]
    ]
    this.assignCoords()
  }

  assignCoords () {
    this.grid.forEach((row, y) => {
      row.forEach((tile, x) => {
        tile.pos.x = x
        tile.pos.y = y
        tile.parentGrid = this
      })
    })
  }

  printGrid () {
    const printGrid = this.grid.map(row => {
      return row.map(tile => {
        let name = tile.name[0]
        if (pump.openTiles.includes(tile)) name = name.green
        if (
          pump.checkedTiles.includes(tile) &&
          !pump.openTiles.includes(tile)
        ) name = name.red
        if (tile.name === 'Pump') { name = name.blue }
        if (tile.name === 'Wall') { name = name.gray }
        if (tile.name === 'Air') { name = name.white }
        return name
      }).join(' ')
    }).join('\n')

    console.log(printGrid)
  }

  getBlock (x, y) {
    if (
      x !== undefined &&
      y === undefined &&
      x.x !== undefined &&
      x.y !== undefined
    ) {
      y = x.y
      x = x.x
    }
    try {
      return this.grid[y][x]
    } catch (error) {
      return undefined
    }
  }

  getNeighbours (x, y, asTile) {
    const neighbours = [
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x - 1, y: y },
      { x: x, y: y - 1 }
    ]
    if (asTile) {
      return neighbours
        .map(n => this.getBlock(n))
        .filter(n => n !== undefined)
    }
    return neighbours
  }

  calculateAir (x, y) {
    const pump = this.getBlock(x, y)
    if (!(pump instanceof GasOutlet)) throw Error('Not a gas outlet')

    pump.checkNextTile()
  }
}

class Block {
  constructor (parentGrid, name, gasThroughput = 0) {
    this.parentGrid = parentGrid
    this.name = name
    this.pos = { x: 0, y: 0 }
    this.gasThroughput = gasThroughput
  }
}

class GasOutlet extends Block {
  constructor (parentGrid, name, gasEmitter = 0) {
    super(parentGrid, name)
    this.gasEmitter = gasEmitter
    this.openTiles = []
    this.checkedTiles = []
    this.toBeCheckedTiles = []
    this.tileCheckDone = false
    this.currentTile = undefined
  }

  checkNextTile (reset) {
    if (reset) {
      this.openTiles = []
      this.checkedTiles = []
      this.toBeCheckedTiles = []
      this.tileCheckDone = false
    }
    if (this.tileCheckDone) return false
    const tile = this.toBeCheckedTiles.length > 0 ? this.toBeCheckedTiles.shift() : this

    const neighbours = this.parentGrid.getNeighbours(tile.pos.x, tile.pos.y, true)
    neighbours.forEach(neighbour => {
      if (this.checkedTiles.includes(neighbour)) return
      this.checkedTiles.push(neighbour)
      if (neighbour.gasThroughput > 0) {
        this.openTiles.push(neighbour)
        this.toBeCheckedTiles.push(neighbour)
      }
    })
    if (this.toBeCheckedTiles.length === 0) this.tileCheckDone = true
    return true
  }
}

const grid = new Grid()

function cAir () { return new Block(undefined, 'Air', 100) }
function cWall () { return new Block(undefined, 'Wall') }
function cPump () { return new GasOutlet(undefined, 'Pump', 20) }

let iteration = 0
const pump = grid.getBlock(6, 3)

const loop = setInterval(() => {
  iteration++
  grid.calculateAir(6, 3)
  console.clear()
  grid.printGrid()
  console.log('I TB Ch Op')
  console.log(`${iteration} ${pump.toBeCheckedTiles.length}  ${pump.checkedTiles.length}  ${pump.openTiles.length}`)
  if (pump.tileCheckDone) clearInterval(loop)
}, 200)
