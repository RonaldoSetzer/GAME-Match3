import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { PieceUtils } from "./../../../../src/matchthree/game/utils/PieceUtils";
import { assert } from "chai";

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

    it("GetNewPowerByChainLength: The chain contains three pieces", () => {
        let normalPiece: PieceData = PieceUtils.getNewPowerByChainLength(3, PieceUtils.getNewNormalPiece(0, 0));

        assert.isNull(normalPiece);
    });

    it("GetNewPowerByChainLength: The chai contains more than three pieces", () => {
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

    it("IsAdjacent: Three adjacent pieces in the same row", () => {
        let piece1: PieceData = new PieceData(1, 1);
        let piece2: PieceData = new PieceData(piece1.col + 1, piece1.row);
        let piece3: PieceData = new PieceData(piece1.col - 1, piece1.row);

        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece2));
        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece3));
    });

    it("IsAdjacent: Three not adjacent pieces in the same row", () => {
        let piece1: PieceData = new PieceData(3, 1);
        let piece2: PieceData = new PieceData(piece1.col + 2, piece1.row);
        let piece3: PieceData = new PieceData(piece1.col - 2, piece1.row);

        assert.isFalse(PieceUtils.IsAdjacent(piece1, piece2));
        assert.isFalse(PieceUtils.IsAdjacent(piece1, piece3));
    });

    it("IsAdjacent: Three adjacent pieces in the same column", () => {
        let piece1: PieceData = new PieceData(1, 3);
        let piece2: PieceData = new PieceData(piece1.col, piece1.row + 1);
        let piece3: PieceData = new PieceData(piece1.col, piece1.row - 1);

        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece2));
        assert.isTrue(PieceUtils.IsAdjacent(piece1, piece3));
    });

    it("IsAdjacent: Three not adjacent pieces in the same column", () => {
        let piece1: PieceData = new PieceData(1, 3);
        let piece2: PieceData = new PieceData(piece1.col, piece1.row + 2);
        let piece3: PieceData = new PieceData(piece1.col, piece1.row - 2);

        assert.isFalse(PieceUtils.IsAdjacent(piece1, piece2));
        assert.isFalse(PieceUtils.IsAdjacent(piece1, piece3));
    });

    it("GetAssetId", () => {
        let pieceId = PieceIds.ORANGE;
        let assetIdRainbowRainbow = PieceUtils.getAssetId(PieceIds.RAINBOW, PieceType.RAINBOW);
        let assetIdOrangeNormal = PieceUtils.getAssetId(pieceId, PieceType.NORMAL);
        let assetIdOrangeRow = PieceUtils.getAssetId(pieceId, PieceType.ROW);
        let assetIdOrangeCol = PieceUtils.getAssetId(pieceId, PieceType.COL);

        let PIECE_NORMAL = "piece_normal_" + pieceId + ".png";
        let PIECE_ROW = "piece_row_" + pieceId + ".png";
        let PIECE_COL = "piece_col_" + pieceId + ".png";
        let PIECE_RAINBOW = "piece_rainbow.png";

        assert.equal(PIECE_RAINBOW, assetIdRainbowRainbow, "PIECE_RAINBOW");
        assert.equal(PIECE_NORMAL, assetIdOrangeNormal, "PIECE_NORMAL");
        assert.equal(PIECE_ROW, assetIdOrangeRow, "PIECE_ROW");
        assert.equal(PIECE_COL, assetIdOrangeCol, "PIECE_COL");
    });
});
