import { assert } from "chai";

import { LevelInfo } from "./../../../../src/matchthree/game/models/LevelInfo";
import { LevelModel } from "./../../../../src/matchthree/game/models/LevelModel";
import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";

describe("LevelModel", () => {
    let levelModel: LevelModel;

    beforeEach(() => {
        levelModel = new LevelModel();
        levelModel.score = 0;
    });

    afterEach(() => {
        levelModel = null;
    });

    it("Reset", () => {
        levelModel.pieces.push(new PieceData());
        levelModel.score = 1000;

        levelModel.toAdd.push(new PieceData());
        levelModel.toRemove.push(new PieceData());
        levelModel.toMove.push(new PieceData());
        levelModel.reset();

        assert.equal(0, levelModel.score, "score");
        assert.equal(0, levelModel.numStars, "numStars");
        assert.equal(0, levelModel.numMoves, "numMoves");
        assert.equal(0, levelModel.pieces.length, "pieces.length");
        assert.equal(0, levelModel.toAdd.length, "toAdd.length");

        assert.equal(0, levelModel.toRemove.length, "toRemove.length");
        assert.equal(0, levelModel.toMove.length, "toMove.length");
    });

    it("Reset: When there is a LevelInfo specified", () => {
        const levelInfo = new LevelInfo(0, 5, 7, LevelInfo.MOVE_TYPE, [4200, 5000, 6000], 10);
        levelModel.levelInfo = levelInfo;
        levelModel.reset();

        assert.equal(levelInfo.numMoves, levelModel.numMoves);
        assert.equal(levelInfo.time, levelModel.clock);
    });

    it("GetMaxCols/GetMaxRows: When there is a LevelInfo specified", () => {
        const levelInfo = new LevelInfo(0, 5, 7, LevelInfo.MOVE_TYPE, [4200, 5000, 6000], 10);
        levelModel.levelInfo = levelInfo;

        assert.equal(levelInfo.maxCols, levelModel.maxCols);
        assert.equal(levelInfo.maxRows, levelModel.maxRows);
    });

    it("AddPiece", () => {
        const piece: PieceData = new PieceData();
        levelModel.addPiece(piece);

        assert.equal(1, levelModel.toAdd.length);
        assert.equal(1, levelModel.pieces.length);

        assert.equal(piece, levelModel.toAdd.pop());
        assert.equal(piece, levelModel.pieces.pop());
    });

    it("AddToMoveList", () => {
        const piece: PieceData = new PieceData();
        levelModel.addToMoveList(piece);

        assert.equal(1, levelModel.toMove.length);
        assert.equal(piece, levelModel.toMove.pop());
    });

    it("AddToRemoveList", () => {
        const piece: PieceData = new PieceData();
        levelModel.addToRemoveList(piece);

        assert.equal(1, levelModel.toRemove.length);
        assert.equal(piece, levelModel.toRemove.pop());
    });

    it("RemovePiece", () => {
        const piece: PieceData = new PieceData();
        levelModel.pieces.push(piece);

        levelModel.toAdd.push(piece);
        levelModel.toMove.push(piece);
        levelModel.removePiece(piece);

        assert.equal(0, levelModel.pieces.length);

        assert.equal(0, levelModel.toAdd.length);
        assert.equal(0, levelModel.toRemove.length);
        assert.equal(0, levelModel.toMove.length);
    });

    it("UpateScoreByNormalType", () => {
        levelModel.updateScoreByPieceType(PieceType.NORMAL);
        assert.equal(100, levelModel.score);
    });

    it("UpateScoreByLineType", () => {
        levelModel.updateScoreByPieceType(PieceType.ROW);
        assert.equal(200, levelModel.score);
    });

    it("UpateScoreByColumnType", () => {
        levelModel.updateScoreByPieceType(PieceType.COL);
        assert.equal(200, levelModel.score);
    });

    it("UpateScoreByRainbowType", () => {
        levelModel.updateScoreByPieceType(PieceType.RAINBOW);
        assert.equal(300, levelModel.score);
    });
});
