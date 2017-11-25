export class Tile {
    public static TILE_WIDTH = 36;
    public static TILE_HEIGHT = 36;

    public col: number;
    public row: number;

    constructor(col = 0, row = 0) {
        this.col = col;
        this.row = row;
    }
}
