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

  printStats () {
    function addSpaces (item, space) {
      const len = space - item.toString().length
      return item + ' '.repeat(len >= 0 ? len : 0)
    }
    console.log('X  Y - ToBeCh Checked Open')
    const stats = [
      `${addSpaces(this.pos.x, 2)} ${addSpaces(this.pos.y, 2)}  `,
      `${addSpaces(this.toBeCheckedTiles.length, 5)}  `,
      `${addSpaces(this.checkedTiles.length, 6)}  `,
      `${this.openTiles.length}`
    ]
    console.log(stats.join(''))
  }
}

module.exports = {
  Block,
  GasOutlet
}
