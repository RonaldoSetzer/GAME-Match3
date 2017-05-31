import { LevelInfo } from "./../../../../src/matchthree/game/models/LevelInfo";
import { assert } from "chai";

describe("LevelInfo", () => {

    it("Constructor: When the type is MOVE_TYPE", () => {
        let scoreStars = [100, 200, 300];
        let levelId = 2;
        let maxCols = 4;
        let maxRows = 6;
        let type =LevelInfo.MOVE_TYPE;
        let numMoves = 10;

        let levelInfo = new LevelInfo(levelId, maxCols, maxRows, type, scoreStars, numMoves);
        assert.equal(levelId, levelInfo.levelId);
        assert.equal(maxCols, levelInfo.maxCols);
        assert.equal(maxRows, levelInfo.maxRows);
        assert.equal(type, levelInfo.levelType);
        assert.equal(scoreStars, levelInfo.scoreStarts);
        assert.equal(numMoves, levelInfo.numMoves);
    });

    it("Constructor: When the type is TIMER_TYPE", () => {
        let scoreStars = [1100, 2100, 3100];
        let levelId = 3;
        let maxCols = 5;
        let maxRows = 7;
        let type =LevelInfo.TIMER_TYPE;
        let numMoves = 0;
        let time = 10;

        let levelInfo = new LevelInfo(levelId, maxCols, maxRows, type, scoreStars, numMoves, time);
        assert.equal(levelId, levelInfo.levelId);
        assert.equal(maxCols, levelInfo.maxCols);
        assert.equal(maxRows, levelInfo.maxRows);
        assert.equal(type, levelInfo.levelType);
        assert.equal(scoreStars, levelInfo.scoreStarts);
        assert.equal(numMoves, levelInfo.numMoves);
        assert.equal(time, levelInfo.time);
    });

});
