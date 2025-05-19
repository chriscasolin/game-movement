export const TILE_SIZE = 50; // px
export const WINDOW_SIZE_X = 16;
export const WINDOW_SIZE_Y = 12;

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

export const INITIAL_DIRECTION = direction.S
export const INITIAL_POSITION = { x: 0, y: 0 }

export const link = (filename) => `url('textures/${filename}')`

export const directionAsset = (d) => {
  switch (d) {
    case direction.N:
      return link('player_n.png')
    case direction.S:
      return link('player_s.png')
    case direction.W:
      return link('player_w.png')
    case direction.E:
      return link('player_e.png')
    case direction.NW:
      return link('player_nw.png')
    case direction.NE:
      return link('player_ne.png')
    case direction.SW:
      return link('player_sw.png')
    case direction.SE:
      return link('player_se.png')
    default:
      return link('missing.png')
  }
}

export const Tiles = {
  GRASS: "grass",
  TREE: "tree",
  BARRIER: "barrier"
}

export const SOLID_OBJECTS = new Set([Tiles.BARRIER, Tiles.TREE])
export const mapKey = (x, y) =>  `${x}_${y}`