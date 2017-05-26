import { AtlasKeys } from "./../../../../src/matchthree/utils/AtlasKeys";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceUtils } from "./../../../../src/matchthree/game/utils/PieceUtils";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { assert } from "chai";
import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";

describe("PieceUtils", () => {

    it("GetEmpytPiece", () => {
        let piece: PieceData = PieceUtils.getEmptyPiece(1, 1);
        assert.isNotNull(piece);
        assert.equal(1, piece.row);
        assert.equal(1, piece.col);
        assert.equal(PieceType.EMPTY, piece.pieceType);
    });

    it("GetNewNormalPiece", () => {
        let col = 1;
        let row = 1;

        let piece: PieceData = PieceUtils.getNewNormalPiece(col, row);
        let ids: Array<number> = PieceIds.ALL_NORMAL_IDS;

        assert.isNotNull(piece);
        assert.equal(piece.pieceType, PieceType.NORMAL);
        assert.equal(piece.col, col);
        assert.equal(piece.row, row);
        assert.isTrue(ids.indexOf(piece.pieceId) !== -1);
    });

    it("GetNewPowerUpPiece", () => {

        let col = 2;
        let row = 3;
        let piece1: PieceData = PieceUtils.getNewPowerUpPiece(col, row, PieceType.RAINBOW);
        let piece2: PieceData = PieceUtils.getNewPowerUpPiece(col, row, PieceType.ROW, PieceIds.BLUE);
        let piece3: PieceData = PieceUtils.getNewPowerUpPiece(col, row, PieceType.COL, PieceIds.ORANGE);

        assert.equal(PieceType.RAINBOW, piece1.pieceType);
        assert.equal(PieceType.ROW, piece2.pieceType);
        assert.equal(PieceType.COL, piece3.pieceType);
        assert.equal(PieceIds.RAINBOW, piece1.pieceId);
        assert.equal(PieceIds.BLUE, piece2.pieceId);
        assert.equal(PieceIds.ORANGE, piece3.pieceId);

        assert.isNotNull(piece1);
        assert.equal(piece1.col, col);
        assert.equal(piece1.row, row);
    });



    it("GetNewPowerByChainLengthThree", () => {
        let normalPiece: PieceData = PieceUtils.getNewPowerByChainLength(3, PieceUtils.getNewNormalPiece(0, 0));

        assert.isNull(normalPiece);
    });

    it("GetNewPowerByChainLengthPowerUp", () => {
        let powerUpColRow: PieceData = PieceUtils.getNewPowerByChainLength(4, PieceUtils.getNewNormalPiece(0, 0, PieceIds.YELLOW));
        let powerUpRainbow: PieceData = PieceUtils.getNewPowerByChainLength(5, PieceUtils.getNewNormalPiece(0, 0, PieceIds.GREEN));

        assert.isNotNull(powerUpColRow);
        assert.isNotNull(powerUpRainbow);

        assert.isTrue((powerUpColRow.pieceType === PieceType.COL || powerUpColRow.pieceType === PieceType.ROW));
        assert.equal(PieceType.RAINBOW, powerUpRainbow.pieceType);

        assert.equal(PieceIds.YELLOW, powerUpColRow.pieceId);
        assert.equal(PieceIds.RAINBOW, powerUpRainbow.pieceId);
    });


    it("RemovePieceFromListsOfPieces", () => {
        let piece: PieceData = new PieceData();
        let pieces: Array<PieceData> = [piece];

        PieceUtils.removePieceFromListOfPieces(piece, pieces);

        assert.equal(0, pieces.length);
    });


    it("IsAdjacentHorizontalTrue", () => {
        let piece1: PieceData = new PieceData(1, 1);
        let piece2: PieceData = new PieceData(piece1.col + 1, piece1.row);
        let piece3: PieceData = new PieceData(piece1.col - 1, piece1.row);

        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece2));
        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece3));
        assert.isTrue(PieceUtils.IsAdjacent(piece2, piece1));
        assert.isTrue(PieceUtils.IsAdjacent(piece3, piece1));
    });


    it("IsAdjacentHorizontalFalse", () => {
        let piece1: PieceData = new PieceData(1, 1);
        let piece2: PieceData = new PieceData(piece1.col + 2, piece1.row);

        let result = false;
        let start: number = piece2.col;
        let end: number = piece2.col + 10;

        for (let right: number = start; right < end; right++) {
            piece2.col = right;
            result = (result || PieceUtils.IsAdjacent(piece1, piece2));
        }

        end = piece2.col - 10;
        for (let left: number = start; left < end; left--) {
            piece2.col = left;
            result = (result || PieceUtils.IsAdjacent(piece1, piece2));
        }

        assert.isFalse(PieceUtils.IsAdjacent(piece1, piece2));
    });


    it("IsAdjacentVerticalTrue", () => {
        let piece1: PieceData = new PieceData(1, 1);
        let piece2: PieceData = new PieceData(piece1.col, piece1.row + 1);
        let piece3: PieceData = new PieceData(piece1.col, piece1.row - 1);

        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece2));
        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece3));
        assert.isTrue(PieceUtils.IsAdjacent(piece2, piece1));
        assert.isTrue(PieceUtils.IsAdjacent(piece3, piece1));
    });


    it("IsAdjacentVerticalFalse", () => {
        let piece1: PieceData = new PieceData(1, 1);
        let piece2: PieceData = new PieceData(piece1.col, piece1.row + 2);

        let result = false;
        let start: number = piece2.row;
        let end: number = piece2.row + 10;

        for (let down: number = start; down < end; down++) {
            piece2.row = down;
            result = (result || PieceUtils.IsAdjacent(piece1, piece2));
        }

        end = piece2.row - 10;
        for (let up: number = start; up < end; up--) {
            piece2.row = up;
            result = (result || PieceUtils.IsAdjacent(piece1, piece2));
        }

        assert.isFalse(PieceUtils.IsAdjacent(piece1, piece2));
    });

    it("GetAssetId", () => {
        let pieceId = PieceIds.ORANGE;
        let assetIdRainbowRainbow = PieceUtils.getAssetId(PieceIds.RAINBOW, PieceType.RAINBOW);
        let assetIdOrangeNormal = PieceUtils.getAssetId(pieceId, PieceType.NORMAL);
        let assetIdOrangeRow = PieceUtils.getAssetId(pieceId, PieceType.ROW);
        let assetIdOrangeCol = PieceUtils.getAssetId(pieceId, PieceType.COL);

        assert.equal(AtlasKeys.PIECE_RAINBOW + ".png", assetIdRainbowRainbow, "Rainbow");
        assert.equal(AtlasKeys.PIECE_NORMAL + "_" + pieceId + ".png", assetIdOrangeNormal, "Rainbow");
        assert.equal(AtlasKeys.PIECE_ROW + "_" + pieceId + ".png", assetIdOrangeRow, "Rainbow");
        assert.equal(AtlasKeys.PIECE_COL + "_" + pieceId + ".png", assetIdOrangeCol, "Rainbow");
    });

});
