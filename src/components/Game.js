import { useEffect, useRef, useState } from "react";
import MapWindow from "./MapWindow";
import { direction, INIITIAL_DIRECTION } from "./util";
import Map from "./Map";

const INITIAL_DELAY = 80; // Delay before first movement repeat
const MOVE_INTERVAL = 100;  // Interval between repeated movements
const UP_KEYS = new Set(['ArrowUp', 'w'])
const DOWN_KEYS = new Set(['ArrowDown', 's'])
const LEFT_KEYS = new Set(['ArrowLeft', 'a'])
const RIGHT_KEYS = new Set(['ArrowRight', 'd'])
const MOVEMENT_KEYS = new Set(UP_KEYS.union(DOWN_KEYS).union(LEFT_KEYS).union(RIGHT_KEYS));

const Game = () => {
  const [position, setPosition] = useState({ x: 5, y: 5 });
  const positionRef = useRef(position)
  const [map, setMap] = useState(null);
  const mapRef = useRef(map)
  const [facing, setFacing] = useState(INIITIAL_DIRECTION)

  const [momentum, setMomentum] = useState({ dx: 0, dy: 0 });
  const momentumRef = useRef(momentum);
  const movementDelayTimeout = useRef(null);
  const movementInterval = useRef(null);

  useEffect(() => {
    momentumRef.current = momentum
  }, [momentum])
  useEffect(() => {
    positionRef.current = position
  }, [position])

  const heldKeys = useRef(new Set())

  const getDelta = (event, sign) => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        return { dx: 0, dy: -sign };
      case "s":
      case "ArrowDown":
        return { dx: 0, dy: sign };
      case "a":
      case "ArrowLeft":
        return { dx: -sign, dy: 0 };
      case "d":
      case "ArrowRight":
        return { dx: sign, dy: 0 };
      default:
        return null;
    }
  };

  const applyMovement = (delta) => {
    if (!heldKeys.current.has('Alt') && direction.of(delta)) {
      setFacing(direction.of(delta));
    }

    if (!heldKeys.current.has('Shift')) {
      const newX = positionRef.current.x + delta.dx
      const newY = positionRef.current.y + delta.dy
      if (mapRef.current[newY][newX] !== "X") {
        setPosition((prev) => ({
          x: prev.x + delta.dx,
          y: prev.y + delta.dy,
        }));
      }
    }
  };

  const calculateMomentum = () => {
    let newMomentum = { dx: 0, dy: 0 }
    if (heldKeys.current.intersection(UP_KEYS).size > 0) newMomentum.dy -= 1
    if (heldKeys.current.intersection(DOWN_KEYS).size > 0) newMomentum.dy += 1
    if (heldKeys.current.intersection(LEFT_KEYS).size > 0) newMomentum.dx -= 1
    if (heldKeys.current.intersection(RIGHT_KEYS).size > 0) newMomentum.dx += 1
    // console.log(newMomentum)
    return newMomentum
  }

  const calcDelay = () => {
    const is_diagonal = (m) => (m.dx && m.dy)
    return is_diagonal(momentumRef.current) ? MOVE_INTERVAL * 1.44 : MOVE_INTERVAL
  }

  const applyMomentum = () => {
    applyMovement(momentumRef.current)
  }

  const handleMovementKeyDown = (event) => {
    const delta = getDelta(event, 1)
    if (!delta) return;
    applyMovement(delta);

    clearTimeout(movementDelayTimeout.current)
    movementDelayTimeout.current = setTimeout(() => {
      setMomentum(calculateMomentum())
      clearInterval(movementInterval.current);
      movementInterval.current = setInterval(() => {
        // applyMovement(momentumRef.current)
        applyMomentum()
      }, calcDelay());
    }, INITIAL_DELAY);
  }

  const handleMovementKeyUp = (event) => {
    const newMomentum = calculateMomentum()
    setMomentum(newMomentum)
    if (newMomentum.dx === 0 && newMomentum.dy === 0) {
      clearTimeout(movementDelayTimeout.current);
      clearInterval(movementInterval.current);
    }
  }

  const handleKeyDown = (event) => {
    if (heldKeys.current.has(event.key)) return;
    heldKeys.current.add(event.key);
    if (MOVEMENT_KEYS.has(event.key)) handleMovementKeyDown(event);
    // console.log(event.key, "Down")
  };

  const handleKeyUp = (event) => {
    if (!heldKeys.current.has(event.key)) return;
    heldKeys.current.delete(event.key);
    if (MOVEMENT_KEYS.has(event.key)) handleMovementKeyUp(event);
    // console.log(event.key, "Up")
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!map) {
      fetch('/demoMap.json')
        .then(res => res.json())
        .then(data => {
          setMap(data)
          mapRef.current = data
        });
    }
  }, []);

  if (!map) return <div>Loading...</div>;

  return (
    <>
      <MapWindow map={map} playerPos={position} facing={facing} momentum={momentum} />
      {/* <Map map={map} playerPos={position} /> */}
    </>
  );
};

export default Game;