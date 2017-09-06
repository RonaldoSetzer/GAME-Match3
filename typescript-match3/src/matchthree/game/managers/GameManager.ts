import { GameStatus } from "./../models/GameStatus";
import { GridData } from "./../models/GridData";
import { LevelModel } from "./../models/LevelModel";
import { PieceData } from "./../models/PieceData";
import { SwapModel } from "./../models/SwapModel";
import { GameService } from "./../../services/GameService";
import { GridUtils } from "./../utils/GridUtils";
import { PieceType } from "./../utils/PieceType";
import { PieceUtils } from "./../utils/PieceUtils";
import { PowerUpUtils } from "./../utils/PowerUpUtils";

import { injectable, inject } from "@robotlegsjs/core";

@injectable()
export class GameManager {

    @inject(LevelModel)
    private levelModel: LevelModel;

    @inject(GameStatus)
    private gameStatus: GameStatus;

    @inject(GameService)
    private gameService: GameService;

    @inject(SwapModel)
    private swapModel: SwapModel;

    private _grid: GridData;

    public generateGrid(maxCols: number, maxRows: number): void {
        this._grid = new GridData(maxCols, maxRows);
        this.swapModel.setMaxValues(this._grid.maxCols, this._grid.maxRows);
    }

    public nextStep = (nthis: any = this) => {
        // SWAP
        if (nthis.swapModel.status === SwapModel.SWAP || nthis.swapModel.status === SwapModel.ROLLBACK) {
            nthis.swapModel.updateStatus();
            nthis.swapSelectedPieces();

            return;

        } else if (nthis.swapModel.status === SwapModel.VALIDATE) {
            nthis.swapModel.updateStatus();
            nthis.afterSwap();

            return;
        }

        // UDPATE VIEW - ADD - MOVE - REMOVE
        if (nthis.levelModel.toAdd.length || nthis.levelModel.toMove.length || nthis.levelModel.toRemove.length) {
            nthis.gameService.updateGridField();
            return;
        }

        // STAND BY MODE
        if (GridUtils.hasEmptyPiece(nthis.grid)) {
            nthis.fillStep();
        } else {
            nthis.gameStatus.hasToWait = nthis.removeAllChains();
            if (nthis.gameStatus.hasToWait === false && nthis.gameStatus.isGameOver) {
                nthis.gameService.gameOverCommand();
            }
        }
        nthis.gameService.updateGridField();
    }

    public removeAllPieces(): void {
        this.removePiecesInList(GridUtils.getAllPieces(this.grid));
        this.gameService.updateHUDData();
    }

    public removeAllChains(chains: Array<Array<PieceData>> = undefined): boolean {
        if (chains === undefined) {
            chains = GridUtils.getAllChains(this.grid);
        }
        let willRemoveSomething: boolean = (chains.length > 0);

        let rndIndex: number;
        let powerUp: PieceData;
        let toAdd: Array<PieceData> = new Array<PieceData>();

        for (let i = 0; i < chains.length; i++) {
            if (chains[i].length > 3) {
                rndIndex = Math.floor(Math.random() * chains[i].length);
                powerUp = PieceUtils.getNewPowerByChainLength(chains[i].length, chains[i][rndIndex]);
                toAdd.push(powerUp);
            }
            this.removePiecesInList(chains[i]);
        }
        while (toAdd.length > 0) {
            this.createPowerUp(toAdd.pop());
        }

        this.gameService.updateHUDData();

        return willRemoveSomething;
    }

    public removePiecesInList(piecesToRemove: Array<PieceData>): void {
        let piece: PieceData;
        while (piecesToRemove.length > 0) {
            piece = piecesToRemove.pop();

            piecesToRemove = piecesToRemove.concat(PowerUpUtils.getPiecesAffectedByPowerUp(piece, this.grid));

            if (piece.pieceType === PieceType.EMPTY) {
                continue;
            }

            this.removePiece(piece);
        }
    }

