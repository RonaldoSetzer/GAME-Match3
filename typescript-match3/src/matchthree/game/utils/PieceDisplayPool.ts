import { PieceUtils } from "./PieceUtils";
import { PieceDisplay } from "./../displays/PieceDisplay";
import { AtlasKeys } from "./../../utils/AtlasKeys";

export class PieceDisplayPool {

    public static pieceLists: Map<string, Array<PieceDisplay>>;

    public static init(): void {
        this.pieceLists = new Map<string, Array<PieceDisplay>>();
    }

    public static getPieceDisplay(pieceId: number, pieceType: string): PieceDisplay {
        let assetId: string = PieceUtils.getAssetId(pieceId, pieceType);

        if (this.pieceLists.get(assetId) === undefined) {
            this.pieceLists.set(assetId, new Array<PieceDisplay>());
        }

        let list: Array<PieceDisplay> = this.pieceLists.get(assetId);
        let piece: PieceDisplay;
        if (list.length === 0) {
            let texture = AtlasKeys.getPieceTexture(pieceId, pieceType);
            piece = new PieceDisplay(texture, pieceId, pieceType);
        } else {
            piece = list.shift();
        }
        piece.visible = true;
        piece.alpha = 1;
        piece.scale.set(1);

        return piece;
    }

    public static back(piece: PieceDisplay): void {
        let list: Array<PieceDisplay> = this.pieceLists.get(piece.assetId);
        piece.visible = false;

        if (list.indexOf(piece) === -1) {
            list.push(piece);
        }
    }
}
