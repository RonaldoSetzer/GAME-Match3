import sinon = require("sinon");
import { GameManager } from "./../../../../src/matchthree/game/managers/GameManager";
import { Tile } from "./../../../../src/matchthree/game/models/Tile";
import { LevelModel } from "./../../../../src/matchthree/game/models/LevelModel";
import { GameStatus } from "./../../../../src/matchthree/game/models/GameStatus";
import { PieceData } from "./../../../../src/matchthree/game/models/PieceData";
import { SwapModel } from "./../../../../src/matchthree/game/models/SwapModel";
import { TouchPhase } from "./../../../../src/matchthree/game/models/TouchPhase";
import { GridUtils } from "./../../../../src/matchthree/game/utils/GridUtils";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { PieceUtils } from "./../../../../src/matchthree/game/utils/PieceUtils";
import { GameService } from "./../../../../src/matchthree/services/GameService";
import { assert } from "chai";
import { EventDispatcher } from "robotlegs";

describe("GameManager", () => {

    let gameManager: GameManager;

    beforeEach(() => {
        let gameStatus: GameStatus = new GameStatus();

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
        let maxCols = 4;
        let maxRows = 6;
        gameManager.generateGrid(maxCols, maxRows);

        assert.isNotNull(gameManager.grid);
        assert.equal(maxCols, gameManager.grid.maxCols);
        assert.equal(maxRows, gameManager.grid.maxRows);
    });

    it("FillStep: Called once", () => {
        let row = 0;
        let firstRow: Array<PieceData> = GridUtils.getRow(gameManager.grid, row);

        gameManager.fillStep();

        let firstRowAfter: Array<PieceData> = GridUtils.getRow(gameManager.grid, row);

        let wasEmpty = true;
        let hasPieceAfterFillStep = true;

        for (let i = 0; i < gameManager.grid.maxCols; i++) {
            wasEmpty = (wasEmpty && firstRow[i].pieceType === PieceType.EMPTY);
            hasPieceAfterFillStep = (hasPieceAfterFillStep && firstRowAfter[i].pieceType !== PieceType.EMPTY);
        }

        assert.isTrue(wasEmpty);
        assert.isTrue(hasPieceAfterFillStep);
    });

    it("FillStep: Called twice", () => {
        let row = 0;
        gameManager.fillStep();

        let firstRowBefore: Array<PieceData> = GridUtils.getRow(gameManager.grid, row);

        gameManager.fillStep();

        let firstRowAfter: Array<PieceData> = GridUtils.getRow(gameManager.grid, row);
        let secondRowAfter: Array<PieceData> = GridUtils.getRow(gameManager.grid, row + 1);
        let firstRowWasDroppedToSecondRow = true;
        let firstRowAfterIsNotEmpty = true;

        for (let i = 0; i < gameManager.grid.maxCols; i++) {
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

        gameManager.createNewPiecesAbove();

        for (let col = 0; col < gameManager.grid.maxCols; col++) {
            piece = gameManager.grid.getPiece(col, topLine);
            isNotEmpty = (isNotEmpty && (piece.pieceType !== PieceType.EMPTY));

            if (piece.pieceType === PieceType.NORMAL) {
                hasPieceId = (hasPieceId && (piece.pieceId !== undefined));
                addedToLevelModel = (addedToLevelModel && (gameManager.levelModel.pieces.indexOf(piece) !== -1));
            }
        }

        assert.isTrue(isNotEmpty);
        assert.isTrue(hasPieceId);
        assert.isTrue(addedToLevelModel);
    });

    it("CreatePowerUp", () => {
        let powerUp: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.COL, PieceIds.YELLOW);
        gameManager.createPowerUp(powerUp);

        assert.equal(powerUp, gameManager.grid.getPiece(powerUp.col, powerUp.row));
        assert.isTrue(gameManager.levelModel.toAdd.indexOf(powerUp) !== -1);
        assert.isTrue(gameManager.levelModel.toMove.indexOf(powerUp) !== -1);
    });

    it("DropPieces", () => {
        let firstLine: Array<PieceData> = new Array<PieceData>();
        let piece: PieceData;
        let result = true;

        for (let col = 0; col < gameManager.grid.maxCols; col++) {
            piece = new PieceData(col, 0, PieceType.NORMAL, PieceIds.BLUE);
            firstLine.push(piece);
            gameManager.grid.setPiece(piece);
        }

        gameManager.dropPieces();

        let secondLine: Array<PieceData> = GridUtils.getRow(gameManager.grid, 1);

        for (let i = 0; i < firstLine.length; i++) {
            result = (result && (secondLine.indexOf(firstLine[i]) !== -1));
        }

        assert.isTrue(result);
    });

    /* CONTEXT: REMOVING PIECES*/

    it("RemovePiece", () => {
        let col = 3;
        let row = 2;
        let piece: PieceData = new PieceData(col, row, PieceType.NORMAL, PieceIds.BLUE);

        gameManager.grid.setPiece(piece);
        gameManager.removePiece(piece);

        assert.equal(gameManager.levelModel.toRemove.pop(), piece);
        assert.equal(PieceType.EMPTY, gameManager.grid.getPiece(col, row).pieceType);
    });

    it("RemovePiece: Remove a piece and increase Score", () => {
        let piece: PieceData = new PieceData(3, 2, PieceType.NORMAL, PieceIds.BLUE);

        gameManager.grid.setPiece(piece);
        gameManager.removePiece(piece);

        assert.isTrue(gameManager.levelModel.score > 0);
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
            gameManager.grid.setPiece(pieces[i]);
        }
        gameManager.removePiecesInList(pieces);

        let isEmpty = true;
        let isInToRemoveList = true;
        let piece: PieceData;

        for (let i = 0; i < pieces.length; i++) {
            piece = pieces[i];

            isInToRemoveList = (isInToRemoveList && (gameManager.levelModel.toRemove.indexOf(piece) !== -1));
            isEmpty = (isEmpty && (PieceType.EMPTY === gameManager.grid.getPiece(piece.col, piece.row).pieceType));
        }
        assert.isTrue(isInToRemoveList);
        assert.isTrue(isEmpty);
    });

    it("RemoveAllChains", () => {
        let map: number[][] = [// -
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

        let numAllChainsBefore: number = GridUtils.getAllChains(gameManager.grid).length;

        gameManager.removeAllChains();

        let numAllChainsAfter: number = GridUtils.getAllChains(gameManager.grid).length;

        assert.isTrue(numAllChainsBefore > 0);
        assert.isTrue(numAllChainsAfter === 0);
    });

    it("RemoveAllChains: Remove all chains in the list (params)", () => {
        let map: number[][] = [// -
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

        let numChains: number = GridUtils.getAllChains(gameManager.grid).length;

        assert.isTrue(numChains === 0);
        assert.isTrue(gameManager.levelModel.toAdd.length === 0);
    });

    it("RemoveAllChains: Remove all chains and applies the PowerUpRow effect", () => {
        let map: number[][] = [// -
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

        let row = 2;
        let powerUp: PieceData = PieceUtils.getNewPowerUpPiece(2, row, PieceType.ROW, PieceIds.BLUE);

        gameManager.grid.setPiece(powerUp);
        gameManager.removeAllChains();

        let rowWithPowerUpEffect: Array<PieceData> = GridUtils.getRow(gameManager.grid, row);
        let isAllPiecesEmpty = true;
        for (let i = 0; i < rowWithPowerUpEffect.length; i++) {
            isAllPiecesEmpty = (isAllPiecesEmpty && (rowWithPowerUpEffect[i].pieceType === PieceType.EMPTY));

        }
        assert.isTrue(isAllPiecesEmpty);
    });

    it("RemoveAllChains: Remove all chains and applies the PowerUpCol effect", () => {
        let map: number[][] = [// -
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

        let col = 0;
        let powerUp: PieceData = PieceUtils.getNewPowerUpPiece(col, 0, PieceType.COL, PieceIds.LIGHT_BLUE);

        gameManager.grid.setPiece(powerUp);
        gameManager.removeAllChains();

        let colWithPowerUpEffect: Array<PieceData> = GridUtils.getCol(gameManager.grid, col);
        let isAllPiecesEmpty = true;
        for (let i = 0; i < colWithPowerUpEffect.length; i++) {
            isAllPiecesEmpty = (isAllPiecesEmpty && (colWithPowerUpEffect[i].pieceType === PieceType.EMPTY));

        }
        assert.isTrue(isAllPiecesEmpty);
    });

    it("RemoveAllChains: Remove all chains and applies the PowerUpRainbow effect (Cross)", () => {
        let map: number[][] = [// -
            [6, 2, 3, 1, 2, 3, 1, 2], // [6              ]
            [6, 4, 4, 4, 3, 6, 2, 3], // [6 4 4 4   6    ]
            [6, 1, 1, 1, 2, 6, 3, 2], // [6 1 1 1   6    ]
            [1, 2, 3, 1, 2, 6, 1, 2], // [          6    ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 5, 5, 1, 2], // [      5 5 5    ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3]//   [               ]
        ];

        GridUtils.generateByMap(gameManager.grid, map);

        let col = 4;
        let row = 2;

        let powerUpRainbow: PieceData = PieceUtils.getNewPowerUpPiece(col, row, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(powerUpRainbow);

        let powerUpRow: PieceData = PieceUtils.getNewPowerUpPiece(col - 1, row, PieceType.ROW, PieceIds.BLUE);
        gameManager.grid.setPiece(powerUpRow);
        gameManager.removeAllChains();

        let isAllPiecesEmpty = true;
        let colAndRowWithPowerUpEffect: Array<PieceData> = GridUtils.getCol(gameManager.grid, col);
        colAndRowWithPowerUpEffect = colAndRowWithPowerUpEffect.concat(GridUtils.getRow(gameManager.grid, row));

        for (let i = 0; i < colAndRowWithPowerUpEffect.length; i++) {
            isAllPiecesEmpty = (isAllPiecesEmpty && (colAndRowWithPowerUpEffect[i].pieceType === PieceType.EMPTY));

        }
        assert.isTrue(isAllPiecesEmpty);
    });

    it("RemoveAllChains: Remove all chains and creates a new PowerUp", () => {
        let map: number[][] = [// -
            [6, 2, 3, 1, 2, 3, 1, 2], // [6              ]
            [6, 4, 4, 4, 3, 6, 2, 3], // [6 4 4 4        ]
            [6, 1, 1, 1, 1, 6, 3, 1], // [6 1 1 1 1      ]
            [6, 2, 3, 1, 2, 3, 1, 2], // [6              ]
            [2, 3, 6, 6, 6, 6, 6, 2], // [    6 6 6 6 6  ]
            [3, 1, 2, 5, 5, 2, 2, 1], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 1], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3]//   [               ]
        ];
        // PowerUps
        //    col:1 (Row or Col)
        //    row:2 (Row or Col)
        //    row:3 (Rainbow)

        GridUtils.generateByMap(gameManager.grid, map);
        gameManager.removeAllChains();

        let numPowerUps = 3;
        let allPowerUpsLength: number = GridUtils.getAllPowerUps(gameManager.grid).length;

        assert.equal(numPowerUps, allPowerUpsLength);
    });

    it("RemovePiecesInList: Remove all pieces in the list and applies the PowerUp effect", () => {
        let pieces: Array<PieceData> = GridUtils.spawnNewRow(gameManager.grid, 0);

        let powerUpRow: PieceData = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.ROW, PieceIds.BLUE);
        gameManager.grid.setPiece(powerUpRow);
        pieces[0] = powerUpRow;

        gameManager.removePiecesInList(pieces);

        let isEmpty = true;
        let isInToRemoveList = true;
        let piece: PieceData;

        for (let i = 0; i < pieces.length; i++) {
            piece = pieces[i];

            isInToRemoveList = (isInToRemoveList && (gameManager.levelModel.toRemove.indexOf(piece) !== -1));
            isEmpty = (isEmpty && PieceType.EMPTY === gameManager.grid.getPiece(piece.col, piece.row).pieceType);
        }
        assert.isTrue(isInToRemoveList);
        assert.isTrue(isEmpty);
    });

    it("RemoveAllPieces", () => {
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

        GridUtils.generateByMap(gameManager.grid, map);

        gameManager.removeAllPieces();

        let pieces: Array<PieceData> = GridUtils.getAllPieces(gameManager.grid);
        let isEmpty = true;
        let piece: PieceData;

        for (let i = 0; i < pieces.length; i++) {
            piece = pieces[i];

            isEmpty = (isEmpty && PieceType.EMPTY === gameManager.grid.getPiece(piece.col, piece.row).pieceType);
        }
        assert.equal(64, pieces.length);
        assert.equal(64, gameManager.levelModel.toRemove.length);
        assert.isTrue(isEmpty);
    });
    /*CONTEXT: SWAPING PIECES*/
    it("SwapSelectedPieces", () => {
        let piece1col = 1;
        let piece2col = 2;
        let row = 1;
        let piece1: PieceData = PieceUtils.getNewNormalPiece(piece1col, row, PieceIds.YELLOW);
        let piece2: PieceData = PieceUtils.getNewNormalPiece(piece2col, row, PieceIds.GREEN);
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
        let piece1col = 1;
        let piece2col = 2;
        let piece1row = 1;
        let piece2row = 3;
        let piece1: PieceData = PieceUtils.getNewNormalPiece(piece1col, piece1row, PieceIds.YELLOW);
        let piece2: PieceData = PieceUtils.getNewNormalPiece(piece2col, piece2row, PieceIds.GREEN);
        gameManager.grid.setPiece(piece1);
        gameManager.grid.setPiece(piece2);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, piece1.col, piece1.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, piece2.col, piece2.row);

        gameManager.swapSelectedPieces();

        assert.equal("", gameManager.swapModel.status);
    });

    /* CONTEXT: NEXTSTEP BEHAVIOR  */

    it("NextStep: Single Swap process", () => {
        let map: number[][] = [// -
            [1, 3, 3, 1, 2, 3, 1, 2], // [1 3            ]
            [3, 4, 5, 4, 3, 6, 2, 3], // [3              ]
            [3, 4, 1, 3, 1, 5, 3, 2], // [3              ]
            [1, 2, 3, 1, 2, 6, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3]//   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let firstPosition: Tile = new Tile(0, 0);
        let secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.SWAP;

        let spySwapSelectedPieces = sinon.spy(gameManager, "swapSelectedPieces");
        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");

        gameManager.nextStep(gameManager);
        // After the movement of the sprites

        gameManager.levelModel.toMove.length = 0;
        gameManager.nextStep(gameManager);


        assert.isTrue(spySwapSelectedPieces.called, "spySwapSelectedPieces");
        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
    });

    it("AfterSwap (private): Swapping two pieces and removing the chains", () => {
        let map: number[][] = [// -
            [3, 1, 1, 1, 2, 3, 1, 2], // [3 1 1 1        ]
            [3, 4, 5, 4, 3, 6, 2, 3], // [3              ]
            [3, 4, 1, 3, 1, 5, 3, 2], // [3              ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [3              ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3]//   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let firstPosition: Tile = new Tile(0, 0);
        let secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyRemoveAllChains = sinon.spy(gameManager, "removeAllChains");
        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyRemoveAllChains.called, "removeAllChains");
        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Swapping two pieces and removing a vertical chains", () => {
        let map: number[][] = [// -
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3], // [               ]
            [4, 5, 4, 3, 6, 2, 3, 4], // [               ]
            [4, 1, 3, 1, 5, 3, 2, 3], // [              3]
            [2, 3, 1, 2, 6, 1, 2, 3], // [              3]
            [2, 3, 1, 2, 4, 3, 1, 3], // [            1 3]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let firstPosition: Tile = new Tile(6, 7);
        let secondPosition: Tile = new Tile(7, 7);


        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyRemoveAllChains = sinon.spy(gameManager, "removeAllChains");
        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyRemoveAllChains.called, "removeAllChains");
        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Swapping two pieces and removing a horizontal chains", () => {
        let map: number[][] = [// -
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3], // [               ]
            [4, 5, 4, 3, 6, 2, 3, 4], // [               ]
            [4, 1, 3, 1, 5, 3, 2, 2], // [               ]
            [2, 3, 1, 2, 6, 1, 2, 3], // [              3]
            [2, 3, 1, 2, 4, 1, 1, 1], // [          1 1 1]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let firstPosition: Tile = new Tile(7, 67);
        let secondPosition: Tile = new Tile(7, 7);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyRemoveAllChains = sinon.spy(gameManager, "removeAllChains");
        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyRemoveAllChains.called, "removeAllChains");
        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Single swap without chains to simulate a RollBack", () => {
        let map: number[][] = [// -
            [3, 1, 3, 1, 2, 3, 1, 2], // [               ]
            [3, 4, 5, 4, 3, 6, 2, 3], // [               ]
            [1, 4, 1, 3, 1, 5, 3, 2], // [               ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3]//   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let firstPosition: Tile = new Tile(0, 0);
        let secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spySwapSelectedPieces = sinon.spy(gameManager, "swapSelectedPieces");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "afterSwap");
        assert.isTrue(spySwapSelectedPieces.called, "swapSelectedPieces");
        assert.equal(PieceIds.BLUE, gameManager.grid.getPiece(firstPosition.col, firstPosition.row).pieceId);
        assert.equal(PieceIds.ORANGE, gameManager.grid.getPiece(secondPosition.col, secondPosition.row).pieceId);
    });

    it("AfterSwap (private): Swapping two rainbows to RemoveAllPieces", () => {
        let map: number[][] = [// -
            [1, 3, 3, 1, 2, 3, 1, 2], // [7 7            ]
            [2, 4, 5, 4, 3, 6, 2, 3], // [               ]
            [1, 4, 1, 3, 1, 5, 3, 2], // [               ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [               ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [               ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [               ]
            [2, 3, 1, 2, 3, 1, 2, 3]//   [               ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let pieceRainbow1 = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        let pieceRainbow2 = PieceUtils.getNewPowerUpPiece(1, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(pieceRainbow1);
        gameManager.grid.setPiece(pieceRainbow2);

        let firstPosition: Tile = new Tile(0, 0);
        let secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spyRemoveAllPieces = sinon.spy(gameManager, "removeAllPieces");
        let spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "afterSwap");
        assert.isTrue(spyRemoveAllPieces.called, "removeAllPieces");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap (private): Swapping two PowerUps to apply the both effects (removePiecesInList)", () => {
        let map: number[][] = [// -
            [1, 3, 3, 1, 2, 3, 1, 2], // [C1 R3            ]
            [2, 4, 5, 4, 3, 6, 2, 3], // [                 ]
            [1, 4, 1, 3, 1, 5, 3, 2], // [                 ]
            [3, 2, 3, 1, 2, 6, 1, 2], // [                 ]
            [2, 3, 1, 2, 3, 4, 2, 3], // [                 ]
            [3, 1, 2, 5, 4, 5, 5, 2], // [                 ]
            [1, 2, 3, 1, 2, 3, 1, 2], // [                 ]
            [2, 3, 1, 2, 3, 1, 2, 3]//   [                 ]
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let pieceCol = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.COL, PieceIds.BLUE);
        let pieceRow = PieceUtils.getNewPowerUpPiece(1, 0, PieceType.ROW, PieceIds.ORANGE);
        gameManager.grid.setPiece(pieceCol);
        gameManager.grid.setPiece(pieceRow);

        let firstPosition: Tile = new Tile(0, 0);
        let secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spyRemovePiecesInList = sinon.spy(gameManager, "removePiecesInList");
        let spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spyRemovePiecesInList.called, "removePiecesInList");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap: Swapping a piece and a RainbowPowerUp (First position) to remove all pieces that color (removePiecesInList)", () => {
        let map: number[][] = [// -
            [1, 3, 3, 1, 2, 3, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3]//
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let pieceRainbow = PieceUtils.getNewPowerUpPiece(0, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(pieceRainbow);

        let firstPosition: Tile = new Tile(0, 0);
        let secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spyRemovePiecesInList = sinon.spy(gameManager, "removePiecesInList");
        let spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spyRemovePiecesInList.called, "removePiecesInList");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("AfterSwap: Swapping a piece and a RainbowPowerUp (Second position) to remove all pieces that color (removePiecesInList)", () => {
        let map: number[][] = [// -
            [1, 3, 3, 1, 2, 3, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3]//
        ];
        GridUtils.generateByMap(gameManager.grid, map);

        let pieceRainbow = PieceUtils.getNewPowerUpPiece(1, 0, PieceType.RAINBOW, PieceIds.RAINBOW);
        gameManager.grid.setPiece(pieceRainbow);

        let firstPosition: Tile = new Tile(0, 0);
        let secondPosition: Tile = new Tile(1, 0);

        gameManager.swapModel.setPosition(TouchPhase.BEGAN, firstPosition.col, firstPosition.row);
        gameManager.swapModel.setPosition(TouchPhase.ENDED, secondPosition.col, secondPosition.row);
        gameManager.swapModel.status = SwapModel.VALIDATE;

        let spyAfterSwap = sinon.spy(gameManager, "afterSwap");
        let spyRemovePiecesInList = sinon.spy(gameManager, "removePiecesInList");
        let spySwapPiecesConfirmCommand = sinon.spy(gameManager.gameService, "swapPiecesConfirmCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyAfterSwap.called, "spyAfterSwap");
        assert.isTrue(spyRemovePiecesInList.called, "removePiecesInList");
        assert.isTrue(spySwapPiecesConfirmCommand.called, "swapPiecesConfirmCommand");
    });

    it("NexStep: GameOver Process", () => {
        let map: number[][] = [// -
            [1, 3, 3, 1, 2, 3, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3]//
        ];
        GridUtils.generateByMap(gameManager.grid, map);
        gameManager.gameStatus.gameOver();
        let spyGameOverCommand = sinon.spy(gameManager.gameService, "gameOverCommand");

        gameManager.nextStep(gameManager);

        assert.isTrue(spyGameOverCommand.called, "gameOverCommand");
    });

    it("NexStep: GameOver Process => Waiting to remove all chains", () => {
        let map: number[][] = [// -
            [1, 3, 3, 1, 1, 1, 1, 2], //
            [2, 4, 5, 4, 3, 6, 2, 3], //
            [1, 4, 1, 3, 1, 5, 3, 2], //
            [3, 2, 3, 1, 2, 6, 1, 2], //
            [2, 3, 1, 2, 3, 4, 2, 3], //
            [3, 1, 2, 5, 4, 5, 5, 2], //
            [1, 2, 3, 1, 2, 3, 1, 2], //
            [2, 3, 1, 2, 3, 1, 2, 3]//
        ];
        GridUtils.generateByMap(gameManager.grid, map);
        gameManager.gameStatus.gameOver();

        let spyGameOverCommand = sinon.spy(gameManager.gameService, "gameOverCommand");

        gameManager.nextStep(gameManager);

        assert.isFalse(spyGameOverCommand.called, "gameOverCommand");
    }); it("NextStep: FillGrid", () => {
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
        let map: number[][] = [// -
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
