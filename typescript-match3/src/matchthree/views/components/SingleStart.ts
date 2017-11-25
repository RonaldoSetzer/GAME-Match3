import { Sprite, Texture } from "pixi.js";

import { AtlasKeys } from "./../../utils/AtlasKeys";

export class SingleStar extends Sprite {
    private textures: Texture[];
    public get numFrames(): number {
        return this.textures.length;
    }

    constructor() {
        super(AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "00.png"));
        this.textures = [
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "00.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "01.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "02.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "03.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "04.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "05.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "06.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "07.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "08.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "09.png"),
            AtlasKeys.getTexture(AtlasKeys.STAR_HUD_DISPLAY + "10.png")
        ];
    }
    public currentFrame(value: number): void {
        this.texture = this.textures[value];
    }
}
