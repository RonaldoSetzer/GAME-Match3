import { PieceData } from "../../../../src/matchthree/game/models/PieceData";
import { PieceType } from "../../../../src/matchthree/game/utils/PieceType";
import { GridData } from "./../../../../src/matchthree/game/models/GridData";
import { assert } from "chai";

describe("Grid", () => {

    let grid: GridData;

    beforeEach(() => {
        grid = new GridData(5, 8);
    });

    afterEach(() => {
        grid = undefined;
    });

    it("Constructor: Default values", () => {
        let maxCols = 8;
        let maxRows = 8;
        grid = new GridData();
        assert.equal(maxCols, grid.maxCols);
        assert.equal(maxRows, grid.maxRows);
    });

    it("Constructor: Setting new values to col and row", () => {
        let maxCols = 9;
        let maxRows = 19;
        grid = new GridData(maxCols, maxRows);
        assert.equal(maxCols, grid.maxCols);
        assert.equal(maxRows, grid.maxRows);
    });

    it("GetPiece: Returns the Piece", () => {
        let col = 2;
        let row = 2;
        let piece = new PieceData(col, row);
        grid.setPiece(piece);
        piece = grid.getPiece(col, row);

        assert.isTrue(piece.col === col && piece.row === row);
    });

    it("GetPiece: Returns undefined when the values are more than grid size ", () => {
        let piece = grid.getPiece(60, 60);

        assert.equal(undefined, piece);
    });

    it("SetPiece: Set the Piece in the position", () => {
        let col = 0;
        let row = 0;
        let piece = new PieceData(col, row);
        grid.setPiece(piece);
        assert.deepEqual(piece, grid.getPiece(col, row));
    });

});
