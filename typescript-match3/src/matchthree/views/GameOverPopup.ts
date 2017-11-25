import { Container } from "pixi.js";

import { AtlasKeys } from "./../utils/AtlasKeys";
import { MagicValues } from "./../utils/MagicValues";
import { PixiFactory } from "./../utils/PixiFactory";
import { Texts } from "./../utils/Texts";
import { ViewPortSize } from "./../utils/ViewPortSize";
import { IconButton } from "./components/IconButton";

export class GameOverPopup extends Container {
    private _levelSelectButton: IconButton;
    private _retryButton: IconButton;
    public get retryButton(): IconButton {
        return this._retryButton;
    }

    public get levelSelectButton(): IconButton {
        return this._levelSelectButton;
    }
    constructor() {
        super();

        this.createBackground();
        this.createText();
        this.createButtons();
    }
    private createBackground(): void {
        this.addChild(PixiFactory.getShadowBackground(0.9));
    }
    private createText(): void {
        this.addChild(PixiFactory.getTitle(Texts.GAME_OVER));
    }
    private createButtons(): void {
        this._retryButton = PixiFactory.getIconButton(AtlasKeys.ICON_RETRY);
        this._retryButton.x = ViewPortSize.HALF_WIDTH - this._retryButton.width * 0.5 - 4;
        this._retryButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
        this.addChild(this._retryButton);

        this._levelSelectButton = PixiFactory.getIconButton(AtlasKeys.ICON_LEVEL_SELECT);
        this._levelSelectButton.x = ViewPortSize.HALF_WIDTH + this._levelSelectButton.width * 0.5 + 4;
        this._levelSelectButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
        this.addChild(this._levelSelectButton);
    }
}
