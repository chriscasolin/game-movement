import { TileName } from "../util";
import TileComponent from "./TileComponent";

class Stone extends TileComponent {
  constructor() {
    super(TileName.STONE, 'stone.png')
  }
}

export default Stone;