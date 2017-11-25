import { GridData } from "./../models/GridData";
import { PieceData } from "./../models/PieceData";
import { GridUtils } from "./GridUtils";
import { PieceIds } from "./PieceIds";
import { PieceType } from "./PieceType";

export class PowerUpUtils {
    public static getPiecesAffectedByPowerUp(piece: PieceData, grid: GridData): PieceData[] {
        let piecesToRemove: PieceData[] = new Array<PieceData>();
        if (piece.pieceType === PieceType.ROW) {
            piecesToRemove = piecesToRemove.concat(GridUtils.getRow(grid, piece.row));
        } else if (piece.pieceType === PieceType.COL) {
            piecesToRemove = piecesToRemove.concat(GridUtils.getCol(grid, piece.col));
        } else if (piece.pieceType === PieceType.RAINBOW && piece.pieceId === PieceIds.RAINBOW) {
            piecesToRemove = piecesToRemove.concat(GridUtils.getRow(grid, piece.row));
            piecesToRemove = piecesToRemove.concat(GridUtils.getCol(grid, piece.col));
        } else if (piece.pieceType === PieceType.RAINBOW && PieceIds.ALL_NORMAL_IDS.indexOf(piece.pieceId) !== -1) {
            piecesToRemove = piecesToRemove.concat(GridUtils.getAllPiecesById(grid, piece.pieceId));
        }

        return piecesToRemove;
    }
}
