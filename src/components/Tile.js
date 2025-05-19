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
  border: none;
`

const Tile = ({ data, x, y }) => {
  const buildClasses = (data) => {
    return ["tile", data.ground?.type, data.object?.type].join(' ')
  }

  return <StyledTile
    className={buildClasses(data)} $x={x} $y={y}
  />

}

export default Tile