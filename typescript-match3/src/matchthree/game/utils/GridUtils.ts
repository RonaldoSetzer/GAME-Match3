import { GridData } from "./../models/GridData";
import { PieceData } from "./../models/PieceData";
import { PieceType } from "./PieceType";
import { PieceUtils } from "./PieceUtils";

export class GridUtils {
    public static generateByMap(grid: GridData, map: number[][]): void {
        for (let row = 0; row < grid.maxRows; row++) {
            for (let col = 0; col < grid.maxCols; col++) {
                grid.setPiece(PieceUtils.getNewNormalPiece(col, row, map[row][col]));
            }
        }
    }
    public static spawnNewRow(grid: GridData, row: number): PieceData[] {
        const pieces: PieceData[] = new Array<PieceData>();
        let piece: PieceData;

        for (let col = 0; col < grid.maxCols; col++) {
            piece = grid.getPiece(col, row);

            if (piece.pieceType !== PieceType.EMPTY) {
                continue;
            }

            piece = PieceUtils.getNewNormalPiece(col, row);
            pieces.push(piece);
            grid.setPiece(piece);
        }
        return pieces;
    }
    public static swapPieces(grid: GridData, piece1: PieceData, piece2: PieceData): void {
        const row1: number = piece1.row;
        const col1: number = piece1.col;

        piece1.row = piece2.row;
        piece1.col = piece2.col;

        piece2.row = row1;
        piece2.col = col1;

        grid.setPiece(piece1);
        grid.setPiece(piece2);
    }
    public static getCol(grid: GridData, col: number): PieceData[] {
        const result: PieceData[] = new Array<PieceData>();
        let piece: PieceData;

        for (let row = 0; row < grid.maxRows; row++) {
            piece = grid.getPiece(col, row);
            result.push(piece);
        }
        return result;
    }
    public static getRow(grid: GridData, row: number): PieceData[] {
        const result: PieceData[] = new Array<PieceData>();
        let piece: PieceData;

        for (let col = 0; col < grid.maxCols; col++) {
            piece = grid.getPiece(col, row);
            result.push(piece);
        }
        return result;
    }
    public static getAllPiecesById(grid: GridData, pieceId: number): PieceData[] {
        const result: PieceData[] = new Array<PieceData>();
        let piece: PieceData;
        for (let row = 0; row < grid.maxRows; row++) {
            for (let col = 0; col < grid.maxCols; col++) {
                piece = grid.getPiece(col, row);

                if (piece.pieceId === pieceId) {
                    result.push(piece);
                }
            }
        }
        return result;
    }
    public static hasEmptyPiece(grid: GridData): Boolean {
        let piece: PieceData;

        for (let row = 0; row < grid.maxRows; row++) {
            for (let col = 0; col < grid.maxCols; col++) {
                piece = grid.getPiece(col, row);
                if (piece.pieceType === PieceType.EMPTY) {
                    return true;
                }
            }
        }
        return false;
    }
    public static removePiece(grid: GridData, piece: PieceData): void {
        grid.setPiece(new PieceData(piece.col, piece.row));
    }
    public static getAllChains(grid: GridData): PieceData[][] {
        let result: PieceData[][] = new Array<PieceData[]>();
        let row: number;
        let col: number;

        for (row = 0; row < grid.maxRows; row++) {
            result = result.concat(GridUtils.getHorizontalChains(grid, row));
        }

        for (col = 0; col < grid.maxCols; col++) {
            result = result.concat(GridUtils.getVerticalChains(grid, col));
        }

        return result;
    }
    public static getHorizontalChains(grid: GridData, row: number): PieceData[][] {
        const result: PieceData[][] = new Array<PieceData[]>();
        let horizontal: PieceData[];
        let piece: PieceData;
        let pieceBefore: PieceData;
        let col: number;

        pieceBefore = grid.getPiece(0, row);
        horizontal = new Array<PieceData>();
        horizontal.push(pieceBefore);

        for (col = 1; col < grid.maxCols; col++) {
            piece = grid.getPiece(col, row);

            if (piece.pieceId === pieceBefore.pieceId && PieceType.EMPTY !== piece.pieceType) {
                horizontal.push(piece);
            } else {
                if (horizontal.length >= 3) {
                    result.push(horizontal);
                }
                horizontal = new Array<PieceData>();

                if (PieceType.EMPTY !== piece.pieceType) {
                    horizontal.push(piece);
                }
            }

            pieceBefore = piece;
        }
        if (horizontal.length >= 3) {
            result.push(horizontal);
        }
        return result;
    }
    public static getVerticalChains(grid: GridData, col: number): PieceData[][] {
        const result: PieceData[][] = new Array<PieceData[]>();
        let vertical: PieceData[];
        let piece: PieceData;
        let pieceBefore: PieceData;
        let row: number;

        pieceBefore = grid.getPiece(col, 0);

        vertical = new Array<PieceData>();
        vertical.push(pieceBefore);

        for (row = 1; row < grid.maxRows; row++) {
            piece = grid.getPiece(col, row);

            if (piece.pieceId === pieceBefore.pieceId && PieceType.EMPTY !== piece.pieceType) {
                vertical.push(piece);
            } else {
                if (vertical.length >= 3) {
                    result.push(vertical);
                }
                vertical = new Array<PieceData>();
                if (PieceType.EMPTY !== piece.pieceType) {
                    vertical.push(piece);
                }
            }

            pieceBefore = piece;
        }
        if (vertical.length >= 3) {
            result.push(vertical);
        }
        return result;
    }
    public static getChainWithPiece(grid: GridData, piece: PieceData): PieceData[] {
        let chains: PieceData[][] = new Array<PieceData[]>();
        chains = chains.concat(GridUtils.getVerticalChains(grid, piece.col));
        chains = chains.concat(GridUtils.getHorizontalChains(grid, piece.row));

        let result: PieceData[] = new Array<PieceData>();

        for (const chain of chains) {
            if (chain.indexOf(piece) !== -1) {
                result = result.concat(chain);
            }
        }

        return result;
    }
    public static getAllPieces(grid: GridData): PieceData[] {
        let result: PieceData[] = new Array<PieceData>();
        for (let row = 0; row < grid.maxRows; row++) {
            result = result.concat(GridUtils.getRow(grid, row));
        }
        return result;
    }
    public static getAllPowerUps(grid: GridData): PieceData[] {
        const pieces: PieceData[] = new Array<PieceData>();
        let piece: PieceData;
        const powerUpTypeIds: string[] = [PieceType.ROW, PieceType.COL, PieceType.RAINBOW];

        for (let row = 0; row < grid.maxRows; row++) {
            for (let col = 0; col < grid.maxCols; col++) {
                piece = grid.getPiece(col, row);
                if (powerUpTypeIds.indexOf(piece.pieceType) !== -1) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }
}
