require('colors')
const { Block, GasOutlet } = require('./blocks')

class Grid {
  constructor (grid) {
    if (!grid) throw Error('Parameter grid <String[][]> required')
    this.grid = grid
    this.blocks = {}
    this.assignBlocks()
    this.assignCoords()
  }

  assignBlocks () {
    this.grid = this.loopGrid((tile) => {
      if (tile === 'W') tile = new Block(undefined, 'Wall')
      else if (tile === 'A') tile = new Block(undefined, 'Air', 100)
      else if (tile === 'O') tile = new GasOutlet(undefined, 'Outlet', 20)
      const type = tile.constructor.name
      this.blocks[type] ? this.blocks[type].push(tile) : this.blocks[type] = [tile]
      return tile
    })
  }

  assignCoords () {
    this.loopGrid((tile, row, x, y) => {
      tile.pos.x = x
      tile.pos.y = y
      tile.parentGrid = this
    })
  }

  printGrid () {
    const printGrid = this.grid.map(row => {
      return row.map(tile => {
        let name = tile.name[0]
        const outlet = this.blocks.GasOutlet[0]
        if (outlet.openTiles.includes(tile)) name = name.green
        if (
          outlet.checkedTiles.includes(tile) &&
          !outlet.openTiles.includes(tile)
        ) name = name.red
        if (tile.name === 'Outlet') { name = name.blue }
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

  loopGrid (callback) {
    return this.grid.map((row, y) => {
      return row.map((tile, x) => {
        return callback(tile, row, x, y)
      })
    })
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
    const outlet = this.getBlock(x, y)
    if (!(outlet instanceof GasOutlet)) throw Error('Not a gas outlet')

    outlet.checkNextTile()
  }
}

module.exports = { Grid }
