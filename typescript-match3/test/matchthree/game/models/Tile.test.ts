import { Tile } from "./../../../../src/matchthree/game/models/Tile";
import { assert } from "chai";

describe("Tile", () => {

    it("Constructor", () => {
        let col = 5;
        let row = 6;
        let tile = new Tile(col, row);
        assert.equal(col, tile.col);
        assert.equal(row, tile.row);
    });

    it("Constructor: Default Values", () => {
        let tile = new Tile();
        assert.equal(0, tile.col);
        assert.equal(0, tile.row);
    });
});
