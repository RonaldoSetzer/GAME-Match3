import { assert } from "chai";

import { SwapModel } from "./../../../../src/matchthree/game/models/SwapModel";
import { TouchPhase } from "./../../../../src/matchthree/game/models/TouchPhase";

describe("SwapModel", () => {
    const maxCols = 5;
    const maxRows = 7;
    let swapModel: SwapModel;

    beforeEach(() => {
        swapModel = new SwapModel();
        swapModel.setMaxValues(maxCols, maxRows);
    });

    afterEach(() => {
        swapModel = null;
    });

    it("SetPosition", () => {
        const row = 2;
        const col1 = 1;
        const col2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row);
        swapModel.setPosition(TouchPhase.ENDED, col2, row);

        assert.equal(col1, swapModel.first.col);
        assert.equal(row, swapModel.first.row);

        assert.equal(col2, swapModel.second.col);
        assert.equal(row, swapModel.second.row);
    });

    it("SwapDirection: When the movement is Horizontal", () => {
        const row = 2;
        const col1 = 1;
        const col2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row);
        swapModel.setPosition(TouchPhase.ENDED, col2, row);

        assert.equal(SwapModel.HORIZONTAL, swapModel.swapDirection);
    });

    it("SwapDirection: When the movement is Vertical", () => {
        const col = 2;
        const row1 = 1;
        const row2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col, row1);
        swapModel.setPosition(TouchPhase.ENDED, col, row2);

        assert.equal(SwapModel.VERTICAL, swapModel.swapDirection);
    });

    it("UpdateStatus: When the CurrentStatus is SWAP", () => {
        swapModel.status = SwapModel.SWAP;
        swapModel.updateStatus();

        assert.equal(SwapModel.VALIDATE, swapModel.status);
    });

    it("UpdateStatus: When the CurrentStatus is VALIDATE", () => {
        swapModel.status = SwapModel.VALIDATE;
        swapModel.updateStatus();

        assert.equal("", swapModel.status);
    });

    it("UpdateStatus: When the CurrentStatus is ROLLBACK", () => {
        swapModel.status = SwapModel.ROLLBACK;
        swapModel.updateStatus();

        assert.equal("", swapModel.status);
    });

    it("SolveRanger", () => {
        const row1 = 2;
        const col1 = 4;

        const row2 = 1;
        const col2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row1);
        swapModel.setPosition(TouchPhase.ENDED, col2, row2);

        assert.equal(col1, swapModel.first.col);
        assert.equal(row1, swapModel.first.row);

        assert.equal(col2, swapModel.second.col);
        assert.equal(row2, swapModel.second.row);
    });

    it("SolveRanger: When the Values are more and less the max sizes", () => {
        const row1 = -3;
        const col1 = 80;

        const row2 = 30;
        const col2 = -1;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row1);
        swapModel.setPosition(TouchPhase.ENDED, col2, row2);

        assert.equal(maxCols - 1, swapModel.first.col);
        assert.equal(0, swapModel.first.row);

        assert.equal(0, swapModel.second.col);
        assert.equal(maxRows - 1, swapModel.second.row);
    });
});
