import { TileName } from "../util";
import TileComponent from "./TileComponent";

class Grass extends TileComponent {
  constructor() {
    super(TileName.GRASS, 'grass.png')
  }
}

export default Grass;