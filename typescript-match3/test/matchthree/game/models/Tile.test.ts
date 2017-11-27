import { assert } from "chai";

import { Tile } from "./../../../../src/matchthree/game/models/Tile";

describe("Tile", () => {
    it("Constructor", () => {
        const col = 5;
        const row = 6;
        const tile = new Tile(col, row);
        assert.equal(col, tile.col);
        assert.equal(row, tile.row);
    });

    it("Constructor: Default Values", () => {
        const tile = new Tile();
        assert.equal(0, tile.col);
        assert.equal(0, tile.row);
    });
});
