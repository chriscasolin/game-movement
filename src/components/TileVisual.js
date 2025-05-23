import styled from "styled-components"
import { link, TILE_SIZE } from "./util"
import { useEffect, useState } from "react"

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

const buildClasses = (tileObj) => {
  return ["tile", tileObj.ground?.name, tileObj.object?.name].join(' ')
}

const buildBackground = (tileObj) => {
  let sources = []

  if (tileObj.object) {
    sources.push(tileObj.object.texture)
  }
  if (tileObj.ground) {
    sources.push(tileObj.ground.texture)
  }

  const ret = sources.map(s => link(s)).join(', ')
  return ret
}

const TileVisual = ({
  data,
  x,
  y,
  selected,
  breakTimer
}) => {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (selected.x === x && selected.y === y && breakTimer) {
      requestAnimationFrame(() => {
        setTimer(breakTimer);
      });
    } else {
      setTimer(null);
    }
  }, [breakTimer, selected.x, selected.y]);


  return <StyledTile
    className={buildClasses(data)}
    $background={buildBackground(data)}
    $x={x}
    $y={y}
  >
    {(selected.x === x && selected.y === y) &&
      <SelectedIndicator>
        <BreakBar
          $breakTimer={timer}
        />
      </SelectedIndicator>
    }
  </StyledTile>

}

export default TileVisual