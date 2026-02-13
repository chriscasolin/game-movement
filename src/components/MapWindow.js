import Inventory from "./Inventory";
import TileVisual from "./TileVisual";
// import '../css/Map.css';
import { direction, directionAsset, mapKey, TILE_SIZE, WINDOW_SIZE_X, WINDOW_SIZE_Y } from "./util";
import styled from "styled-components";
import { useMemo } from "react";

const PlayerContainer = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  position: absolute;
  top: ${Math.floor(WINDOW_SIZE_Y / 2) * TILE_SIZE}px;
  left: ${Math.floor(WINDOW_SIZE_X / 2) * TILE_SIZE}px;
  
  display: flex;
  justify-content: center;
  align-items: end;
`

const PlayerGraphic = styled.div`
  height: 100%;
  width: 100%;
  background-image: ${({ $background }) => $background};
  background-size: cover;
  position: absolute;
  margin-bottom: 25%;
  animation: ${({ $isMoving }) => $isMoving ? 'bob 0.3s infinite' : 'none'};
  
  @keyframes bob {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-3px);
    }
  }
`

const Shadow = styled.div`
  height: 30%;
  width: 60%;
  margin-bottom: 15%;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 2px rgb(0,0,0);
  border-radius: 50%;
  position: absolute;
`

const MapContent = styled.div.attrs(({ $offsetX, $offsetY }) => ({
  style: {
    transform: `translate(${(-$offsetX + Math.floor(WINDOW_SIZE_X / 2)) * TILE_SIZE}px,
                          ${(-$offsetY + Math.floor(WINDOW_SIZE_Y / 2)) * TILE_SIZE}px)`
  }
}))`
  width: ${({ $numCols }) => $numCols * TILE_SIZE}px;
  height: ${({ $numRows }) => $numRows * TILE_SIZE}px;
  position: absolute;
  transition: none;
`;

const Window = styled.div`
  width: ${WINDOW_SIZE_X * TILE_SIZE}px;
  height: ${WINDOW_SIZE_Y * TILE_SIZE}px;
  overflow: hidden;
  position: relative;
  border: 0.2rem solid black;
  background-color: #555;
  margin: 50px auto;
  border-radius: 5px;
`

const MapWindow = ({
  map,
  position,
  facing,
  inventory,
  selected,
  breakTimer,
  isMoving
}) => {
  const numRows = map.size.y;
  const numCols = map.size.x;

  const offsetX = position.x;
  const offsetY = position.y;

  const halfWindowX = Math.floor(WINDOW_SIZE_X / 2);
  const halfWindowY = Math.floor(WINDOW_SIZE_Y / 2);
  const minX = Math.floor(Math.max(0, offsetX - halfWindowX));
  const maxX = Math.floor(Math.min(numCols - 1, offsetX + halfWindowX));
  const minY = Math.floor(Math.max(0, offsetY - halfWindowY));
  const maxY = Math.floor(Math.min(numRows - 1, offsetY + halfWindowY));

  const adjacentCache = useMemo(() => {
    const cache = {};
    for (let y = minY - 1; y <= maxY + 1; y++) {
      for (let x = minX - 1; x <= maxX + 1; x++) {
        const key = mapKey(x, y);
        const adjacents = [];
        const cardinals = direction.cardinal();
        for (let i = 0; i < cardinals.length; i++) {
          const d = cardinals[i];
          const adjKey = mapKey(x + d.dx, y + d.dy);
          adjacents.push({tile: map.tiles[adjKey], direction: d});
        }
        cache[key] = adjacents;
      }
    }
    return cache;
  }, [minX, maxX, minY, maxY, map.tiles]);

  const visibleTiles = useMemo(() => {
    const tiles = [];
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const key = mapKey(x, y);
        tiles.push(
          <TileVisual
            key={key}
            tileObj={map.tiles[key]}
            x={x}
            y={y}
            selected={selected}
            breakTimer={breakTimer}
            adjacentTiles={adjacentCache[key]}
          />
        );
      }
    }
    return tiles;
  }, [minX, maxX, minY, maxY, map.tiles, selected, breakTimer, adjacentCache]);

  return (
    <Window className="map-window">
      <MapContent
        className="map-content"
        $numCols={numCols}
        $numRows={numRows}
        $offsetX={offsetX}
        $offsetY={offsetY}
      >
        {visibleTiles}
      </MapContent>
      <PlayerContainer
        className="player-overlay"
      >
        <Shadow />
        <PlayerGraphic
          $background={directionAsset(facing)}
          $isMoving={isMoving}
        />
      </PlayerContainer>
      {
        inventory.open &&
        <Inventory
          content={inventory.content} />
      }
    </Window>
  );
};

export default MapWindow;