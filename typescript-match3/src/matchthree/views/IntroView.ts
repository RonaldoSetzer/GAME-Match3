import { Container, Sprite, Text } from "pixi.js";

import { AtlasKeys } from "./../utils/AtlasKeys";
import { PixiFactory } from "./../utils/PixiFactory";
import { Texts } from "./../utils/Texts";
import { ViewPortSize } from "./../utils/ViewPortSize";

export class IntroView extends Container {
    constructor() {
        super();

        this.setupBackground();
        this.setupImages();
        this.setupText();
    }
    private setupBackground(): void {
        this.addChild(PixiFactory.getColorBackground(0x204d63));
    }
    private setupImages(): void {
        const logo: Sprite = PIXI.Sprite.fromImage(AtlasKeys.LOGO_TYPESCRIPT);
        logo.anchor.x = 0.5;
        logo.x = ViewPortSize.HALF_WIDTH;
        logo.y = ViewPortSize.MAX_HEIGHT - 64;
        this.addChild(logo);
    }
    private setupText(): void {
        const style = new PIXI.TextStyle({
            align: "center",
            fill: 0xb5d6e6,
            fontFamily: "Arial",
            fontSize: 28,
            fontWeight: "bold"
        });
        const title: Text = new PIXI.Text(Texts.DEVELOPER, style);
        title.anchor.set(0.5);
        title.x = ViewPortSize.HALF_WIDTH;
        title.y = ViewPortSize.HALF_HEIGHT;
        this.addChild(title);
    }
}
