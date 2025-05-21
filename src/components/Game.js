import { useEffect, useRef, useState } from "react";
import MapWindow from "./MapWindow";
import Player from "./Player";
import { INITIAL_DIRECTION, mapKey, MAX_TARGET_DISTANCE } from "./util";

const Game = () => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [playerState, setPlayerState] = useState(null);

  const [realTarget, setRealTarget] = useState(0)
  const [selected, setSelected] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (playerState) {
      let d = 0;
      let x = playerState.position.x
      let y = playerState.position.y
      let dx = playerState.facing.dx
      let dy = playerState.facing.dy
      while (d < playerState.target_distance) {
        const key = mapKey(x + d * dx, y + d * dy)
        if (map.tiles[key].object) {
          break
        }
        d++
      }
      setRealTarget(d)
      setSelected({ x: x + d * dx, y: y + d * dy })
    }
  }, [playerState])

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
            target_distance: MAX_TARGET_DISTANCE
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
        target_distance={realTarget}
        selected={selected}
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
