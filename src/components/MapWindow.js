import Inventory from "./Inventory";
import Tile from "./Tile";
// import '../css/Map.css';
import { directionAsset, mapKey, TILE_SIZE, WINDOW_SIZE_X, WINDOW_SIZE_Y } from "./util";
import styled from "styled-components";

const PlayerOverlay = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  position: absolute;
  top: ${Math.floor(WINDOW_SIZE_Y / 2) * TILE_SIZE - TILE_SIZE / 4}px;
  left: ${Math.floor(WINDOW_SIZE_X / 2) * TILE_SIZE}px;
  background-image: ${({ $background }) => $background};
  background-size: cover;
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
  transition: transform 0.45s;
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

const TargetContainer = styled.div`
  height: ${TILE_SIZE}px;
  width: ${TILE_SIZE}px;
  position: absolute;
  top: ${({$target}) => (Math.floor(WINDOW_SIZE_Y / 2) + $target.y) * TILE_SIZE}px;
  left: ${({$target}) => (Math.floor(WINDOW_SIZE_Y / 2) + $target.x + 2) * TILE_SIZE}px;

  transition: top 0.2s, left 0.2s;

  display: flex;
  justify-content: center;
  align-items: center;
`

const TargetVisual = styled.div`
  height: ${TILE_SIZE / 1.4}px;
  width: ${TILE_SIZE / 1.2}px;
  background-color: rgba(0,0,0, 0.3);
  border-radius: 50%;
`

const MapWindow = ({ map, position, facing, inventory, target_distance }) => {
  const numRows = map.size.y;
  const numCols = map.size.x;

  const offsetX = position.x;
  const offsetY = position.y;

  const halfWindowX = Math.floor(WINDOW_SIZE_X / 2) + 2;
  const halfWindowY = Math.floor(WINDOW_SIZE_Y / 2) + 2;
  const minX = Math.max(0, offsetX - halfWindowX);
  const maxX = Math.min(numCols - 1, offsetX + halfWindowX);
  const minY = Math.max(0, offsetY - halfWindowY);
  const maxY = Math.min(numRows - 1, offsetY + halfWindowY);

  const visibleTiles = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const key = mapKey(x, y)
      visibleTiles.push(
        <Tile key={key} data={map.tiles[key]} x={x} y={y} />
      );
    }
  }
  
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
      <TargetContainer
        $target={{ x: target_distance * facing.dx, y: target_distance * facing.dy}}
      >
        <TargetVisual/>
      </TargetContainer>
      <PlayerOverlay
        className="player-overlay"
        $background={directionAsset(facing)}
      />
      {
        inventory.open &&
        <Inventory
          content={inventory.content} />
      }
    </Window>
  );
};

export default MapWindow;