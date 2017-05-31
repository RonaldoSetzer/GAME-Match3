import { Sprite } from "pixi.js";
import { PieceUtils } from "./PieceUtils";
import { AtlasKeys } from "./../../utils/AtlasKeys";

export class PixiSpritePool {

    public static spriteList: Map<string, Array<Sprite>>;

    public static init(): void {
        this.spriteList = new Map<string, Array<Sprite>>();
    }

    public static getImage(assetId: string): Sprite {

        if (this.spriteList.get(assetId) === undefined) {
            this.spriteList.set(assetId, new Array<Sprite>());
        }

        let list: Array<Sprite> = this.spriteList.get(assetId);
        let piece: Sprite;
        if (list.length === 0) {
            let texture = AtlasKeys.getTexture(assetId);
            piece = new Sprite(texture);
            piece.anchor.set(.5);
        } else {
            piece = list.shift();
        }
        piece.visible = true;
        piece.alpha = 1;
        piece.scale.set(1);

        return piece;
    }

    public static back(piece: Sprite): void {
        let assetId = (<any>piece.texture).textureCacheIds[0];
        let list: Array<Sprite> = this.spriteList.get(assetId);
        piece.visible = false;

        if (list.indexOf(piece) === -1) {
            list.push(piece);
        }
    }
}
