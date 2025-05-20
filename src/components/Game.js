import { useEffect, useRef, useState } from "react";
import MapWindow from "./MapWindow";
import Player from "./Player";
import { INITIAL_DIRECTION } from "./util";

const Game = () => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [playerState, setPlayerState] = useState(null);

  useEffect(() => {
    if (!map) {
      fetch('/worlds/demo.json')
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
            target_distance: 0
          });
        });
    }
  }, []);

  const handlePlayerUpdate = (updates) => {
    setPlayerState((prev) => ({ ...prev, ...updates }));
  };

  if (!map || !playerState) return <div>Loading...</div>;

  return (
    <>
      <MapWindow
        map={map}
        position={playerState.position}
        facing={playerState.facing}
        inventory={playerState.inventory}
        target_distance={playerState.target_distance}
      />
      <Player
        map={map}
        position={playerState.position}
        facing={playerState.facing}
        momentum={playerState.momentum}
        inventory={playerState.inventory}
        onUpdate={handlePlayerUpdate}
        target_distance={playerState.target_distance}
      />
    </>
  );
};

export default Game;
