import { GridData } from "./../../../../src/matchthree/game/models/GridData";
import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";
import { Tile } from "./../../../../src/matchthree/game/models/Tile";
import { GridUtils } from "./../../../../src/matchthree/game/utils/GridUtils";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { assert } from "chai";

describe("GridUtils", () => {

    let grid: GridData;

    beforeEach(() => {
        let map: number[][] = [
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [3, 4, 5, 1, 2],
            [5, 4, 3, 2, 1],
            [5, 2, 3, 4, 5],
            [1, 2, 4, 4, 5]
        ];
        grid = new GridData(5, 6);
        GridUtils.generateByMap(grid, map);
    });

    afterEach(() => {
        grid = null;
    });

    it("HasEmptyPiece: TRUE", () => {
        grid = new GridData(3, 4);
        assert.isTrue(GridUtils.hasEmptyPiece(grid));
    });

    it("HasEmptyPiece: FALSE", () => {
        assert.isFalse(GridUtils.hasEmptyPiece(grid));
    });

    it("GetAllPieces", () => {
        let total = grid.maxCols * grid.maxRows;
        let allPieces: Array<PieceData> = GridUtils.getAllPieces(grid);
        assert.equal(total, allPieces.length);
    });

    it("GetAllPiecesById", () => {
        let lightBluePieces: Array<PieceData> = [
            new PieceData(0, 0, PieceType.NORMAL, PieceIds.LIGHT_BLUE),
            new PieceData(1, 1, PieceType.NORMAL, PieceIds.LIGHT_BLUE),
            new PieceData(2, 2, PieceType.NORMAL, PieceIds.LIGHT_BLUE)
        ];

        for (let i = 0; i < lightBluePieces.length; i++) {
            grid.setPiece(lightBluePieces[i]);
        }

        let allPiecesById: Array<PieceData> = GridUtils.getAllPiecesById(grid, PieceIds.LIGHT_BLUE);
        assert.equal(lightBluePieces.length, allPiecesById.length);
        assert.isTrue(allPiecesById.indexOf(lightBluePieces[0]) !== -1);
        assert.isTrue(allPiecesById.indexOf(lightBluePieces[1]) !== -1);
        assert.isTrue(allPiecesById.indexOf(lightBluePieces[2]) !== -1);
    });

    it("GetAllPowerUps", () => {
        let powerUpsPieces: Array<PieceData> = [
            new PieceData(0, 0, PieceType.COL, PieceIds.BLUE),
            new PieceData(1, 1, PieceType.ROW, PieceIds.LIGHT_BLUE),
            new PieceData(2, 2, PieceType.RAINBOW, PieceIds.RAINBOW)
        ];

        for (let i = 0; i < powerUpsPieces.length; i++) {
            grid.setPiece(powerUpsPieces[i]);
        }

        let allPiecesById: Array<PieceData> = GridUtils.getAllPowerUps(grid);
        assert.equal(powerUpsPieces.length, allPiecesById.length);
        assert.isTrue(allPiecesById.indexOf(powerUpsPieces[0]) !== -1);
        assert.isTrue(allPiecesById.indexOf(powerUpsPieces[1]) !== -1);
        assert.isTrue(allPiecesById.indexOf(powerUpsPieces[2]) !== -1);
    });

    it("GetAllChains", () => {
        let map: number[][] = [
            [1, 1, 1, 4, 5],
            [1, 2, 3, 3, 3],
            [3, 4, 5, 1, 2],
            [5, 4, 3, 2, 1],
            [5, 4, 3, 4, 5],
            [1, 2, 4, 4, 5]
        ];
        grid = new GridData(5, 6);
        GridUtils.generateByMap(grid, map);

        let total = 3; // 1 (row:0), 3 (row:1), 4 (col:1)
        assert.equal(total, GridUtils.getAllChains(grid).length);
    });

    it("GetHorizontalChains", () => {
        let map: number[][] = [
            [1, 1, 1, 4, 5, 5, 5],
            [1, 2, 3, 3, 3, 1, 2],
            [3, 4, 5, 1, 2, 2, 1]
        ];
        grid = new GridData(7, 3);
        GridUtils.generateByMap(grid, map);

        let total = 2; // 1 (row:0), 5 (row:0)
        let horizontalChains = GridUtils.getHorizontalChains(grid, 0);
        assert.equal(total, horizontalChains.length);
        assert.equal(3, horizontalChains[0].length);
        assert.equal(3, horizontalChains[1].length);
    });

    it("GetVerticalChains", () => {
        let map: number[][] = [
            [1, 1, 1],
            [1, 2, 3],
            [1, 4, 5],
            [5, 4, 3],
            [3, 4, 3],
            [3, 2, 4],
            [3, 2, 1]
        ];
        grid = new GridData(3, 7);
        GridUtils.generateByMap(grid, map);

        let total = 2; // 1 (col:0), 3 (col:0)
        let verticalChains = GridUtils.getVerticalChains(grid, 0);
        assert.equal(total, verticalChains.length);
        assert.equal(3, verticalChains[0].length);
        assert.equal(3, verticalChains[1].length);
    });

    it("GetChainWithPiece", () => {
        let map: number[][] = [
            [1, 1, 1, 4, 5],
            [1, 2, 3, 3, 3],
            [1, 4, 5, 1, 2],
            [5, 4, 3, 2, 1],
            [5, 4, 3, 4, 5],
            [1, 2, 4, 4, 5]
        ];
        grid = new GridData(5, 6);
        GridUtils.generateByMap(grid, map);

        let total = 6; // 1 (row:0), 1 (col:0)
        let chain = GridUtils.getChainWithPiece(grid, grid.getPiece(0, 0));
        assert.equal(total, chain.length);
    });

    it("RemovePiece", () => {
        GridUtils.removePiece(grid, grid.getPiece(0, 0));
        assert.equal(PieceType.EMPTY, grid.getPiece(0, 0).pieceType);
        assert.equal(PieceIds.EMPTY, grid.getPiece(0, 0).pieceId);
    });

    it("SwapPieces", () => {
        let firstPosition = new Tile(0, 0);
        let secondPosition = new Tile(0, 0);
        let firstPiece = grid.getPiece(firstPosition.col, firstPosition.row);
        let secondPiece = grid.getPiece(secondPosition.col, secondPosition.row);

        GridUtils.swapPieces(grid, firstPiece, secondPiece);

        assert.equal(firstPosition.col, secondPiece.col);
        assert.equal(firstPosition.col, secondPiece.row);

        assert.equal(secondPosition.col, firstPiece.col);
        assert.equal(secondPosition.col, firstPiece.row);

    });

    it("SpawnNewRow", () => {
        for (let col = 0; col < grid.maxCols; col++) {
            GridUtils.removePiece(grid, grid.getPiece(col, 0));
        }
        GridUtils.spawnNewRow(grid, 0);
        assert.isFalse(GridUtils.hasEmptyPiece(grid));
    });

    it("SpawnNewRow: With obstacles", () => {
        for (let col = 0; col < grid.maxCols; col++) {
            if (col % 2 === 0) {
                continue;
            }
            GridUtils.removePiece(grid, grid.getPiece(col, 0));
        }
        GridUtils.spawnNewRow(grid, 0);
        assert.isFalse(GridUtils.hasEmptyPiece(grid));
    });
});
