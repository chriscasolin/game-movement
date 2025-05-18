import Tile from "./Tile";
import '../css/Map.css';
import { directionArrow, TILE_SIZE, WINDOW_SIZE } from "./util";
import styled from "styled-components";

const PlayerOverlay = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  position: absolute;
  top: ${Math.floor(WINDOW_SIZE / 2) * TILE_SIZE}px;
  left: ${Math.floor(WINDOW_SIZE / 2) * TILE_SIZE}px;
  background-color: lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`

const MapContent = styled.div.attrs(({ $offsetX, $offsetY }) => ({
  style: {
    transform: `translate(${(-$offsetX + Math.floor(WINDOW_SIZE / 2)) * TILE_SIZE}px,
                          ${(-$offsetY + Math.floor(WINDOW_SIZE / 2)) * TILE_SIZE}px)`
  }
}))`
  width: ${({ $numCols }) => $numCols * TILE_SIZE}px;
  height: ${({ $numRows }) => $numRows * TILE_SIZE}px;
  position: absolute;
  transition: transform 0.3s;
`;

const Window = styled.div`
  width: ${WINDOW_SIZE * TILE_SIZE}px;
  height: ${WINDOW_SIZE * TILE_SIZE}px;
  overflow: hidden;
  position: relative;
  border: 0.2rem solid black;
  background-color: #555;
  margin: 50px auto;
  border-radius: 5px;
`

const MapWindow = ({ map, playerPos, facing }) => {
  const numRows = map.length;
  const numCols = map[0].length;

  const offsetX = playerPos.x;
  const offsetY = playerPos.y;

  const halfWindow = Math.floor(WINDOW_SIZE / 2) + 2;
  const minX = Math.max(0, offsetX - halfWindow);
  const maxX = Math.min(numCols - 1, offsetX + halfWindow);
  const minY = Math.max(0, offsetY - halfWindow);
  const maxY = Math.min(numRows - 1, offsetY + halfWindow);

  const visibleTiles = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      visibleTiles.push(
        <Tile key={`${x},${y}`} value={map[y][x]} x={x} y={y} />
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
      <PlayerOverlay className="player-overlay">{directionArrow(facing)}</PlayerOverlay>
    </Window>
  );
};

export default MapWindow;