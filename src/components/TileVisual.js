import styled from "styled-components"
import { link, TILE_SIZE } from "./util"
import React, { useEffect, useState } from "react"

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
  will-change: background-image;
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

const buildBackground = (tileObj, adjacentTiles) => {
  return tileObj.textures(adjacentTiles).map(t => link(t)).join(', ')
}

// const TileVisual = ({
const TileVisual = React.memo(({
  tileObj,
  selected,
  breakTimer,
  adjacentTiles
}) => {
  const [timer, setTimer] = useState(null);
  const [background, setBackground] = useState(() => buildBackground(tileObj, adjacentTiles));

  useEffect(() => {
    const newBackground = buildBackground(tileObj, adjacentTiles);
    if (newBackground !== background) {
      const textures = tileObj.textures(adjacentTiles);
      const imagePromises = textures.map(texture => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = `textures/${texture}`;
        });
      });
      
      Promise.all(imagePromises).then(() => {
        setBackground(newBackground);
      });
    }
  }, [tileObj, adjacentTiles, background]);

  useEffect(() => {
    if (selected.x === tileObj.x && selected.y === tileObj.y && breakTimer) {
      requestAnimationFrame(() => {
        setTimer(breakTimer);
      });
    } else {
      setTimer(null);
    }
  }, [breakTimer, selected.x, selected.y, tileObj.x, tileObj.y]);

  return <StyledTile
    className={buildClasses(tileObj)}
    $background={background}
    $x={tileObj.x}
    $y={tileObj.y}
  >
    {(selected.x === tileObj.x && selected.y === tileObj.y) &&
      <SelectedIndicator>
        <BreakBar
          $breakTimer={timer}
        />
      </SelectedIndicator>
    }
  </StyledTile>
// }
}, (prevProps, nextProps) => {
  if (prevProps.tileObj !== nextProps.tileObj) return false;
  if (prevProps.breakTimer !== nextProps.breakTimer) return false;
  if (prevProps.selected.x !== nextProps.selected.x || prevProps.selected.y !== nextProps.selected.y) return false;
  
  for (let i = 0; i < prevProps.adjacentTiles.length; i++) {
    if (prevProps.adjacentTiles[i].tile !== nextProps.adjacentTiles[i].tile) return false;
  }
  
  return true;
});

export default TileVisual