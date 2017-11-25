import { injectable } from "@robotlegsjs/core";

import { Tile } from "./Tile";
import { TouchPhase } from "./TouchPhase";

@injectable()
export class SwapModel {
    public static SWAP = "swap";
    public static WAIT = "wait";
    public static ROLLBACK = "rollback";
    public static VALIDATE = "validate";
    public static HORIZONTAL = "horizontal";
    public static VERTICAL = "vertical";

    public status: string;

    private _first: Tile;
    private _second: Tile;
    private _maxCols: number;
    private _maxRows: number;

    constructor() {
        this._first = new Tile();
        this._second = new Tile();
    }
    public setMaxValues(maxCols: number, maxRows: number): void {
        this._maxCols = maxCols;
        this._maxRows = maxRows;
    }
    public setPosition(phase: string, col: number, row: number): void {
        let position: Tile;
        TouchPhase.BEGAN === phase ? (position = this.first) : (position = this._second);
        position.col = this.solveRanger(col, this._maxCols);
        position.row = this.solveRanger(row, this._maxRows);
    }
    public get swapDirection(): string {
        return this.first.col === this.second.col ? SwapModel.VERTICAL : SwapModel.HORIZONTAL;
    }
    public get first(): Tile {
        return this._first;
    }
    public get second(): Tile {
        return this._second;
    }
    public updateStatus(): void {
        this.status === SwapModel.SWAP ? (this.status = SwapModel.VALIDATE) : (this.status = "");
    }
    private solveRanger(value: number, max: number): number {
        return Math.max(Math.min(value, max - 1), 0);
    }
}
