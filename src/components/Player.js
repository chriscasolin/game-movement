import { useEffect, useRef, useState } from "react";
import { direction, KEY, keyCode, mapKey, MAX_TARGET_DISTANCE, MOVEMENT_KEYS, SOLID_OBJECTS, target_coord } from "./util";

const MOVE_INTERVAL = 20;
const MOVE_AMOUNT = 0.1;

const Player = ({
  map,
  position,
  momentum,
  inventory,
  target_distance,
  onUpdate
}) => {
  const heldKeys = useRef(new Set());
  const mapRef = useRef(map);
  const positionRef = useRef(position);
  const momentumRef = useRef(momentum);

  const movementDelayTimeout = useRef(null);
  const movementInterval = useRef(null);

  useEffect(() => { mapRef.current = map; }, [map]);
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { momentumRef.current = momentum; }, [momentum]);

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

  const applyMovement = (delta) => {
    if (!heldKeys.current.has(KEY.STRAFE)) {
      const newDirection = direction.of(calculateMomentum());
      if (newDirection) onUpdate({ facing: newDirection });
    }

    if (!heldKeys.current.has(KEY.STILL)) {
      const newX = positionRef.current.x + delta.dx;
      const newY = positionRef.current.y + delta.dy;
      const key = mapKey(newX, newY);
      if (!SOLID_OBJECTS.has((mapRef.current.tiles[key]?.object?.type))) {
        onUpdate({
          position: {
            x: positionRef.current.x + delta.dx,
            y: positionRef.current.y + delta.dy
          }
        });
      }
    }
  };

  const onMovementKeyDown = () => {
    const newMomentum = calculateMomentum();
    onUpdate({ momentum: newMomentum });
    clearInterval(movementInterval.current);
    movementInterval.current = setInterval(() => {
      if (!inventory.open) applyMovement(momentumRef.current);
    }, MOVE_INTERVAL);
  };

  const onMovementKeyUp = () => {
    const newMomentum = calculateMomentum();
    onUpdate({ momentum: newMomentum });
    if (newMomentum.dx === 0 && newMomentum.dy === 0) {
      clearTimeout(movementDelayTimeout.current);
      clearInterval(movementInterval.current);
    }
  };

  const toggleInventory = () => {
    inventory.open = !inventory.open
    onUpdate({ inventory: inventory });
  }

  const loopTargetDistance = () => {
    target_distance = target_distance + 1;
    if (target_distance > MAX_TARGET_DISTANCE) target_distance = 0;
    onUpdate({ target_distance: target_distance });
  }

  const onKeyDown = (event) => {
    const key = keyCode(event)
    if (heldKeys.current.has(key)) return;
    heldKeys.current.add(key);

    if (key === KEY.INVENTORY) {
      toggleInventory();
    } else if (key === KEY.TARGET_DISTANCE) {
      loopTargetDistance();
    } else if (!inventory.open && MOVEMENT_KEYS.has(key)) {
      onMovementKeyDown(key);
    }
  };

  const onKeyUp = (event) => {
    const key = keyCode(event)
    if (!heldKeys.current.has(key)) return;
    heldKeys.current.delete(key);

    if (MOVEMENT_KEYS.has(key)) onMovementKeyUp();
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