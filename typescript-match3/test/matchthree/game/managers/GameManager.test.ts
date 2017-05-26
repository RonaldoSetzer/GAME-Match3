import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";
import { GridUtils } from "./../../../../src/matchthree/game/utils/GridUtils";
import { GameService } from "./../../../../src/matchthree/services/GameService";
import { GameStatus } from "./../../../../src/matchthree/game/models/GameStatus";
import { SwapModel } from "./../../../../src/matchthree/game/models/SwapModel";
import { LevelModel } from "./../../../../src/matchthree/game/models/LevelModel";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceUtils } from "./../../../../src/matchthree/game/utils/PieceUtils";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { assert } from "chai";
import { GameManager } from "./../../../../src/matchthree/game/managers/GameManager";
import { EventDispatcher } from "robotlegs";

describe("GameManager", () => {

    let gameManager: GameManager;

    beforeEach(() => {
        this.gameManager = new GameManager();
        this.gameManager.levelModel = new LevelModel();
        this.gameManager.swapModel = new SwapModel();
        this.gameManager.gameStatus = new GameStatus();
        this.gameManager.gameService = new GameService();
        this.gameManager.gameService.gameStatus = this.gameManager.gameStatus;
        this.gameManager.gameService.dispatcher = new EventDispatcher(this);
        this.gameManager.generateGrid(8, 8);
    });

    afterEach(() => {
        this.gameManager = null;
    });

    it("GenerateGrid", () => {
        this.gameManager = null;
        this.gameManager = new GameManager();
        this.gameManager.swapModel = new SwapModel();

        let maxCols = 4;
        let maxRows = 6;
        this.gameManager.generateGrid(maxCols, maxRows);

        assert.isNotNull(this.gameManager.grid);
        assert.equal(maxCols, this.gameManager.grid.maxCols);
        assert.equal(maxRows, this.gameManager.grid.maxRows);
    });


/*    it("NextStepFillGrid", () => {
        let count = 0;
        while (GridUtils.hasEmptyPiece(this.gameManager.grid)) {
            count++;
            this.gameManager.nextStep();
            this.gameManager.levelModel.toAdd.length = 0;
            this.gameManager.levelModel.toRemove.length = 0;
            this.gameManager.levelModel.toMove.length = 0;
        }
        assert.isTrue(count >= this.gameManager.grid.maxRows);
    });*/


    it("FillStepOnce", () => {
        let row = 0;
        let firstRow: Array<PieceData> = GridUtils.getRow(this.gameManager.grid, row);

        this.gameManager.fillStep();

        let firstRowAfter: Array<PieceData> = GridUtils.getRow(this.gameManager.grid, row);

        let wasEmpty = true;
        let hasPieceAfterFillStep = true;

        for (let i = 0; i < this.gameManager.grid.maxCols; i++) {
            wasEmpty = (wasEmpty && firstRow[i].pieceType === PieceType.EMPTY);
            hasPieceAfterFillStep = (hasPieceAfterFillStep && firstRowAfter[i].pieceType !== PieceType.EMPTY);
        }

        assert.isTrue(wasEmpty);
        assert.isTrue(hasPieceAfterFillStep);
    });


    it("FillStepTwice", () => {
        let row = 0;
        this.gameManager.fillStep();

        let firstRowBefore: Array<PieceData> = GridUtils.getRow(this.gameManager.grid, row);

        this.gameManager.fillStep();
        let firstRowAfter: Array<PieceData> = GridUtils.getRow(this.gameManager.grid, row);
        let secondRowAfter: Array<PieceData> = GridUtils.getRow(this.gameManager.grid, row + 1);

        let firstRowWasDroppedToSecondRow = true;
        let firstRowAfterIsNotEmpty = true;

        for (let i = 0; i < this.gameManager.grid.maxCols; i++) {
            firstRowAfterIsNotEmpty = (firstRowAfterIsNotEmpty && firstRowAfter[i].pieceType !== PieceType.EMPTY);
            firstRowWasDroppedToSecondRow = (firstRowWasDroppedToSecondRow && (secondRowAfter.indexOf(firstRowBefore[i]) !== -1));
        }

        assert.isTrue(firstRowWasDroppedToSecondRow);
        assert.isTrue(firstRowAfterIsNotEmpty);

    });


    it("CreateNewPiecesAbove", () => {
        let isNotEmpty = true;
        let hasPieceId = true;
        let addedToLevelModel = true;
        let piece: PieceData;
        let topLine = 0;

        this.gameManager.createNewPiecesAbove();

        for (let col = 0; col < this.gameManager.grid.maxCols; col++) {
            piece = this.gameManager.grid.getPiece(col, topLine);
            isNotEmpty = (isNotEmpty && (piece.pieceType !== PieceType.EMPTY));

            if (piece.pieceType === PieceType.NORMAL) {
                hasPieceId = (hasPieceId && (piece.pieceId !== undefined));
                addedToLevelModel = (addedToLevelModel && (this.gameManager.levelModel.pieces.indexOf(piece) !== -1));
            }
        }

        assert.isTrue(isNotEmpty);
        assert.isTrue(hasPieceId);
        assert.isTrue(addedToLevelModel);
    });


    it("CreatePowerUp", () => {
        let powerUp: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.COL, PieceIds.YELLOW);
        this.gameManager.createPowerUp(powerUp);

        assert.equal(powerUp, this.gameManager.grid.getPiece(powerUp.col, powerUp.row));
        assert.isTrue(this.gameManager.levelModel.toAdd.indexOf(powerUp) !== -1);
        assert.isTrue(this.gameManager.levelModel.toMove.indexOf(powerUp) !== -1);
    });


    /*  it("SwapSelectedPieces", () => {
          let piece1col = 1;
          let piece2col = 2;
          let row = 1;
          let piece1: PieceData = PieceUtils.getNewNormalPiece(piece1col, row, PieceIds.YELLOW);
          let piece2: PieceData = PieceUtils.getNewNormalPiece(piece2col, row, PieceIds.GREEN);
          this.gameManager.grid.setPiece(piece1);
          this.gameManager.grid.setPiece(piece2);

          this.gameManager.swapModel.setPosition(TouchPhase.BEGAN, piece1.col, piece1.row);
          this.gameManager.swapModel.setPosition(TouchPhase.ENDED, piece2.col, piece2.row);

          this.gameManager.swapSelectedPieces();

          assert.equal(piece2col, piece1.col);
          assert.equal(piece1col, piece2.col);
          assert.isTrue(this.gameManager.levelModel.toMove.indexOf(piece1) !== -1);
          assert.isTrue(this.gameManager.levelModel.toMove.indexOf(piece2) !== -1);
      });*/


    it("DropOneSingleLine", () => {
        let firstLine: Array<PieceData> = new Array<PieceData>();
        let piece: PieceData;
        let result = true;

        for (let col = 0; col < this.gameManager.grid.maxCols; col++) {
            piece = new PieceData(col, 0, PieceType.NORMAL, PieceIds.BLUE);
            firstLine.push(piece);
            this.gameManager.grid.setPiece(piece);
        }

        this.gameManager.dropPieces();

        let secondLine: Array<PieceData> = GridUtils.getRow(this.gameManager.grid, 1);

        for (let i = 0; i < firstLine.length; i++) {
            result = (result && (secondLine.indexOf(firstLine[i]) !== -1));
        }

        assert.isTrue(result);
    });


    it("RemovePiece", () => {
        let col = 3;
        let row = 2;
        let piece: PieceData = new PieceData(col, row, PieceType.NORMAL, PieceIds.BLUE);

        this.gameManager.grid.setPiece(piece);
        this.gameManager.removePiece(piece);

        assert.equal(this.gameManager.levelModel.toRemove.pop(), piece);
        assert.equal(PieceType.EMPTY, this.gameManager.grid.getPiece(col, row).pieceType);
    });


    it("RemovePieceAndIncreaseScore", () => {
        let piece: PieceData = new PieceData(3, 2, PieceType.NORMAL, PieceIds.BLUE);

        this.gameManager.grid.setPiece(piece);
        this.gameManager.removePiece(piece);

        assert.isTrue(this.gameManager.levelModel.score > 0);
    });


    it("RemovePiecesInList", () => {
        let pieces: Array<PieceData> = new Array<PieceData>();
        pieces.push(new PieceData(1, 6, PieceType.NORMAL, PieceIds.BLUE));
        pieces.push(new PieceData(2, 5, PieceType.NORMAL, PieceIds.GREEN));
        pieces.push(new PieceData(3, 4, PieceType.NORMAL, PieceIds.ORANGE));
        pieces.push(new PieceData(4, 3, PieceType.NORMAL, PieceIds.PINK));
        pieces.push(new PieceData(5, 2, PieceType.NORMAL, PieceIds.LIGHT_BLUE));
        pieces.push(new PieceData(6, 1, PieceType.NORMAL, PieceIds.YELLOW));

        for (let i = 0; i < pieces.length; i++) {
            this.gameManager.grid.setPiece(pieces[i]);
        }
        this.gameManager.removePiecesInList(pieces);

        let isEmpty = true;
        let isInToRemoveList = true;
        let piece: PieceData;

        for (let i = 0; i < pieces.length; i++) {
            piece = pieces[i];

            isInToRemoveList = (isInToRemoveList && (this.gameManager.levelModel.toRemove.indexOf(piece) !== -1));
            isEmpty = (isEmpty && (PieceType.EMPTY === this.gameManager.grid.getPiece(piece.col, piece.row).pieceType));
        }
        assert.isTrue(isInToRemoveList);
        assert.isTrue(isEmpty);
    });


/*    it("RemoveAllChains", () => {
        let map: number[][] = [// -
            [1, 2, 3, 1, 2, 3, 1, 2], // 0
            [1, 4, 4, 4, 3, 6, 2, 3], // 1
            [1, 1, 1, 3, 1, 6, 3, 2], // 2
            [1, 2, 3, 1, 2, 6, 1, 2], // 3
            [2, 3, 1, 2, 3, 6, 2, 3], // 4
            [3, 1, 2, 5, 5, 5, 5, 2], // 5
            [1, 2, 3, 1, 2, 3, 1, 2], // 6
            [2, 3, 1, 2, 3, 1, 2, 3] // 7
        ]; // 5 Chains

        GridUtils.generateByMap(this.gameManager.grid, map);

        let numAllChainsBefore: number = GridUtils.getAllChains(this.gameManager.grid).length;

        this.gameManager.removeAllChains();

        let numAllChainsAfter: number = GridUtils.getAllChains(this.gameManager.grid).length;

        assert.isTrue(numAllChainsBefore > 0);
        assert.isTrue(numAllChainsAfter === 0);
    });*/


    /*it("RemoveAllChainsWithPowerUpRow", () => {
        let map: number[][] = [// -
            [6, 2, 3, 1, 2, 3, 1, 2], // 0
            [6, 4, 4, 4, 3, 6, 2, 3], // 1
            [6, 1, 1, 1, 2, 6, 3, 2], // 2
            [1, 2, 3, 1, 2, 6, 1, 2], // 3
            [2, 3, 1, 2, 3, 4, 2, 3], // 4
            [3, 1, 2, 5, 5, 5, 5, 2], // 5
            [1, 2, 3, 1, 2, 3, 1, 2], // 6
            [2, 3, 1, 2, 3, 1, 2, 3] // 7
        ];

        GridUtils.generateByMap(this.gameManager.grid, map);

        let row = 2;
        let powerUp: PieceData = PieceUtils.getNewPowerUpPiece(2, row, PieceType.ROW, PieceIds.BLUE);

        this.gameManager.grid.setPiece(powerUp);
        this.gameManager.removeAllChains();

        let rowWithPowerUpEffect: Array<PieceData> = GridUtils.getRow(this.gameManager.grid, row);
        let isAllPiecesEmpty = true;
        for (let i = 0; i < rowWithPowerUpEffect.length; i++) {
            isAllPiecesEmpty = (isAllPiecesEmpty && (rowWithPowerUpEffect[i].pieceType === PieceType.EMPTY));

        }
        assert.isTrue(isAllPiecesEmpty);
    });*/


    /*it("RemoveAllChainsWithPowerUpCol", () => {
        let map: number[][] = [// -
            [6, 2, 3, 1, 2, 3, 1, 2], // 0
            [6, 4, 4, 4, 3, 6, 2, 3], // 1
            [6, 1, 1, 1, 2, 6, 3, 2], // 2
            [1, 2, 3, 1, 2, 6, 1, 2], // 3
            [2, 3, 1, 2, 3, 4, 2, 3], // 4
            [3, 1, 2, 5, 5, 5, 5, 2], // 5
            [1, 2, 3, 1, 2, 3, 1, 2], // 6
            [2, 3, 1, 2, 3, 1, 2, 3] // 7
        ];

        GridUtils.generateByMap(this.gameManager.grid, map);

        let col = 0;
        let powerUp: PieceData = PieceUtils.getNewPowerUpPiece(col, 0, PieceType.COL, PieceIds.LIGHT_BLUE);

        this.gameManager.grid.setPiece(powerUp);
        this.gameManager.removeAllChains();

        let colWithPowerUpEffect: Array<PieceData> = GridUtils.getCol(this.gameManager.grid, col);
        let isAllPiecesEmpty = true;
        for (let i = 0; i < colWithPowerUpEffect.length; i++) {
            isAllPiecesEmpty = (isAllPiecesEmpty && (colWithPowerUpEffect[i].pieceType === PieceType.EMPTY));

        }
        assert.isTrue(isAllPiecesEmpty);
    });*/


    /*it("RemoveAllChainsWithPowerUpRainbow", () => {
        let map: number[][] = [// -
            [6, 2, 3, 1, 2, 3, 1, 2], // 0
            [6, 4, 4, 4, 3, 6, 2, 3], // 1
            [6, 1, 1, 1, 2, 6, 3, 2], // 2
            [1, 2, 3, 1, 2, 6, 1, 2], // 3
            [2, 3, 1, 2, 3, 4, 2, 3], // 4
            [3, 1, 2, 5, 5, 5, 1, 2], // 5
            [1, 2, 3, 1, 2, 3, 1, 2], // 6
            [2, 3, 1, 2, 3, 1, 2, 3]// 7
        ];

        GridUtils.generateByMap(this.gameManager.grid, map);

        let col = 4;
        let row = 2;

        let powerUpRainbow: PieceData = PieceUtils.getNewPowerUpPiece(col, row, PieceType.RAINBOW, PieceIds.RAINBOW);
        this.gameManager.grid.setPiece(powerUpRainbow);

        let powerUpRow: PieceData = PieceUtils.getNewPowerUpPiece(col - 1, row, PieceType.ROW, PieceIds.BLUE);
        this.gameManager.grid.setPiece(powerUpRow);
        this.gameManager.removeAllChains();

        let isAllPiecesEmpty = true;
        let colAndRowWithPowerUpEffect: Array<PieceData> = GridUtils.getCol(this.gameManager.grid, col);
        colAndRowWithPowerUpEffect = colAndRowWithPowerUpEffect.concat(GridUtils.getRow(this.gameManager.grid, row));

        for (let i = 0; i < colAndRowWithPowerUpEffect.length; i++) {
            isAllPiecesEmpty = (isAllPiecesEmpty && (colAndRowWithPowerUpEffect[i].pieceType === PieceType.EMPTY));

        }
        assert.isTrue(isAllPiecesEmpty);
    });*/


    /*it("RemoveAllChainsAndCreatePowerUp", () => {
        let map: number[][] = [// -
            [6, 2, 3, 1, 2, 3, 1, 2], // 0
            [6, 4, 4, 4, 3, 6, 2, 3], // 1
            [6, 1, 1, 1, 1, 6, 3, 1], // 2
            [6, 2, 3, 1, 2, 3, 1, 2], // 3
            [2, 3, 6, 6, 6, 6, 6, 2], // 4
            [3, 1, 2, 5, 5, 2, 2, 1], // 5
            [1, 2, 3, 1, 2, 3, 1, 1], // 6
            [2, 3, 1, 2, 3, 1, 2, 3]// 7
        ];
        // PowerUps
        //    col:1 (Row or Col)
        //    row:2 (Row or Col)
        //    row:3 (Rainbow)

        GridUtils.generateByMap(this.gameManager.grid, map);
        this.gameManager.removeAllChains();

        let numPowerUps = 3;
        let allPowerUpsLength: number = GridUtils.getAllPowerUps(this.gameManager.grid).length;

        assert.equal(numPowerUps, allPowerUpsLength);
    });*/


    it("RemovePiecesInListWithPowerUp", () => {
        let pieces: Array<PieceData> = GridUtils.spawnNewRow(this.gameManager.grid, 0);

        let powerUpRow: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.ROW, PieceIds.BLUE);
        this.gameManager.grid.setPiece(powerUpRow);
        pieces[0] = powerUpRow;

        this.gameManager.removePiecesInList(pieces);

        let isEmpty = true;
        let isInToRemoveList = true;
        let piece: PieceData;

        for (let i = 0; i < pieces.length; i++) {
            piece = pieces[i];

            isInToRemoveList = (isInToRemoveList && (this.gameManager.levelModel.toRemove.indexOf(piece) !== -1));
            isEmpty = (isEmpty && PieceType.EMPTY === this.gameManager.grid.getPiece(piece.col, piece.row).pieceType);
        }
        assert.isTrue(isInToRemoveList);
        assert.isTrue(isEmpty);
    });


    /*it("RemoveAllPieces", () => {
        let map: number[][] = [// -
            [1, 2, 3, 1, 2, 3, 1, 2], // 0
            [1, 4, 4, 4, 3, 6, 2, 3], // 1
            [1, 1, 1, 3, 1, 6, 3, 2], // 2
            [1, 2, 3, 1, 2, 6, 1, 2], // 3
            [2, 3, 1, 2, 3, 4, 2, 3], // 4
            [3, 1, 2, 5, 5, 5, 5, 2], // 5
            [1, 2, 3, 1, 2, 3, 1, 2], // 6
            [2, 3, 1, 2, 3, 1, 2, 3]// 7
        ];

        GridUtils.generateByMap(this.gameManager.grid, map);

        this.gameManager.removeAllPieces();

        let pieces: Array<PieceData> = GridUtils.getAllPieces(this.gameManager.grid);
        let isEmpty = true;
        let piece: PieceData;

        for (let i = 0; i < pieces.length; i++) {
            piece = pieces[i];

            isEmpty = (isEmpty && PieceType.EMPTY === this.gameManager.grid.getPiece(piece.col, piece.row).pieceType);
        }
        assert.equal(64, pieces.length);
        assert.equal(64, this.gameManager.levelModel.toRemove.length);
        assert.isTrue(isEmpty);
    });*/
});
