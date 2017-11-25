import { Graphics } from "pixi.js";

import { Tile } from "./../models/Tile";

export class BlankedCell extends Graphics {
    constructor() {
        super();
        this.beginFill(0xffffff);
        this.drawRect(0, 0, Tile.TILE_WIDTH, Tile.TILE_HEIGHT);
        this.alpha = 0.3;
        this.pivot.x = this.width * 0.5;
        this.pivot.y = this.height * 0.5;
    }
}
