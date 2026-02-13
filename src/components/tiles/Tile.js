import { direction, TileName } from "../util";
import Barrier from "./Barrier";
import Grass from "./Grass";
import Stone from "./Stone";
import Tree from "./Tree";
import Unknown from "./Unknown";

const tileFactory = (element) => {
  if (!element) return null

  switch (element?.type) {
    case TileName.GRASS: return new Grass();
    case TileName.STONE: return new Stone();
    case TileName.BARRIER: return new Barrier();
    case TileName.TREE: return new Tree();
    default: return new Unknown(element?.type)
  }
}

const cardinal2letter = (d) => {
  switch (d) {
    case direction.N: return 'n'
    case direction.E: return 'e'
    case direction.S: return 's'
    case direction.W: return 'w'
    default: return null
  }
}

class Tile {
  constructor(tileObj, key) {
    this.ground = tileFactory(tileObj.ground);
    this.object = tileFactory(tileObj.object);
    this._has_hole = false;
    [this._x, this._y] = key.split("_").map(s => parseInt(s))
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get has_hole() {
    return this._has_hole
  }

  set has_hole(bool) {
    this._has_hole = bool
  }

  textures = (adjacentTiles) => {
    let srcFiles = []
    if (this._has_hole) {
      const adjacentHoles = []
        adjacentTiles.forEach(t => {
            // adjacent tile may be undefined for out-of-bounds positions,
            // guard against that to avoid runtime errors when reading properties
            if (t && t.tile && t.tile.has_hole) {
              adjacentHoles.push(cardinal2letter(t.direction))
            }
          });
      const connected_tag = adjacentHoles.join('')
      srcFiles.push(`hole/hole_${connected_tag}.png`)
    }
    if (this.object) {
      srcFiles.push(this.object.texture)
    }
    if (this.ground) {
      srcFiles.push(this.ground.texture)
    }
    return srcFiles
  }
}

export default Tile