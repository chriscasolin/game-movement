import styled from "styled-components"
import { TILE_SIZE } from "./util"

const StyledTile = styled.div.attrs(({ $x, $y }) => ({
  style: {
    left: `${$x * TILE_SIZE}px`,
    top: `${$y * TILE_SIZE}px`
  },
}))`
  position: absolute;
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
`

const Tile = ({ value, hasPlayer, x, y }) => {
  const valToClass = (value) => {
    switch (value) {
      case 'X':
        return 'obstacle'
      case '.':
        return 'none'
      default:
        return 'empty'
    }
  }

  const buildClasses = (value) => {
    return ["Tile", valToClass(value), hasPlayer ? 'player' : ''].join(' ')
  }

  return <StyledTile className={buildClasses(value)} $x={x} $y={y}
  />

}

export default Tile