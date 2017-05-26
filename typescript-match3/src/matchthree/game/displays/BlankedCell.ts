import { Tile } from "./../models/Tile";
import { Graphics } from "pixi.js";

export class BlankedCell extends Graphics {

    constructor() {
        super();
        this.beginFill(0xFFFFFF);
        this.drawRect(0, 0, Tile.TILE_WIDTH, Tile.TILE_HEIGHT);
        this.alpha = .3;
        this.pivot.x = this.width * .5;
        this.pivot.y = this.height * .5;
    }
}
