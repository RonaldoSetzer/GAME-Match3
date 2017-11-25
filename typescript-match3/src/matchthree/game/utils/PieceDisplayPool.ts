import { Sprite } from "pixi.js";

import { AtlasKeys } from "./../../utils/AtlasKeys";

export class PixiSpritePool {
    public static spriteList: Map<string, Sprite[]>;
    public static init(): void {
        this.spriteList = new Map<string, Sprite[]>();
    }
    public static getImage(assetId: string): Sprite {
        if (this.spriteList.get(assetId) === undefined) {
            this.spriteList.set(assetId, new Array<Sprite>());
        }

        const list: Sprite[] = this.spriteList.get(assetId);
        let piece: Sprite;
        if (list.length === 0) {
            const texture = AtlasKeys.getTexture(assetId);
            piece = new Sprite(texture);
            piece.anchor.set(0.5);
        } else {
            piece = list.shift();
        }
        piece.visible = true;
        piece.alpha = 1;
        piece.scale.set(1);

        return piece;
    }
    public static back(piece: Sprite): void {
        const assetId = (<any>piece.texture).textureCacheIds[0];
        const list: Sprite[] = this.spriteList.get(assetId);
        piece.visible = false;

        if (list.indexOf(piece) === -1) {
            list.push(piece);
        }
    }
}
