import { injectable } from "@robotlegsjs/core";

import { PieceType } from "./../utils/PieceType";
import { PieceUtils } from "./../utils/PieceUtils";
import { LevelInfo } from "./LevelInfo";
import { PieceData } from "./PieceData";

@injectable()
export class LevelModel {
    public levelId: number;
    public levelInfo: LevelInfo;
    public score: number;

    public numStars: number;
    public numMoves: number;
    public clock: number;

    private _pieces: PieceData[];

    private _toAdd: PieceData[];
    private _toRemove: PieceData[];
    private _toMove: PieceData[];

    constructor() {
        this.reset();
    }
    public reset(): void {
        this.score = 0;
        this.numStars = 0;
        this.numMoves = 0;

        this._pieces = new Array<PieceData>();

        this._toAdd = new Array<PieceData>();
        this._toRemove = new Array<PieceData>();
        this._toMove = new Array<PieceData>();

        if (this.levelInfo) {
            this.numMoves = this.levelInfo.numMoves;
            this.clock = this.levelInfo.time;
        }
    }
    public updateScoreByPieceType(pieceType: string): void {
        const list: Map<string, number> = new Map<string, number>();
        list.set(PieceType.COL, 200);
        list.set(PieceType.ROW, 200);
        list.set(PieceType.RAINBOW, 300);

        const value = list.get(pieceType);
        if (value !== undefined) {
            this.score += this.score + value;
        } else {
            this.score += 100;
        }
    }
    public addPiece(piece: PieceData): void {
        this._pieces.push(piece);
        this._toAdd.push(piece);
    }
    public addToMoveList(piece: PieceData): void {
        if (this._toMove.indexOf(piece) !== -1) {
            return;
        }
        this._toMove.push(piece);
    }
    public addToRemoveList(piece: PieceData): void {
        if (this._toRemove.indexOf(piece) !== -1) {
            return;
        }
        this._toRemove.push(piece);
    }
    public removePiece(piece: PieceData): void {
        PieceUtils.removePieceFromListOfPieces(piece, this._pieces);
        PieceUtils.removePieceFromListOfPieces(piece, this._toAdd);
        PieceUtils.removePieceFromListOfPieces(piece, this._toMove);
        PieceUtils.removePieceFromListOfPieces(piece, this._toRemove);
    }
    public get toAdd(): PieceData[] {
        return this._toAdd;
    }
    public get toRemove(): PieceData[] {
        return this._toRemove;
    }
    public get toMove(): PieceData[] {
        return this._toMove;
    }
    public get pieces(): PieceData[] {
        return this._pieces;
    }
    public get maxCols(): number {
        return this.levelInfo.maxCols;
    }
    public get maxRows(): number {
        return this.levelInfo.maxRows;
    }
}
