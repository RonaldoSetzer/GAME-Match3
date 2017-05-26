import { assert } from "chai";
import { TouchPhase } from "./../../../../src/matchthree/game/models/TouchPhase";
import { SwapModel } from "./../../../../src/matchthree/game/models/SwapModel";

describe("SwapModel", () => {
    let maxCols = 5;
    let maxRows = 7;
    let swapModel: SwapModel;

    beforeEach(() => {
        swapModel = new SwapModel();
        swapModel.setMaxValues(maxCols, maxRows);
    });

    afterEach(() => {
        swapModel = null;
    });

    it("SetPosition", () => {
        let row = 2;
        let col1 = 1;
        let col2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row);
        swapModel.setPosition(TouchPhase.ENDED, col2, row);

        assert.equal(col1, swapModel.first.col);
        assert.equal(row, swapModel.first.row);

        assert.equal(col2, swapModel.second.col);
        assert.equal(row, swapModel.second.row);
    });

    it("SwapDirection: Horizontal", () => {
        let row = 2;
        let col1 = 1;
        let col2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row);
        swapModel.setPosition(TouchPhase.ENDED, col2, row);

        assert.equal(SwapModel.HORIZONTAL, swapModel.swapDirection);
    });

    it("SwapDirection: Vertical", () => {
        let col = 2;
        let row1 = 1;
        let row2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col, row1);
        swapModel.setPosition(TouchPhase.ENDED, col, row2);

        assert.equal(SwapModel.VERTICAL, swapModel.swapDirection);
    });

    it("UpdateStatus: CurrentStatus is SWAP", () => {

        swapModel.status = SwapModel.SWAP;
        swapModel.updateStatus();

        assert.equal(SwapModel.VALIDATE, swapModel.status);
    });

    it("UpdateStatus: CurrentStatus is VALIDATE", () => {

        swapModel.status = SwapModel.VALIDATE;
        swapModel.updateStatus();

        assert.equal("", swapModel.status);
    });

    it("UpdateStatus: CurrentStatus is ROLLBACK", () => {

        swapModel.status = SwapModel.ROLLBACK;
        swapModel.updateStatus();

        assert.equal("", swapModel.status);
    });

    it("SolveRanger: Wrong Values", () => {

        let row1 = -3;
        let col1 = 80;

        let row2 = 30;
        let col2 = -1;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row1);
        swapModel.setPosition(TouchPhase.ENDED, col2, row2);

        assert.equal(maxCols - 1, swapModel.first.col);
        assert.equal(0, swapModel.first.row);

        assert.equal(0, swapModel.second.col);
        assert.equal(maxRows - 1, swapModel.second.row);

    });

    it("SolveRanger: Right Values", () => {

        let row1 = 2;
        let col1 = 4;

        let row2 = 1;
        let col2 = 2;

        swapModel.setPosition(TouchPhase.BEGAN, col1, row1);
        swapModel.setPosition(TouchPhase.ENDED, col2, row2);

        assert.equal(col1, swapModel.first.col);
        assert.equal(row1, swapModel.first.row);

        assert.equal(col2, swapModel.second.col);
        assert.equal(row2, swapModel.second.row);

    });
});