    public removePiece(piece: PieceData): void {
        this.levelModel.updateScoreByPieceType(piece.pieceType);
        this.levelModel.addToRemoveList(piece);
        GridUtils.removePiece(this._grid, piece);
    }

    public fillStep(): void {
        this.dropPieces();
        this.createNewPiecesAbove();
    }

    public dropPieces(): void {
        let piece: PieceData;
        let pieceBellow: PieceData;

        for (let row = this._grid.maxRows - 2; row >= 0; row--) {
            for (let col = 0; col < this._grid.maxCols; col++) {
                piece = this.grid.getPiece(col, row);
                pieceBellow = this.grid.getPiece(col, row + 1);

                if (pieceBellow.pieceType === PieceType.EMPTY && piece.pieceType !== PieceType.EMPTY) {
                    GridUtils.swapPieces(this.grid, piece, pieceBellow);
                    this.levelModel.addToMoveList(piece);
                }
            }
        }
    }

    public createNewPiecesAbove(): void {
        let topLine = 0;
        let pieces: Array<PieceData> = GridUtils.spawnNewRow(this.grid, topLine);

        for (let i = 0; i < pieces.length; i++) {
            this.levelModel.addPiece(pieces[i]);
            this.levelModel.addToMoveList(pieces[i]);
        }
    }

    public createPowerUp(powerUp: PieceData): void {
        this._grid.setPiece(powerUp);
        this.levelModel.addPiece(powerUp);
        this.levelModel.addToMoveList(powerUp);
    }

    public swapSelectedPieces(): void {
        let piece1: PieceData = this._grid.getPiece(this.swapModel.first.col, this.swapModel.first.row);
        let piece2: PieceData = this._grid.getPiece(this.swapModel.second.col, this.swapModel.second.row);

        if (!PieceUtils.IsAdjacent(piece1, piece2)) {
            this.swapModel.status = "";
            return;
        }

        GridUtils.swapPieces(this._grid, piece1, piece2);

        this.levelModel.addToMoveList(piece1);
        this.levelModel.addToMoveList(piece2);

        this.gameService.updateGridField();
    }

    public get grid(): GridData {
        return this._grid;
    }

    private afterSwap(): void {
        let needToRollback = false;

        let piece1: PieceData = this.grid.getPiece(this.swapModel.first.col, this.swapModel.first.row);
        let piece2: PieceData = this.grid.getPiece(this.swapModel.second.col, this.swapModel.second.row);

        if (piece1.pieceType === PieceType.RAINBOW && piece2.pieceType === PieceType.RAINBOW) {
            this.removeAllPieces();

        } else if (piece1.pieceType === PieceType.RAINBOW || piece2.pieceType === PieceType.RAINBOW) {
            let pieceId: number = (piece1.pieceType === PieceType.RAINBOW) ? piece2.pieceId : piece1.pieceId;
            piece1.pieceId = pieceId;
            piece2.pieceId = pieceId;
            this.removePiecesInList([piece1, piece2]);

        } else if ((piece1.pieceType === PieceType.COL || piece1.pieceType === PieceType.ROW) //
            && (piece2.pieceType === PieceType.COL || piece2.pieceType === PieceType.ROW)) {
            this.removePiecesInList([piece1, piece2]);

        } else {
            let chain1: Array<PieceData> = GridUtils.getChainWithPiece(this.grid, piece1);
            let chain2: Array<PieceData> = GridUtils.getChainWithPiece(this.grid, piece2);
            let hasChain: boolean = ((chain2.length > 0) || (chain1.length > 0));

            if (hasChain) {
                this.removeAllChains([chain1, chain2]); //
            } else {
                needToRollback = true;
            }
        }
        if (needToRollback) {
            this.swapModel.status = SwapModel.ROLLBACK; //
        } else {
            this.gameService.swapPiecesConfirmCommand();
        }

        this.nextStep();
    }
}
