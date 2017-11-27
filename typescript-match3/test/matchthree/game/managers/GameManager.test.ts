import { assert } from "chai";
import { EventDispatcher } from "@robotlegsjs/core";
import sinon = require("sinon");

import { GameManager } from "./../../../../src/matchthree/game/managers/GameManager";
import { GameStatus } from "./../../../../src/matchthree/game/models/GameStatus";
import { LevelModel } from "./../../../../src/matchthree/game/models/LevelModel";
import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";
import { SwapModel } from "./../../../../src/matchthree/game/models/SwapModel";
import { Tile } from "./../../../../src/matchthree/game/models/Tile";
import { TouchPhase } from "./../../../../src/matchthree/game/models/TouchPhase";
import { GridUtils } from "./../../../../src/matchthree/game/utils/GridUtils";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { PieceUtils } from "./../../../../src/matchthree/game/utils/PieceUtils";
import { GameService } from "./../../../../src/matchthree/services/GameService";

describe("GameManager", () => {
    let gameManager: GameManager;

    beforeEach(() => {
        const gameStatus: GameStatus = new GameStatus();

        gameManager = new GameManager();
        gameManager.levelModel = new LevelModel();
        gameManager.swapModel = new SwapModel();
        gameManager.gameStatus = gameStatus;
        gameManager.gameService = new GameService();
        gameManager.gameService.gameStatus = gameStatus;
        gameManager.gameService.eventDispatcher = new EventDispatcher();
        gameManager.generateGrid(8, 8);
    });

    afterEach(() => {
        gameManager = null;
    });

    /* CONTEXT: MODIFYING THE GRID */
    it("GenerateGrid", () => {
        const maxCols = 4;
        const maxRows = 6;
        gameManager.generateGrid(maxCols, maxRows);

        assert.isNotNull(gameManager.grid);
        assert.equal(maxCols, gameManager.grid.maxCols);
        assert.equal(maxRows, gameManager.grid.maxRows);
    });

    it("FillStep: Called once", () => {
        const row = 0;
        const firstRowBefore: PieceData[] = GridUtils.getRow(gameManager.grid, row);

        gameManager.fillStep();

        const firstRowAfter: PieceData[] = GridUtils.getRow(gameManager.grid, row);

        const isEmptyBefore = firstRowBefore.every(e => e.pieceType === PieceType.EMPTY);
        const isNotEmptyAfter = firstRowAfter.every(e => e.pieceType !== PieceType.EMPTY);

        assert.isTrue(isEmptyBefore);
        assert.isTrue(isNotEmptyAfter);
    });

    it("FillStep: Called twice", () => {
        const row = 0;
        gameManager.fillStep();

        const firstRowBefore: PieceData[] = GridUtils.getRow(gameManager.grid, row);

        gameManager.fillStep();

        const firstRowAfter: PieceData[] = GridUtils.getRow(gameManager.grid, row);
        const secondRowAfter: PieceData[] = GridUtils.getRow(gameManager.grid, row + 1);
        const firstRowAfterIsNotEmpty = firstRowAfter.every(e => e.pieceType !== PieceType.EMPTY);
        const firstRowWasDroppedToSecondRow = secondRowAfter.every(e => secondRowAfter.indexOf(e) !== -1);

        assert.isTrue(firstRowWasDroppedToSecondRow);
        assert.isTrue(firstRowAfterIsNotEmpty);
    });

    it("CreateNewPiecesAbove", () => {
        let isNotEmpty = true;
        let hasPieceId = true;
        let addedToLevelModel = true;
        let piece: PieceData;
        const topLine = 0;

        gameManager.createNewPiecesAbove();

        for (let col = 0; col < gameManager.grid.maxCols; col++) {
            piece = gameManager.grid.getPiece(col, topLine);
            isNotEmpty = isNotEmpty && piece.pieceType !== PieceType.EMPTY;

            if (piece.pieceType === PieceType.NORMAL) {
                hasPieceId = hasPieceId && piece.pieceId !== undefined;
                addedToLevelModel = addedToLevelModel && gameManager.levelModel.pieces.indexOf(piece) !== -1;
            }
        }

        assert.isTrue(isNotEmpty);
        assert.isTrue(hasPieceId);
        assert.isTrue(addedToLevelModel);
    });

    it("CreatePowerUp", () => {
        const powerUp: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.COL, PieceIds.YELLOW);
        gameManager.createPowerUp(powerUp);

        assert.equal(powerUp, gameManager.grid.getPiece(powerUp.col, powerUp.row));
        assert.isTrue(gameManager.levelModel.toAdd.indexOf(powerUp) !== -1);
        assert.isTrue(gameManager.levelModel.toMove.indexOf(powerUp) !== -1);
    });

    it("DropPieces", () => {
        const firstLine: PieceData[] = new Array<PieceData>();
        let piece: PieceData;
        let result = true;

        for (let col = 0; col < gameManager.grid.maxCols; col++) {
            piece = new PieceData(col, 0, PieceType.NORMAL, PieceIds.BLUE);
            firstLine.push(piece);
            gameManager.grid.setPiece(piece);
        }

        gameManager.dropPieces();

        const secondLine: PieceData[] = GridUtils.getRow(gameManager.grid, 1);

        for (const line of firstLine) {
            result = result && secondLine.indexOf(line) !== -1;
        }

        assert.isTrue(result);
    });

    /* CONTEXT: REMOVING PIECES*/

    it("RemovePiece", () => {
        const col = 3;
        const row = 2;
        const piece: PieceData = new PieceData(col, row, PieceType.NORMAL, PieceIds.BLUE);

        gameManager.grid.setPiece(piece);
        gameManager.removePiece(piece);

        assert.equal(gameManager.levelModel.toRemove.pop(), piece);
        assert.equal(PieceType.EMPTY, gameManager.grid.getPiece(col, row).pieceType);
    });

    it("RemovePiece: Remove a piece and increase Score", () => {
        const piece: PieceData = new PieceData(3, 2, PieceType.NORMAL, PieceIds.BLUE);

        gameManager.grid.setPiece(piece);
        gameManager.removePiece(piece);

        assert.isTrue(gameManager.levelModel.score > 0);
    });

    it("RemovePiecesInList", () => {
        const pieces: PieceData[] = new Array<PieceData>();
        pieces.push(new PieceData(1, 6, PieceType.NORMAL, PieceIds.BLUE));
        pieces.push(new PieceData(2, 5, PieceType.NORMAL, PieceIds.GREEN));
        pieces.push(new PieceData(3, 4, PieceType.NORMAL, PieceIds.ORANGE));
        pieces.push(new PieceData(4, 3, PieceType.NORMAL, PieceIds.PINK));
        pieces.push(new PieceData(5, 2, PieceType.NORMAL, PieceIds.LIGHT_BLUE));
        pieces.push(new PieceData(6, 1, PieceType.NORMAL, PieceIds.YELLOW));

        for (const piece of pieces) {
            gameManager.grid.setPiece(piece);
        }
        gameManager.removePiecesInList(pieces);

        let isEmpty = true;
        let isInToRemoveList = true;

        for (const piece of pieces) {
            isInToRemoveList = isInToRemoveList && gameManager.levelModel.toRemove.indexOf(piece) !== -1;
            isEmpty = isEmpty && PieceType.EMPTY === gameManager.grid.getPiece(piece.col, piece.row).pieceType;
        }
        assert.isTrue(isInToRemoveList);
        assert.isTrue(isEmpty);
    });

    it("RemoveAllChains", () => {
        const map: number[][] = [
            // -
            [1, 2, 3, 1, 2, 3, 1, 2], //  [1              ]
            [1, 4, 4, 4, 3, 6, 2, 3], //  [1 4 4 4   6    ]
            [1, 1, 1, 3, 1, 6, 3, 2], //  [1 1 1     6    ]
            [1, 2, 3, 1, 2, 6, 1, 2], //  [1         6    ]
            [2, 3, 1, 2, 3, 6, 2, 3], //  [          6    ]
            [3, 1, 2, 5, 5, 5, 5, 2], //  [      5 5 5 5  ]
            [1, 2, 3, 1, 2, 3, 1, 2], //  [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [               ]
        ]; // 5 Chains

        GridUtils.generateByMap(gameManager.grid, map);

        const numAllChainsBefore: number = GridUtils.getAllChains(gameManager.grid).length;

        gameManager.removeAllChains();

        const numAllChainsAfter: number = GridUtils.getAllChains(gameManager.grid).length;

        assert.isTrue(numAllChainsBefore > 0);
        assert.isTrue(numAllChainsAfter === 0);
    });

    it("RemoveAllChains: Remove all chains in the list (params)", () => {
        const map: number[][] = [
            // -
            [4, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [1, 4, 4, 4, 3, 4, 2, 3], // [1 4 4 4        ]
            [1, 1, 1, 3, 1, 6, 3, 2], // [1 1 1     6    ]
            [1, 2, 3, 1, 2, 6, 1, 2], // [1         6    ]
            [2, 3, 1, 2, 3, 6, 2, 3], // [          6    ]
            [3, 1, 2, 1, 5, 5, 5, 2], // [        5 5 5  ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //  [               ]
        ]; // 5 Chains

        GridUtils.generateByMap(gameManager.grid, map);

        gameManager.removeAllChains(GridUtils.getAllChains(gameManager.grid));

        const numChains: number = GridUtils.getAllChains(gameManager.grid).length;

        assert.isTrue(numChains === 0);
        assert.isTrue(gameManager.levelModel.toAdd.length === 0);
    });

    it("RemoveAllChains: Remove all chains and applies the PowerUpRow effect", () => {
        const map: number[][] = [
            // -
            [6, 2, 3, 1, 2, 3, 1, 2], // [6              ]
            [6, 4, 4, 4, 3, 6, 2, 3], // [6 4  4 4   6    ]
            [6, 1, 1, 1, 2, 6, 3, 2], // [6 1 R1 1   6    ]
            [1, 2, 3, 1, 2, 6, 1, 2], // [           6    ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [                ]
            [3, 1, 2, 5, 5, 5, 5, 2], // [       5 5 5 5  ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [                ]
            [2, 3, 1, 2, 3, 1, 2, 3] //  [                ]
        ];

        GridUtils.generateByMap(gameManager.grid, map);

        const row = 2;
        const powerUp: PieceData = PieceUtils.getNewPowerUpPiece(2, row, PieceType.ROW, PieceIds.BLUE);

        gameManager.grid.setPiece(powerUp);
        gameManager.removeAllChains();

        const result = GridUtils.getRow(gameManager.grid, row).every(e => e.pieceType === PieceType.EMPTY);

        assert.isTrue(result);
    });

    it("RemoveAllChains: Remove all chains and applies the PowerUpCol effect", () => {
        const map: number[][] = [
            // -
            [6, 2, 3, 1, 2, 3, 1, 2], // [C6              ]
            [6, 4, 4, 4, 3, 6, 2, 3], // [ 6 4 4 4   6    ]
            [6, 1, 1, 1, 2, 6, 3, 2], // [ 6 1 1 1   6    ]
            [1, 2, 3, 1, 2, 6, 1, 2], // [           6    ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [                ]
            [3, 1, 2, 5, 5, 5, 5, 2], // [       5 5 5 5  ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [                ]
            [2, 3, 1, 2, 3, 1, 2, 3] //  [                ]
        ];

        GridUtils.generateByMap(gameManager.grid, map);

        const col = 0;
        const powerUp: PieceData = PieceUtils.getNewPowerUpPiece(col, 0, PieceType.COL, PieceIds.LIGHT_BLUE);

        gameManager.grid.setPiece(powerUp);
        gameManager.removeAllChains();

        const isAllEmpty = GridUtils.getCol(gameManager.grid, col).every(e => e.pieceType === PieceType.EMPTY);
        assert.isTrue(isAllEmpty);
    });

    it("RemoveAllChains: Remove all chains and applies the PowerUpRainbow effect (Cross)", () => {
        const map: number[][] = [
            // -
            [6, 2, 3, 1, 2, 3, 1, 2], // [6              ]
            [6, 4, 4, 4, 3, 6, 2, 3], // [6 4 4 4   6    ]
            [6, 1, 1, 1, 2, 6, 3, 2], // [6 1 1 1   6    ]
            [1, 2, 3, 1, 2, 6, 1, 2], // [          6    ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 5, 5, 1, 2], // [      5 5 5    ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [               ]
        ];

        GridUtils.generateByMap(gameManager.grid, map);

        const col = 4;
        const row = 2;

        const powerUpRainbow: PieceData = PieceUtils.getNewPowerUpPiece(col, row, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(powerUpRainbow);

        const powerUpRow: PieceData = PieceUtils.getNewPowerUpPiece(col - 1, row, PieceType.ROW, PieceIds.BLUE);
        gameManager.grid.setPiece(powerUpRow);
        gameManager.removeAllChains();

        let pieces: PieceData[] = GridUtils.getCol(gameManager.grid, col);
        pieces = pieces.concat(GridUtils.getRow(gameManager.grid, row));
        const isAllPiecesEmpty = pieces.every(e => e.pieceType === PieceType.EMPTY);

        assert.isTrue(isAllPiecesEmpty);
    });

    it("RemoveAllChains: Remove all chains and creates a new PowerUp", () => {
        const map: number[][] = [
            // -
            [6, 2, 3, 1, 2, 3, 1, 2], // [6              ]
            [6, 4, 4, 4, 3, 6, 2, 3], // [6 4 4 4        ]
            [6, 1, 1, 1, 1, 6, 3, 1], // [6 1 1 1 1      ]
            [6, 2, 3, 1, 2, 3, 1, 2], // [6              ]
            [2, 3, 6, 6, 6, 6, 6, 2], // [    6 6 6 6 6  ]
            [3, 1, 2, 5, 5, 2, 2, 1], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 1], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [               ]
        ];
        // PowerUps
        //    col:1 (Row or Col)
        //    row:2 (Row or Col)
        //    row:3 (Rainbow)

        GridUtils.generateByMap(gameManager.grid, map);
        gameManager.removeAllChains();

        const numPowerUps = 3;
        const allPowerUpsLength: number = GridUtils.getAllPowerUps(gameManager.grid).length;

        assert.equal(numPowerUps, allPowerUpsLength);
    });

    it("RemovePiecesInList: Remove all pieces in the list and applies the PowerUp effect", () => {
        const pieces: PieceData[] = GridUtils.spawnNewRow(gameManager.grid, 0);

        const powerUpRow: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.ROW, PieceIds.BLUE);
        gameManager.grid.setPiece(powerUpRow);
        pieces[0] = powerUpRow;

        gameManager.removePiecesInList(pieces);

        let isEmpty = true;
        let isInToRemoveList = true;

        for (const piece of pieces) {
            isInToRemoveList = isInToRemoveList && gameManager.levelModel.toRemove.indexOf(piece) !== -1;
            isEmpty = isEmpty && PieceType.EMPTY === gameManager.grid.getPiece(piece.col, piece.row).pieceType;
        }
        assert.isTrue(isInToRemoveList);
        assert.isTrue(isEmpty);
    });

    it("RemoveAllPieces", () => {
        const map: number[][] = [
            // -
            [1, 2, 3, 1, 2, 3, 1, 2], // 0
            [1, 4, 4, 4, 3, 6, 2, 3], // 1
            [1, 1, 1, 3, 1, 6, 3, 2], // 2
            [1, 2, 3, 1, 2, 6, 1, 2], // 3
            [2, 3, 1, 2, 3, 4, 2, 3], // 4
            [3, 1, 2, 5, 5, 5, 5, 2], // 5
            [1, 2, 3, 1, 2, 3, 1, 2], // 6
            [2, 3, 1, 2, 3, 1, 2, 3] // 7
        ];

        GridUtils.generateByMap(gameManager.grid, map);

        gameManager.removeAllPieces();

        const pieces: PieceData[] = GridUtils.getAllPieces(gameManager.grid);
        let isEmpty = true;

        for (const piece of pieces) {
            isEmpty = isEmpty && PieceType.EMPTY === gameManager.grid.getPiece(piece.col, piece.row).pieceType;
        }
        assert.equal(64, pieces.length);
        assert.equal(64, gameManager.levelModel.toRemove.length);
        assert.isTrue(isEmpty);
    });
    /*CONTEXT: SWAPING PIECES*/
    it("SwapSelectedPieces", () => {
        const piece1col = 1;
        const piece2col = 2;
        const row = 1;
        const piece1: PieceData = PieceUtils.getNewNormalPiece(piece1col, row, PieceIds.YELLOW);
        const piece2: PieceData = PieceUtils.getNewNormalPiece(piece2col, row, PieceIds.GREEN);
        gameManager.grid.setPiece(piece1);
        gameManager.grid.setPiece(piece2);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, piece1.col, piece1.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, piece2.col, piece2.row);

        gameManager.swapSelectedPieces();

        assert.equal(piece2col, piece1.col);
        assert.equal(piece1col, piece2.col);
        assert.isTrue(gameManager.levelModel.toMove.indexOf(piece1) !== -1);
        assert.isTrue(gameManager.levelModel.toMove.indexOf(piece2) !== -1);
    });

    it("SwapSelectedPieces: Trying to swap two no Adjacent pieces", () => {
        const piece1col = 1;
        const piece2col = 2;
        const piece1row = 1;
        const piece2row = 3;
        const piece1: PieceData = PieceUtils.getNewNormalPiece(piece1col, piece1row, PieceIds.YELLOW);
        const piece2: PieceData = PieceUtils.getNewNormalPiece(piece2col, piece2row, PieceIds.GREEN);
        gameManager.grid.setPiece(piece1);
        gameManager.grid.setPiece(piece2);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, piece1.col, piece1.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, piece2.col, piece2.row);

        gameManager.swapSelectedPieces();

        assert.equal("", gameManager.swapModel.status);
    });

    /* CONTEXT: NEXTSTEP BEHAVIOR  */

    it("NextStep: Single Swap process", () => {
        const map: number[][] = [
            // -
            [1, 3, 3, 1, 2, 3, 1, 2], // [1 3            ]
            [3, 4, 5, 4, 3, 6, 2, 3], // [3              ]
            [3, 4, 1, 3, 1, 5, 3, 2], // [3              ]
            [1, 2, 3, 1, 2, 6, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const firstPosition: Tile = new Tile(0, 0);
        const secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.SWAP;

        const spySwapSelectedPieces = sinon.spy(gameManager, "swapSelectedPieces");
        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");

        gameManager.nextStep(gameManager);
        // After the movement of the sprites

        gameManager.levelModel.toMove.length = 0;
        gameManager.nextStep(gameManager);

        assert.isTrue(spySwapSelectedPieces.calledOnce, "spySwapSelectedPieces");
        assert.isTrue(spyAfterSwap.calledOnce, "spyAfterSwap");
    });

    it("AfterSwap (private): Swapping two pieces and removing the chains", () => {
        const map: number[][] = [
            // -
            [3, 1, 1, 1, 2, 3, 1, 2], // [3 1 1 1        ]
            [3, 4, 5, 4, 3, 6, 2, 3], // [3              ]
            [3, 4, 1, 3, 1, 5, 3, 2], // [3              ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [3              ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const firstPosition: Tile = new Tile(0, 0);
        const secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyRemoveAllChains = sinon.spy(gameManager, "removeAllChains");
        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyRemoveAllChains.called, "removeAllChains");
        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Swapping two pieces and removing a vertical chains", () => {
        const map: number[][] = [
            // -
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3], // [               ]
            [4, 5, 4, 3, 6, 2, 3, 4], // [               ]
            [4, 1, 3, 1, 5, 3, 2, 3], // [              3]
            [2, 3, 1, 2, 6, 1, 2, 3], // [              3]
            [2, 3, 1, 2, 4, 3, 1, 3] // [            1 3]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const firstPosition: Tile = new Tile(6, 7);
        const secondPosition: Tile = new Tile(7, 7);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyRemoveAllChains = sinon.spy(gameManager, "removeAllChains");
        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyRemoveAllChains.called, "removeAllChains");
        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Swapping two pieces and removing a horizontal chains", () => {
        const map: number[][] = [
            // -
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3], // [               ]
            [4, 5, 4, 3, 6, 2, 3, 4], // [               ]
            [4, 1, 3, 1, 5, 3, 2, 2], // [               ]
            [2, 3, 1, 2, 6, 1, 2, 3], // [              3]
            [2, 3, 1, 2, 4, 1, 1, 1] // [          1 1 1]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const firstPosition: Tile = new Tile(7, 67);
        const secondPosition: Tile = new Tile(7, 7);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyRemoveAllChains = sinon.spy(gameManager, "removeAllChains");
        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyRemoveAllChains.called, "removeAllChains");
        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Single swap without chains to simulate a RollBack", () => {
        const map: number[][] = [
            // -
            [3, 1, 3, 1, 2, 3, 1, 2], // [               ]
            [3, 4, 5, 4, 3, 6, 2, 3], // [               ]
            [1, 4, 1, 3, 1, 5, 3, 2], // [               ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const firstPosition: Tile = new Tile(0, 0);
        const secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spySwapSelectedPieces = sinon.spy(gameManager, "swapSelectedPieces");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "afterSwap");
        assert.isTrue(spySwapSelectedPieces.called, "swapSelectedPieces");
        assert.equal(PieceIds.BLUE, gameManager.grid.getPiece(firstPosition.col, firstPosition.row).pieceId);
        assert.equal(PieceIds.ORANGE, gameManager.grid.getPiece(secondPosition.col, secondPosition.row).pieceId);
    });

    it("AfterSwap (private): Swapping two rainbows to RemoveAllPieces", () => {
        const map: number[][] = [
            // -
            [1, 3, 3, 1, 2, 3, 1, 2], // [7 7            ]
            [2, 4, 5, 4, 3, 6, 2, 3], // [               ]
            [1, 4, 1, 3, 1, 5, 3, 2], // [               ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const pieceRainbow1 = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        const pieceRainbow2 = PieceUtils.getNewPowerUpPiece(1, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(pieceRainbow1);
        gameManager.grid.setPiece(pieceRainbow2);

        const firstPosition: Tile = new Tile(0, 0);
        const secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spyRemoveAllPieces = sinon.spy(gameManager, "removeAllPieces");
        const spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "afterSwap");
        assert.isTrue(spyRemoveAllPieces.called, "removeAllPieces");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Swapping two PowerUps to apply the both effects (removePiecesInList)", () => {
        const map: number[][] = [
            // -
            [1, 3, 3, 1, 2, 3, 1, 2], // [C1 R3            ]
            [2, 4, 5, 4, 3, 6, 2, 3], // [                 ]
            [1, 4, 1, 3, 1, 5, 3, 2], // [                 ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [                 ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [                 ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [                 ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [                 ]
            [2, 3, 1, 2, 3, 1, 2, 3] //   [                 ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const pieceCol = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.COL, PieceIds.BLUE);
        const pieceRow = PieceUtils.getNewPowerUpPiece(1, 0, PieceType.ROW, PieceIds.ORANGE);
        gameManager.grid.setPiece(pieceCol);
        gameManager.grid.setPiece(pieceRow);

        const firstPosition: Tile = new Tile(0, 0);
        const secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spyRemovePiecesInList = sinon.spy(gameManager, "removePiecesInList");
        const spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spyRemovePiecesInList.called, "removePiecesInList");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap: Swapping a piece and a RainbowPowerUp (First position) to remove all pieces that color (removePiecesInList)", () => {
        const map: number[][] = [
            // -
            [1, 3, 3, 1, 2, 3, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3] //
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const pieceRainbow = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(pieceRainbow);

        const firstPosition: Tile = new Tile(0, 0);
        const secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spyRemovePiecesInList = sinon.spy(gameManager, "removePiecesInList");
        const spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spyRemovePiecesInList.called, "removePiecesInList");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap: Swapping a piece and a RainbowPowerUp (Second position) to remove all pieces that color (removePiecesInList)", () => {
        const map: number[][] = [
            // -
            [1, 3, 3, 1, 2, 3, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3] //
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        const pieceRainbow = PieceUtils.getNewPowerUpPiece(1, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(pieceRainbow);

        const firstPosition: Tile = new Tile(0, 0);
        const secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        const spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        const spyRemovePiecesInList = sinon.spy(gameManager, "removePiecesInList");
        const spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spyRemovePiecesInList.called, "removePiecesInList");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("NexStep: GameOver Process", () => {
        const map: number[][] = [
            // -
            [1, 3, 3, 1, 2, 3, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3] //
        ];
        GridUtils.generateByMap(gameManager.grid, map);
        gameManager.gameStatus.gameOver();
        const spyGameOverCommand = sinon.spy(gameManager.gameService, "gameOverCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyGameOverCommand.called, "gameOverCommand");
    });

    it("NexStep: GameOver Process => Waiting to remove all chains", () => {
        const map: number[][] = [
            // -
            [1, 3, 3, 1, 1, 1, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3] //
        ];
        GridUtils.generateByMap(gameManager.grid, map);
        gameManager.gameStatus.gameOver();

        const spyGameOverCommand = sinon.spy(gameManager.gameService, "gameOverCommand");

        gameManager.nextStep(gameManager);

        assert.isFalse(spyGameOverCommand.called, "gameOverCommand");
    });
    it("NextStep: FillGrid", () => {
        let count = 0;
        while (GridUtils.hasEmptyPiece(gameManager.grid)) {
            count++;
            gameManager.nextStep();
            gameManager.levelModel.toAdd.length = 0;
            gameManager.levelModel.toRemove.length = 0;
            gameManager.levelModel.toMove.length = 0;
        }
        assert.isTrue(count >= gameManager.grid.maxRows);
    });

    it("NextStep: Filling the Grid after removing pieces", () => {
        const map: number[][] = [
            // -
            [4, 2, 3, 1, 2, 3, 1, 2], //
            [1, 4, 4, 4, 3, 4, 2, 3], //
            [1, 1, 1, 3, 1, 6, 3, 2], //
            [1, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 6, 2, 3], //
            [3, 1, 2, 1, 5, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3] //
        ]; // 5 Chains

        GridUtils.generateByMap(gameManager.grid, map);

        gameManager.grid.setPiece(new PieceData(0, 0, PieceType.EMPTY, PieceIds.EMPTY));
        gameManager.grid.setPiece(new PieceData(0, 1, PieceType.EMPTY, PieceIds.EMPTY));
        gameManager.grid.setPiece(new PieceData(0, 2, PieceType.EMPTY, PieceIds.EMPTY));

        let count = 0;
        while (GridUtils.hasEmptyPiece(gameManager.grid)) {
            count++;
            gameManager.nextStep();
            gameManager.levelModel.toAdd.length = 0;
            gameManager.levelModel.toRemove.length = 0;
            gameManager.levelModel.toMove.length = 0;
        }
        assert.equal(count, 3);
    });
});
