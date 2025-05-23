import { use, useEffect, useRef, useState } from "react";
import MapWindow from "./MapWindow";
import Player from "./Player";
import { INITIAL_DIRECTION, mapKey, MAX_TARGET_DISTANCE, WORLD_FILE } from "./util";

const Game = () => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [playerState, setPlayerState] = useState(null);

  useEffect(() => {
    if (!map) {
      fetch(WORLD_FILE)
        .then(res => res.json())
        .then(data => {
          setMap(data);
          mapRef.current = data;
          setPlayerState({
            position: { x: data.position.x, y: data.position.y },
            facing: INITIAL_DIRECTION,
            momentum: { dx: 0, dy: 0 },
            inventory: {
              open: false,
              content: ['log', 'stone', 'stick']
            },
            targetDistance: MAX_TARGET_DISTANCE,
            selected: { x: 0, y: 0 },
            breakTimer: null
          });
        });
    }
  }, []);

  const handlePlayerUpdate = (updates) => {
    setPlayerState((prev) => ({ ...prev, ...updates }));
  };

  const handleMapUpdate = (tileUpdates) => {
    setMap(prev => ({
      ...prev,
      tiles: {
        ...prev.tiles,
        ...tileUpdates
      }
    }));
  };

  if (!map || !playerState) return <div>Loading...</div>;

  return (
    <>
      <MapWindow
        map={map}
        position={playerState.position}
        facing={playerState.facing}
        inventory={playerState.inventory}
        selected={playerState.selected}
        breakTimer={playerState.breakTimer}
      />
      <Player
        onPlayerUpdate={handlePlayerUpdate}
        onMapUpdate={handleMapUpdate}
        map={map}
        position={playerState.position}
        momentum={playerState.momentum}
        facing={playerState.facing}
        inventory={playerState.inventory}
        targetDistance={playerState.targetDistance}
        selected={playerState.selected}
      />
    </>
  );
};

export default Game;
