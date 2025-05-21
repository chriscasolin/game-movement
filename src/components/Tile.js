import styled from "styled-components"
import { link, TILE_SIZE } from "./util"

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

const SelectedIndicator = styled.div`
  height: 95%;
  width: 95%;
  background-color: rgba(255,255,255, 0.1);
  border: 0.1rem solid rgba(0,0,0, 0.5);
`

const BreakBar = styled.div`
  height: ${({ $breakTimer }) => $breakTimer ? 100 : 0}%;
  width: 100%;
  transition: ${({ $breakTimer }) => $breakTimer ? $breakTimer / 1000 : 0}s linear;
  background-color: rgba(0,0,0, 0.4);
  position: absolute;
  bottom: 0;
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

const Tile = ({
  data,
  x,
  y,
  selected,
  breakTimer
}) => {
  return <StyledTile
    className={buildClasses(data)}
    $background={buildBackground(data)}
    $x={x}
    $y={y}
  >
    {(selected.x === x && selected.y === y) &&
      <SelectedIndicator>
        <BreakBar
        $breakTimer={breakTimer}
        />
      </SelectedIndicator>
    }
  </StyledTile>

}

export default Tile