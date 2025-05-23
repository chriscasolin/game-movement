import { TileName } from "../util";
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

class Tile {
  constructor(tileObj) {
    this.ground = tileFactory(tileObj.ground)
    this.object = tileFactory(tileObj.object)
  }
}

export default Tile