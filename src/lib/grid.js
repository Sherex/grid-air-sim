require('colors')
const { Block, GasOutlet } = require('./blocks')

/**
 * Class that creates and manipulates a grid
 */
class Grid {
  /**
   * Converts the provided 2D array of strings into a grid
   * @param {string[][]} grid 2D array of string to be converted into a grid of Blocks
   */
  constructor (grid) {
    if (!grid) throw Error('Parameter grid <String[][]> required')
    this.allOutletChecksDone = false
    this.blocks = {}
    this.grid = this.assignBlocks(grid)
    this.assignCoords()
  }

  nextIteration () {
    if (!this.allOutletChecksDone) this.findOpenTilesPerOutlet()
    if (this.allOutletChecksDone) this.equalizeGas()
  }

  assignBlocks (stringGrid) {
    return this.loopGrid(stringGrid, (tile) => {
      if (tile === 'W') tile = new Block({ name: 'Wall' })
      else if (tile === 'A') tile = new Block({ name: 'Air', gasThroughput: 30 })
      else if (tile === 'V') tile = new Block({ name: 'Vent', gasThroughput: 5 })
      else if (tile === 'O') tile = new GasOutlet({ name: 'Outlet', gasEmitAmount: 100 })
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

  printGrid ({ printOutletStats, showTimesChecked }) {
    const printGrid = this.grid.map(row => {
      return row.map(tile => {
        let name = addSpaces(tile.name[0], 3)
        if (tile.name === 'Outlet') { name = name.blue }
        if (showTimesChecked && tile.gasAmount > 0) {
          name = addSpaces(tile.gasAmount.toString(), 3)
        }

        this.blocks.GasOutlet.forEach(outlet => {
          if (outlet.openTiles.includes(tile)) name = name.green
        })

        if (tile.name === 'Wall') { name = name.gray }
        if (tile.name === 'Air') { name = name.white }
        return name
      }).join('')
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

  findOpenTilesPerOutlet () {
    const checksDone = this.blocks.GasOutlet.map(outlet => {
      if (outlet.tileCheckDone) return true
      outlet.checkNextTile()
      return false
    })
    if (!checksDone.includes(false)) this.allOutletChecksDone = true
  }

  equalizeGas () {
    this.blocks.GasOutlet.forEach(outlet => {
      outlet.fillGasAmount()
      const tileToEqualize = [
        ...this.blocks.GasOutlet,
        ...outlet.openTiles
      ]
      tileToEqualize.forEach(tile => tile.transferGas())
    })
  }
}

module.exports = { Grid }

function addSpaces (item, space) {
  const len = space - item.toString().length
  return item + ' '.repeat(len >= 0 ? len : 0)
}
