import { AtlasKeys } from "./../../utils/AtlasKeys";
import { PieceUtils } from "./../utils/PieceUtils";
import { PieceDisplayPool } from "../utils/PieceDisplayPool";
import { Sprite, Texture } from "pixi.js";

export class PieceDisplay extends Sprite {

    private _assetId: string;

    public get assetId(): string {
        return this._assetId;
    }

    constructor(texture: Texture, pieceId: number, pieceType: string) {
        super(texture);

        this._assetId = PieceUtils.getAssetId(pieceId, pieceType);
        this.anchor.set(.5);
    }

    public destroyDisplay = (ob: any = this) => {
        PieceDisplayPool.back(ob);
        ob.parent.removeChild(ob);
    }
}
