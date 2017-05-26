/// <reference path="../node_modules/robotlegs-pixi/definitions/pixi.d.ts" />

import "reflect-metadata";
import PIXI = require("pixi.js");

import { GameConfig } from "./matchthree/configs/GameConfig";
import { PalidorConfig } from "./matchthree/configs/PalidorConfig";
import { ViewsConfig } from "./matchthree/configs/ViewsConfig";
import { PalidorFlowManagerExtension } from "./robotlegs/bender/extensions/palidorFlowManager/PalidorFlowManagerExtension";
import { PixiContainer } from "./robotlegs/bender/extensions/palidorFlowManager/impl/PixiContainer";

import { Container } from "pixi.js";
import { Context, MVCSBundle, LogLevel } from "robotlegs";
import { PixiBundle, ContextView } from "robotlegs-pixi";

class Main {
    private stage: PIXI.Container;
    private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
    private context: Context;

    constructor() {
        this.renderer = PIXI.autoDetectRenderer(340, 480, {});
        this.stage = new PIXI.Container();
        this.context = new Context();
        // this.context.logLevel = LogLevel.DEBUG;
        this.context.install(MVCSBundle, PixiBundle)
            .configure(new ContextView((<any>this.renderer).plugins.interaction))
            .configure(ViewsConfig, GameConfig, PalidorConfig)
            .install(PalidorFlowManagerExtension)
            .initialize();

        this.stage.addChild(new PixiContainer());

        document.body.appendChild(this.renderer.view);
    }

    public render = () => {
        this.renderer.render(this.stage);
        window.requestAnimationFrame(this.render);
    }
}

let main = new Main();
main.render();
