import { PieceUtils } from "../utils/PieceUtils";
import { PieceData } from "./PieceData";

export class GridData {
    private _grid: PieceData[][];
    private _maxCols: number;
    private _maxRows: number;
    public get maxRows(): number {
        return this._maxRows;
    }
    public get maxCols(): number {
        return this._maxCols;
    }

    constructor(cols = 8, rows = 8) {
        this._grid = new Array<PieceData[]>();
        this._maxCols = cols;
        this._maxRows = rows;
        this.generateEmptyGrid();
    }
    public getPiece(col: number, row: number): PieceData {
        if (col < this._maxCols && row < this._maxRows) {
            return this._grid[row][col];
        }
        return undefined;
    }
    public setPiece(piece: PieceData): void {
        this._grid[piece.row][piece.col] = piece;
    }
    private generateEmptyGrid(): void {
        let line: PieceData[];
        for (let row = 0; row < this._maxRows; row++) {
            line = new Array<PieceData>();
            for (let col = 0; col < this._maxCols; col++) {
                line.push(PieceUtils.getEmptyPiece(col, row));
            }
            this._grid.push(line);
        }
    }
}
