import Tile from "./Tile";
import '../css/Map.css'

const Map = ({ map, playerPos }) => {
  return (
    <div className="Map">
      {map.map((row, y) => (
        <div key={y}>
          {row.map((cell, x) => (
            <Tile key={x} value={cell} hasPlayer={x === playerPos.x && y === playerPos.y} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Map