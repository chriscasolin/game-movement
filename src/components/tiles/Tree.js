import { TileName } from "../util";
import TileComponent from "./TileComponent";

class Tree extends TileComponent {
  constructor() {
    super(TileName.TREE, 'tree_outlined.png')
  }
}

export default Tree;