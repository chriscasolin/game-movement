export const TILE_SIZE = 32; // px
export const WINDOW_SIZE = 20;

export class direction {
  static N = { dx: 0, dy: -1 }
  static S = { dx: 0, dy: 1 }
  static W = { dx: -1, dy: 0 }
  static E = { dx: 1, dy: 0 }
  static NW = { dx: -1, dy: -1 }
  static NE = { dx: 1, dy: -1 }
  static SW = { dx: -1, dy: 1 }
  static SE = { dx: 1, dy: 1 }

  static of(d) {
    if (d.dx === 0 && d.dy === -1) return direction.N;
    if (d.dx === 0 && d.dy === 1) return direction.S;
    if (d.dx === -1 && d.dy === 0) return direction.W;
    if (d.dx === 1 && d.dy === 0) return direction.E;
    if (d.dx === -1 && d.dy === -1) return direction.NW;
    if (d.dx === 1 && d.dy === -1) return direction.NE;
    if (d.dx === -1 && d.dy === 1) return direction.SW;
    if (d.dx === 1 && d.dy === 1) return direction.SE;
    return null;
  }
}

export const INIITIAL_DIRECTION = direction.N

export const directionArrow = (d) => {
  switch (d) {
    case direction.N:
      return "↑"
    case direction.S:
      return "↓"
    case direction.W:
      return "←"
    case direction.E:
      return "→"
    case direction.NW:
      return "↖"
    case direction.NE:
      return "↗"
    case direction.SW:
      return "↙"
    case direction.SE:
      return "↘"
    default:
      return "?"
  }
}