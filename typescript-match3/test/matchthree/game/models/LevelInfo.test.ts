import { assert } from "chai";

import { LevelInfo } from "./../../../../src/matchthree/game/models/LevelInfo";

describe("LevelInfo", () => {
    it("Constructor: When the type is MOVE_TYPE", () => {
        const scoreStars = [100, 200, 300];
        const levelId = 2;
        const maxCols = 4;
        const maxRows = 6;
        const type = LevelInfo.MOVE_TYPE;
        const numMoves = 10;

        const levelInfo = new LevelInfo(levelId, maxCols, maxRows, type, scoreStars, numMoves);
        assert.equal(levelId, levelInfo.levelId);
        assert.equal(maxCols, levelInfo.maxCols);
        assert.equal(maxRows, levelInfo.maxRows);
        assert.equal(type, levelInfo.levelType);
        assert.equal(scoreStars, levelInfo.scoreStarts);
        assert.equal(numMoves, levelInfo.numMoves);
    });

    it("Constructor: When the type is TIMER_TYPE", () => {
        const scoreStars = [1100, 2100, 3100];
        const levelId = 3;
        const maxCols = 5;
        const maxRows = 7;
        const type = LevelInfo.TIMER_TYPE;
        const numMoves = 0;
        const time = 10;

        const levelInfo = new LevelInfo(levelId, maxCols, maxRows, type, scoreStars, numMoves, time);
        assert.equal(levelId, levelInfo.levelId);
        assert.equal(maxCols, levelInfo.maxCols);
        assert.equal(maxRows, levelInfo.maxRows);
        assert.equal(type, levelInfo.levelType);
        assert.equal(scoreStars, levelInfo.scoreStarts);
        assert.equal(numMoves, levelInfo.numMoves);
        assert.equal(time, levelInfo.time);
    });
});
