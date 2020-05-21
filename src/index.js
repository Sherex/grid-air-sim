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
    pump.openTiles.forEach(tile => { tile.gas = true })
    pump.checkedTiles.forEach(tile => { tile.noGas = !pump.openTiles.includes(tile) })

    const printGrid = this.grid.map(row => {
      return row.map(tile => {
        // const spaces = ' '.repeat(1 - tile.timesChecked.toString().length)
        // let name = tile.timesChecked.toString() + spaces

        let name = tile.name[0]
        if (tile === active) name = name.yellow
        if (tile.gas) name = name.green
        if (tile.noGas) name = name.red
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

    pump.checkNextTile2()
  }
}

class Block {
  constructor (parentGrid, name, gasThroughput = 0) {
    this.parentGrid = parentGrid
    this.name = name
    this.pos = { x: 0, y: 0 }
    this.gasThroughput = gasThroughput
    this.gas = false
    this.noGas = false
    this.timesChecked = 0
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
  }

  checkNextTile () {
    const { x, y } = this.pos

    if (this.tileCheckDone) return false
    if (this.toBeCheckedTiles.length === 0) this.addNeighboursToBeChecked(x, y)
    const tile = this.toBeCheckedTiles.shift()
    active = tile

    this.checkedTiles.push(tile)
    tile.timesChecked++

    if (tile.gasThroughput > 0) {
      this.openTiles.push(tile)
      this.addNeighboursToBeChecked(tile.pos.x, tile.pos.y)
    }
    return true
  }

  addNeighboursToBeChecked (x, y) {
    this.parentGrid.getNeighbours(x, y, true).forEach(neighbour => {
      if (!this.checkedTiles.includes(neighbour)) {
        this.toBeCheckedTiles.push(neighbour)
      }
    })
  }

  checkNextTile2 () {
    if (this.tileCheckDone) return false
    const tile = this.toBeCheckedTiles.length > 0 ? this.toBeCheckedTiles.shift() : this
    active = tile

    const neighbours = this.parentGrid.getNeighbours(tile.pos.x, tile.pos.y, true)
    neighbours.forEach(neighbour => {
      if (this.checkedTiles.includes(neighbour)) return
      neighbour.timesChecked++
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

// console.log(grid.getBlock(6,3))
let active
const done = false
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

// console.log(grid.getNeighbours(5, 1, true))
// console.log(grid.getBlock({ x: 5, y: 0 }))
