import { Sprite } from "pixi.js";

import { PieceType } from "./../utils/PieceType";
import { Tile } from "./Tile";

export class PieceData {
    public pieceId: number;
    public row: number;
    public col: number;
    public display: Sprite;

    private _pieceType: string;
    public get pieceType(): string {
        return this._pieceType;
    }

    constructor(col = 0, row = 0, pieceType: string = PieceType.EMPTY, pieceId = 0) {
        this._pieceType = pieceType;
        this.pieceId = pieceId;
        this.col = col;
        this.row = row;
    }
    public updateDisplayPosition(): void {
        if (this._pieceType === PieceType.EMPTY) {
            return;
        }
        this.display.x = Tile.TILE_WIDTH * this.col;
        this.display.y = this.row ? Tile.TILE_WIDTH * this.row : -Tile.TILE_HEIGHT;
    }
    public setPosition(col: number, row: number): void {
        this.col = col;
        this.row = row;
    }
    public toString(): string {
        return "piece_id_" + this.pieceId + "_type_" + this._pieceType + "_col_" + this.col + "_row_" + this.row;
    }
}
