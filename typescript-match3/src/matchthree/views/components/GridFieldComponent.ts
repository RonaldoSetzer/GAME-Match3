import { ViewPortSize } from "./../../utils/ViewPortSize";
import { Tile } from "./../../game/models/Tile";
import { BlankedCell } from "./../../game/displays/BlankedCell";
import { Container, Graphics } from "pixi.js";

export class GridFieldComponent extends Container {

    constructor() {
        super();

        this.setupValues();
    }

    public generateGrid(maxCols, maxRows): void {
        let gridSize = maxCols * Tile.TILE_WIDTH;
        let newX = (ViewPortSize.MAX_WIDTH - gridSize) * .5;
        this.x = newX + (Tile.TILE_WIDTH * .5);

        for (let row = 0; row < maxRows; row++) {
            for (let col = 0; col < maxCols; col++) {
                let cell: Graphics = new BlankedCell();
                cell.x = Tile.TILE_WIDTH * col;
                cell.y = Tile.TILE_HEIGHT * row;
                this.addChild(cell);
            }
        }
    }

    private setupValues(): void {
        this.x = 10 + (Tile.TILE_WIDTH * .5);
        this.y = 130 + (Tile.TILE_HEIGHT * .5);
    }
}
