import { useEffect, useRef, useCallback } from "react";
import { BREAK_TIME, direction, KEY, keyCode, mapKey, MAX_TARGET_DISTANCE, MOVEMENT_KEYS, SOLID_OBJECTS } from "./util";

// const MOVE_INTERVAL = 50;
const MOVE_AMOUNT = 0.1;

const Player = ({
  onPlayerUpdate,
  onTileUpdate,
  map,
  position,
  momentum,
  facing,
  inventory,
  targetDistance,
  selected
}) => {
  const heldKeys = useRef(new Set());
  const positionRef = useRef(position);
  const momentumRef = useRef(momentum);
  const selectedRef = useRef(selected)
  const movementInterval = useRef(null);
  const breakTimeout = useRef(null);
  const inventoryRef = useRef(inventory);
  const targetDistanceRef = useRef(targetDistance);

  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { momentumRef.current = momentum; }, [momentum]);
  useEffect(() => { inventoryRef.current = inventory; }, [inventory]);
  useEffect(() => { targetDistanceRef.current = targetDistance; }, [targetDistance]);

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
    const offset = 0.2
    const tile = { x: Math.round(x + (d - offset) * dx), y: Math.round(y + (d - offset) * dy) }
    // Only update selected if it actually changed to avoid causing
    // a render loop when parent/state are updated with a new object
    const prev = selectedRef.current;
    if (!prev || prev.x !== tile.x || prev.y !== tile.y) {
      selectedRef.current = tile;
      onPlayerUpdate({ selected: tile })
    }
  }, [position, facing, targetDistance, map, onPlayerUpdate])

  const breakTile = useCallback((tile) => {
    if (!tile) return tile;
    if (tile.object) {
      tile.object = null
    } else if (tile.ground) {
      tile.has_hole = true
    }
    return tile
  }, []);

  const cancelBreak = useCallback(() => {
    onPlayerUpdate({ breakTimer: null })
    clearTimeout(breakTimeout.current);
  }, [onPlayerUpdate]);

  const startBreakRef = useRef(null);
  const startBreak = useCallback(() => {
    const timer = BREAK_TIME;
    onPlayerUpdate({ breakTimer: timer });
    breakTimeout.current = setTimeout(() => {
      const current = selectedRef.current;
      const key = mapKey(current.x, current.y);
      const existing = map.tiles[key];
      if (!existing) {
        // nothing to break (out of bounds), cancel the break timer
        onPlayerUpdate({ breakTimer: null });
        return;
      }
      const newTile = breakTile(existing);
      onTileUpdate({ [key]: newTile });
      onPlayerUpdate({ breakTimer: null });

      if (heldKeys.current.has(KEY.BREAK)) {
        breakTimeout.current = setTimeout(() => {
          // call via ref to avoid stale closure / recursive dependency
          if (startBreakRef.current) startBreakRef.current();
        }, 300);
      }
    }, timer);
  }, [onPlayerUpdate, onTileUpdate, map, breakTile]);

  useEffect(() => { startBreakRef.current = startBreak }, [startBreak]);

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
  }, [selected, cancelBreak, startBreak, onPlayerUpdate])

  // Debug logging removed: it was triggering every render/frame and
  // caused noise. If you need to trace updates, enable targeted logs briefly.

  const calculateMomentum = useCallback(() => {
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
  }, []);

  const canGo = useCallback((key) => {
    return !SOLID_OBJECTS.has(map.tiles[key]?.object?.name)
  }, [map]);

  const moveTo = useCallback((x, y) => {
    onPlayerUpdate({ position: { x: x, y: y } });
  }, [onPlayerUpdate]);

  const applyMovement = useCallback((delta) => {
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
  }, [calculateMomentum, canGo, moveTo, onPlayerUpdate]);

  const onMovementKeyDown = useCallback(() => {
    const newMomentum = calculateMomentum();
    onPlayerUpdate({ momentum: newMomentum, isMoving: true });

    if (movementInterval.current) {
      cancelAnimationFrame(movementInterval.current);
    }

    const animate = () => {
      if (!inventoryRef.current.open) applyMovement(momentumRef.current);
      movementInterval.current = requestAnimationFrame(animate);
    };
    movementInterval.current = requestAnimationFrame(animate);
  }, [calculateMomentum, onPlayerUpdate, applyMovement]);

  const onMovementKeyUp = useCallback(() => {
    const newMomentum = calculateMomentum();
    onPlayerUpdate({ momentum: newMomentum });
    if (newMomentum.dx === 0 && newMomentum.dy === 0) {
      cancelAnimationFrame(movementInterval.current);
      movementInterval.current = null;
      onPlayerUpdate({ isMoving: false });
    }
  }, [calculateMomentum, onPlayerUpdate]);

  const toggleInventory = useCallback(() => {
    const newInv = Object.assign({}, inventoryRef.current, { open: !inventoryRef.current.open });
    inventoryRef.current = newInv;
    onPlayerUpdate({ inventory: newInv });
  }, [onPlayerUpdate]);

  const loopTargetDistance = useCallback(() => {
    let newTarget = targetDistanceRef.current + 1;
    if (newTarget > MAX_TARGET_DISTANCE) newTarget = 0;
    targetDistanceRef.current = newTarget;
    onPlayerUpdate({ targetDistance: newTarget });
  }, [onPlayerUpdate]);

  

  const onKeyDown = useCallback((event) => {
    const key = keyCode(event)
    if (heldKeys.current.has(key)) return;
    heldKeys.current.add(key);

    if (key === KEY.INVENTORY) {
      toggleInventory();
    } else if (key === KEY.TARGET_DISTANCE) {
      loopTargetDistance();
    } else if (key === KEY.BREAK) {
      startBreak();
    } else if (!inventoryRef.current.open && MOVEMENT_KEYS.has(key)) {
      onMovementKeyDown(key);
    }
  }, [toggleInventory, loopTargetDistance, startBreak, onMovementKeyDown]);

  const onKeyUp = useCallback((event) => {
    const key = keyCode(event)
    if (!heldKeys.current.has(key)) return;
    heldKeys.current.delete(key);

    if (key === KEY.BREAK) {
      cancelBreak();
    } else if (MOVEMENT_KEYS.has(key)) onMovementKeyUp();
  }, [cancelBreak, onMovementKeyUp]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return null;
};

export default Player;