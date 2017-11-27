import { assert } from "chai";

import { PieceData } from "../../../../src/matchthree/game/models/PieceData";
import { GridData } from "./../../../../src/matchthree/game/models/GridData";

describe("Grid", () => {
    let grid: GridData;

    beforeEach(() => {
        grid = new GridData(5, 8);
    });

    afterEach(() => {
        grid = undefined;
    });

    it("Constructor: Default values", () => {
        const maxCols = 8;
        const maxRows = 8;
        grid = new GridData();
        assert.equal(maxCols, grid.maxCols);
        assert.equal(maxRows, grid.maxRows);
    });

    it("Constructor: Setting new values to col and row", () => {
        const maxCols = 9;
        const maxRows = 19;
        grid = new GridData(maxCols, maxRows);
        assert.equal(maxCols, grid.maxCols);
        assert.equal(maxRows, grid.maxRows);
    });

    it("GetPiece", () => {
        const col = 2;
        const row = 2;
        let piece = new PieceData(col, row);
        grid.setPiece(piece);
        piece = grid.getPiece(col, row);

        assert.isTrue(piece.col === col && piece.row === row);
    });

    it("GetPiece: Returns undefined when the values are more than grid size ", () => {
        const piece = grid.getPiece(60, 60);

        assert.equal(undefined, piece);
    });

    it("SetPiece", () => {
        const col = 0;
        const row = 0;
        const piece = new PieceData(col, row);
        grid.setPiece(piece);
        assert.deepEqual(piece, grid.getPiece(col, row));
    });
});
