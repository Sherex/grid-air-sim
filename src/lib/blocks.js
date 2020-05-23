/** Class that creates a block */
class Block {
  /**
   * Creates a block to be placed in the grid
   * @typedef {constructor} Block
   * @param {object} params Contains parameters
   * @param {*} params.parentGrid The grid this block is located within
   * @param {string} params.name The name of this block (ex. 'Wall', 'Air')
   * @param {number} params.x The x coordinate of this block within it's parentGrid
   * @param {number} params.y The y coordinate of this block within it's parentGrid
   * @param {number} params.gasThroughput The amount of gas this block can move in one iteration
   */
  constructor (params) {
    this.parentGrid = params.parentGrid
    this.name = params.name
    this.pos = { x: params.x || 0, y: params.y || 0 }
    this.gasThroughput = params.gasThroughput
  }
}

/**
 * Class that creates a gas outlet
 * @extends Block
 */
class GasOutlet extends Block {
  /**
   * Creates a block that emits gas and finds all blocks it's connected to
   * @param {object} params Contains parameters
   * @param {*} params.parentGrid The grid this block is located within
   * @param {string} params.name The name of this block (ex. 'Wall', 'Air')
   * @param {number} params.x The x coordinate of this block within it's parentGrid
   * @param {number} params.y The y coordinate of this block within it's parentGrid
   * @param {number} params.gasThroughput The amount of gas this block can move in one iteration
   * @param {number} params.gasEmitAmount The amount of gas this block emits in one iteration
   */
  constructor (params) {
    super(params)
    this.gasEmitAmount = params.gasEmitAmount
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
