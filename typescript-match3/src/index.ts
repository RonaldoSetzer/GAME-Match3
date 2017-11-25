// tslint:disable-next-line:no-reference
/// <reference path="../node_modules/@robotlegsjs/pixi/definitions/pixi.d.ts" />
import "reflect-metadata";

import { Context, MVCSBundle } from "@robotlegsjs/core";
import { ContextView, PixiBundle } from "@robotlegsjs/pixi";
import { PalidorPixiExtension } from "@robotlegsjs/pixi-palidor";
import PIXI = require("pixi.js");
import { Container } from "pixi.js";

import { GameConfig } from "./matchthree/configs/GameConfig";
import { PalidorConfig } from "./matchthree/configs/PalidorConfig";
import { ViewsConfig } from "./matchthree/configs/ViewsConfig";
import { AtlasKeys } from "./matchthree/utils/AtlasKeys";

class Main {
    private stage: PIXI.Container;
    private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
    private context: Context;

    constructor() {
        this.renderer = PIXI.autoDetectRenderer(340, 480, {});
        this.stage = new PIXI.Container();
        this.context = new Context();
        // this.context.logLevel = LogLevel.DEBUG;
        this.context
            .install(MVCSBundle, PixiBundle)
            .install(PalidorPixiExtension)
            .configure(new ContextView(this.stage))
            .configure(GameConfig, ViewsConfig, PalidorConfig)
            .initialize();

        const loader = PIXI.loader
            .add(AtlasKeys.ATLAS_PNG)
            .add(AtlasKeys.ATLAS_XML)
            .add(AtlasKeys.FONT_FNT)
            .add(AtlasKeys.BG_HUD_IMAGE)
            .add(AtlasKeys.BG_IMAGE)
            .add(AtlasKeys.BG_POPUP_IMAGE)
            .load(this.onLoad);

        document.body.appendChild(this.renderer.view);
    }
    public onLoad(): void {
        AtlasKeys.update(PIXI.utils.TextureCache);
    }
    public render = () => {
        this.renderer.render(this.stage);
        window.requestAnimationFrame(this.render);
    };
}
const main = new Main();
main.render();
