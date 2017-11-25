import { Container, Graphics } from "pixi.js";

import { BlankedCell } from "./../../game/displays/BlankedCell";
import { Tile } from "./../../game/models/Tile";
import { ViewPortSize } from "./../../utils/ViewPortSize";

export class GridFieldComponent extends Container {
    constructor() {
        super();

        this.setupValues();
    }
    public generateGrid(maxCols, maxRows): void {
        const gridSize = maxCols * Tile.TILE_WIDTH;
        const newX = (ViewPortSize.MAX_WIDTH - gridSize) * 0.5;
        this.x = newX + Tile.TILE_WIDTH * 0.5;

        for (let row = 0; row < maxRows; row++) {
            for (let col = 0; col < maxCols; col++) {
                const cell: Graphics = new BlankedCell();
                cell.x = Tile.TILE_WIDTH * col;
                cell.y = Tile.TILE_HEIGHT * row;
                this.addChild(cell);
            }
        }
    }
    private setupValues(): void {
        this.x = 10 + Tile.TILE_WIDTH * 0.5;
        this.y = 130 + Tile.TILE_HEIGHT * 0.5;
    }
}
