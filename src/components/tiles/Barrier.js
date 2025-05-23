import { TileName } from "../util";
import TileComponent from "./TileComponent";

class Barrier extends TileComponent {
  constructor() {
    super(TileName.BARRIER, 'barrier.png')
  }
}

export default Barrier;