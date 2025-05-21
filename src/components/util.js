export const WORLD_FILE = '/worlds/demo.json'
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
    if (d.dx === 0 && d.dy < 0) return direction.N;
    if (d.dx === 0 && d.dy > 0) return direction.S;
    if (d.dx < 0 && d.dy === 0) return direction.W;
    if (d.dx > 0 && d.dy === 0) return direction.E;
    if (d.dx < 0 && d.dy < 0) return direction.NW;
    if (d.dx > 0 && d.dy < 0) return direction.NE;
    if (d.dx < 0 && d.dy > 0) return direction.SW;
    if (d.dx > 0 && d.dy > 0) return direction.SE;
    return direction.S;
  }
}

export const INITIAL_DIRECTION = direction.S;
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
export const mapKey = (x, y) =>  `${Math.round(x)}_${Math.round(y)}`

export const KEY = {
  NORTH: 'arrowup',
  SOUTH: 'arrowdown',
  EAST: 'arrowright',
  WEST: 'arrowleft',
  STILL: 'shift',
  STRAFE: 'alt',
  BREAK: 'c',
  INTERACT: 'x',
  INVENTORY: 'z',
  TARGET_DISTANCE: 'a'
}

export const MOVEMENT_KEYS = new Set([KEY.NORTH, KEY.SOUTH, KEY.EAST, KEY.WEST]);

export const keyCode = (event) => event.key.toLowerCase()

export const target_coord = (position, facing, target_distance) => {
  let target_x = position.x + target_distance * facing.dx
  let target_y = position.y + target_distance * facing.dy
  return { x: target_x, y: target_y }
}

export const MAX_TARGET_DISTANCE = 2;