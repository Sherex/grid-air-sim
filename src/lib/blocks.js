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

module.exports = {
  Block,
  GasOutlet
}
