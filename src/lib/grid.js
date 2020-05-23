require('colors')
const { Block, GasOutlet } = require('./blocks')

class Grid {
  constructor (grid) {
    if (!grid) throw Error('Parameter grid <String[][]> required')
    this.allOutletChecksDone = false
    this.blocks = {}
    this.grid = this.assignBlocks(grid)
    this.assignCoords()
  }

  assignBlocks (stringGrid) {
    return this.loopGrid(stringGrid, (tile) => {
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

  printGrid (printOutletStats) {
    const printGrid = this.grid.map(row => {
      return row.map(tile => {
        let name = tile.name[0]
        this.blocks.GasOutlet.forEach(outlet => {
          if (outlet.openTiles.includes(tile)) name = name.green
          if (
            outlet.checkedTiles.includes(tile) &&
            !outlet.openTiles.includes(tile)
          ) name = name.red
        })
        if (tile.name === 'Outlet') { name = name.blue }
        if (tile.name === 'Wall') { name = name.gray }
        if (tile.name === 'Air') { name = name.white }
        return name
      }).join(' ')
    }).join('\n')

    console.log(printGrid)
    if (printOutletStats) {
      this.blocks.GasOutlet.forEach(outlet => { outlet.printStats() })
    }
  }

  getBlock (x, y) {
    try {
      return this.grid[y][x]
    } catch (error) {
      return undefined
    }
  }

  loopGrid (grid, callback) {
    if (typeof grid === 'function') {
      callback = grid
      grid = this.grid
    }
    return grid.map((row, y) => {
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
        .map(n => this.getBlock(n.x, n.y))
        .filter(n => n !== undefined)
    }
    return neighbours
  }

  calculateAir () {
    const checksDone = this.blocks.GasOutlet.map(outlet => {
      if (outlet.tileCheckDone) return true
      outlet.checkNextTile()
      return false
    })
    if (!checksDone.includes(false)) this.allOutletChecksDone = true
  }
}

module.exports = { Grid }
