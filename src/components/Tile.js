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
  background-image: ${({ $background }) => $background};
  background-size: cover;
`
const buildClasses = (data) => {
  return ["tile", data.ground?.type, data.object?.type].join(' ')
}

const source = (asset) => {
  switch (asset) {
    case ('grass'): return 'grass.png'
    case ('stone'): return 'stone.png'
    case ('barrier'): return 'barrier.png'
    case ('tree'): return 'tree_outlined.png'
    default: return 'missing.png'
  }
}

const buildBackground = (data) => {
  const link = (filename) => `url('textures/${filename}')`
  let sources = []

  if (data.object) {
    sources.push(source(data.object.type))
  }
  if (data.ground) {
    sources.push(source(data.ground.type))
  }

  const ret = sources.map(s => link(s)).join(', ')
  return ret
}

const Tile = ({ data, x, y }) => {
  return <StyledTile
    className={buildClasses(data)}
    $background={buildBackground(data)}
    $x={x}
    $y={y}
  />

}

export default Tile