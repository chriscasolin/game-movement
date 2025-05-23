import { useEffect, useRef, useState } from "react";
import { BREAK_TIME, direction, KEY, keyCode, mapKey, MAX_TARGET_DISTANCE, MOVEMENT_KEYS, SOLID_OBJECTS } from "./util";

const MOVE_INTERVAL = 20;
const MOVE_AMOUNT = 0.1;

const Player = ({
  onPlayerUpdate,
  onMapUpdate,
  map,
  position,
  momentum,
  facing,
  inventory,
  targetDistance,
  selected
}) => {
  const heldKeys = useRef(new Set());
  const mapRef = useRef(map);
  const positionRef = useRef(position);
  const momentumRef = useRef(momentum);
  const movementInterval = useRef(null);
  const breakTimeout = useRef(null);
  const selectedRef = useRef(selected)

  useEffect(() => { mapRef.current = map; }, [map]);
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { momentumRef.current = momentum; }, [momentum]);
  // useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    let d = 0;
    let x = position.x
    let y = position.y
    let dx = facing.dx
    let dy = facing.dy
    while (d < targetDistance) {
      const key = mapKey(x + d * dx, y + d * dy)
      if (map.tiles[key]?.object) {
        break
      }
      d++
    }
    const tile = { x: Math.round(x + d * dx), y: Math.round(y + d * dy) }

    selected = tile;
    onPlayerUpdate({ selected: tile })
  }, [position, facing, targetDistance, map])

  useEffect(() => {
    let curr = selectedRef.current
    if (selected.x !== curr.x || selected.y !== curr.y) {
      selectedRef.current = selected;
      onPlayerUpdate({ breakTimer: null })
      if (heldKeys.current.has(KEY.BREAK)) {
        cancelBreak();
        startBreak();
      }
    }
  }, [selected])

  const calculateMomentum = () => {
    const keys = heldKeys.current;
    let dx = 0, dy = 0;
    if (keys.has(KEY.NORTH)) dy -= MOVE_AMOUNT;
    if (keys.has(KEY.SOUTH)) dy += MOVE_AMOUNT;
    if (keys.has(KEY.WEST)) dx -= MOVE_AMOUNT;
    if (keys.has(KEY.EAST)) dx += MOVE_AMOUNT;

    if (dx && dy) {
      dx = dx * 0.7
      dy = dy * 0.7
    }

    return { dx, dy };
  };

  const canGo = (key) => {
    return !SOLID_OBJECTS.has(mapRef.current.tiles[key]?.object?.name)
  }

  const moveTo = (x, y) => {
    onPlayerUpdate({ position: { x: x, y: y } });
  }

  const applyMovement = (delta) => {
    if (!heldKeys.current.has(KEY.STRAFE)) {
      const newDirection = direction.of(calculateMomentum());
      if (newDirection) onPlayerUpdate({ facing: newDirection });
    }

    if (!heldKeys.current.has(KEY.STILL)) {
      const currX = positionRef.current.x
      const currY = positionRef.current.y
      const newX = currX + delta.dx;
      const newY = currY + delta.dy;

      if (canGo(mapKey(newX, newY))) {
        moveTo(newX, newY)
        // Diagonal position may be blocked, so slide against wall
      } else if (currX !== newX && currY !== newY) { // Prevent uneccesary checks
        if (canGo(mapKey(currX, newY))) {
          moveTo(currX, newY)
        } else if (canGo(mapKey(newX, currY))) {
          moveTo(newX, currY)
        }
      }

    }
  };

  const onMovementKeyDown = () => {
    const newMomentum = calculateMomentum();
    onPlayerUpdate({ momentum: newMomentum });
    clearInterval(movementInterval.current);
    movementInterval.current = setInterval(() => {
      if (!inventory.open) applyMovement(momentumRef.current);
    }, MOVE_INTERVAL);
  };

  const onMovementKeyUp = () => {
    const newMomentum = calculateMomentum();
    onPlayerUpdate({ momentum: newMomentum });
    if (newMomentum.dx === 0 && newMomentum.dy === 0) {
      clearInterval(movementInterval.current);
    }
  };

  const toggleInventory = () => {
    inventory.open = !inventory.open
    onPlayerUpdate({ inventory: inventory });
  }

  const loopTargetDistance = () => {
    targetDistance = targetDistance + 1;
    if (targetDistance > MAX_TARGET_DISTANCE) targetDistance = 0;
    onPlayerUpdate({ targetDistance: targetDistance });
  }

  const breakTile = (tile) => {
    if (tile.object) {
      delete tile.object
    } else if (tile.ground) {
      delete tile.ground
    }

    return tile
  }

  const startBreak = () => {
    let timer = BREAK_TIME
    onPlayerUpdate({ breakTimer: timer })
    breakTimeout.current = setTimeout(() => {
      let current = selectedRef.current
      let newTile = breakTile(map.tiles[mapKey(current.x, current.y)])
      onMapUpdate({ [mapKey(current.x, current.y)]: newTile })
      onPlayerUpdate({ breakTimer: null })

      if (heldKeys.current.has(KEY.BREAK)) {
        breakTimeout.current = setTimeout(() => {
          startBreak();
        }, 300)
      }
    }, timer)
  }

  const cancelBreak = () => {
    onPlayerUpdate({ breakTimer: null })
    clearTimeout(breakTimeout.current);
  }

  const onKeyDown = (event) => {
    const key = keyCode(event)
    if (heldKeys.current.has(key)) return;
    heldKeys.current.add(key);

    if (key === KEY.INVENTORY) {
      toggleInventory();
    } else if (key === KEY.TARGET_DISTANCE) {
      loopTargetDistance();
    } else if (key === KEY.BREAK) {
      startBreak();
    } else if (!inventory.open && MOVEMENT_KEYS.has(key)) {
      onMovementKeyDown(key);
    }
  };

  const onKeyUp = (event) => {
    const key = keyCode(event)
    if (!heldKeys.current.has(key)) return;
    heldKeys.current.delete(key);

    if (key === KEY.BREAK) {
      cancelBreak();
    } else if (MOVEMENT_KEYS.has(key)) onMovementKeyUp();
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return null;
};

export default Player;