import { assert } from "chai";

import { GridData } from "./../../../../src/matchthree/game/models/GridData";
import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { PieceUtils } from "./../../../../src/matchthree/game/utils/PieceUtils";
import { PowerUpUtils } from "./../../../../src/matchthree/game/utils/PowerUpUtils";

describe("PowerUpUtils", () => {
    let result: PieceData[];
    let pieces: PieceData[];
    let grid: GridData;

    beforeEach(() => {
        this.result = new Array<PieceData>();
        this.pieces = new Array<PieceData>();
        this.grid = new GridData(5, 5);
    });

    afterEach(() => {
        this.result = null;
        this.pieces = null;
        this.grid = null;
    });

    it("GetPiecesAffectedByPowerUp: the Piece affected is a PowerUpRow", () => {
        let piece: PieceData;
        const row = 0;
        let isSameRow = true;
        for (let col = 0; col < this.grid.maxCols; col++) {
            piece = PieceUtils.getNewNormalPiece(col, row);
            this.pieces.push(piece);
            this.grid.setPiece(piece);
        }

        const removePiece: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.ROW, PieceIds.BLUE);
        this.result = PowerUpUtils.getPiecesAffectedByPowerUp(removePiece, this.grid);

        for (let i = 0; i < this.result.length; i++) {
            piece = this.result[i];
            isSameRow = isSameRow && piece.row === row;
        }

        assert.equal(this.grid.maxRows, this.result.length);
        assert.isTrue(isSameRow);
    });

    it("GetPiecesAffectedByPowerUp: the Piece affected is a PowerUpCol", () => {
        let piece: PieceData;
        const col = 0;
        let isSameCol = true;
        for (let row = 0; row < this.grid.maxCols; row++) {
            piece = PieceUtils.getNewNormalPiece(col, row);
            this.pieces.push(piece);
            this.grid.setPiece(piece);
        }

        const removePiece: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.COL, PieceIds.BLUE);
        this.result = PowerUpUtils.getPiecesAffectedByPowerUp(removePiece, this.grid);

        for (let i = 0; i < this.result.length; i++) {
            piece = this.result[i];
            isSameCol = isSameCol && piece.col === col;
        }

        assert.equal(this.grid.maxCols, this.result.length);
        assert.isTrue(isSameCol);
    });

    it("GetPiecesAffectedByPowerUp: the Piece affected is a PowerUpRainbow", () => {
        let piece: PieceData;
        let col = 0;
        let row = 0;
        let isInPieces = true;
        for (let i = 0; i < this.grid.maxCols; i++) {
            // ROW
            row = 3;
            col = i;
            piece = PieceUtils.getNewNormalPiece(col, row);
            this.pieces.push(piece);
            this.grid.setPiece(piece);

            // COL
            row = i;
            col = 3;
            piece = PieceUtils.getNewNormalPiece(col, row);
            this.pieces.push(piece);
            this.grid.setPiece(piece);
        }

        const removePiece: PieceData = PieceUtils.getNewPowerUpPiece(3, 3, PieceType.RAINBOW, PieceIds.RAINBOW);
        this.result = PowerUpUtils.getPiecesAffectedByPowerUp(removePiece, this.grid);

        for (let i = 0; i < this.result.length; i++) {
            piece = this.result[i];
            isInPieces = isInPieces && this.pieces.indexOf(piece) !== -1;
        }

        assert.equal(this.pieces.length, this.result.length);
        assert.isTrue(isInPieces);
    });

    it("GetPiecesAffectedByPowerUp: the Piece affected is a PowerUpRainbow with a PiecedId from another piece", () => {
        let piece: PieceData;
        let col = 0;
        let row = 0;
        let isInPieces = true;

        for (let i = 0; i < 10; i++) {
            do {
                row = Math.floor(Math.random() * this.grid.maxRows);
                col = Math.floor(Math.random() * this.grid.maxCols);
            } while (this.grid.getPiece(col, row).pieceType !== PieceType.EMPTY);

            piece = PieceUtils.getNewNormalPiece(col, row, PieceIds.GREEN);
            this.pieces.push(piece);
            this.grid.setPiece(piece);
        }

        const removePiece: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.RAINBOW, PieceIds.GREEN);
        this.result = PowerUpUtils.getPiecesAffectedByPowerUp(removePiece, this.grid);

        for (let i = 0; i < this.result.length; i++) {
            piece = this.result[i];
            isInPieces = isInPieces && this.pieces.indexOf(piece) !== -1;
        }

        assert.equal(this.pieces.length, this.result.length);
        assert.isTrue(isInPieces);
    });
});
