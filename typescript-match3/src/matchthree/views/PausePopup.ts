import { IconButton } from "./components/IconButton";

import { AtlasKeys } from "./../utils/AtlasKeys";
import { MagicValues } from "./../utils/MagicValues";
import { PixiFactory } from "./../utils/PixiFactory";
import { Texts } from "./../utils/Texts";
import { ViewPortSize } from "./../utils/ViewPortSize";

import { Container, Text } from "pixi.js";

export class PausePopup extends Container {

    private _levelSelectButton: IconButton;
    public get levelSelectButton(): IconButton {
        return this._levelSelectButton;
    }

    private _resumeButton: IconButton;
    public get resumeButton(): IconButton {
        return this._resumeButton;
    }

    private _retryButton: IconButton;
    public get retryButton(): IconButton {
        return this._retryButton;
    }

    constructor() {
        super();

        this.interactive = true;

        this.setupBackgrounds();
        this.setupButtons();
        this.setupText();
    }

    private setupBackgrounds(): void {
        this.addChild(PixiFactory.getShadowBackground(.9));
    }

    private setupButtons(): void {
        this._levelSelectButton = PixiFactory.getIconButton(AtlasKeys.ICON_LEVEL_SELECT);
        this._levelSelectButton.x = ViewPortSize.HALF_WIDTH + this._levelSelectButton.width * .5 + 4;
        this._levelSelectButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
        this.addChild(this._levelSelectButton);

        this._resumeButton = PixiFactory.getIconButton(AtlasKeys.ICON_RESUME);
        this._resumeButton.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_HUD - 30;
        this._resumeButton.y = MagicValues.BORDER_OFFSET_HUD + 20;
        this.addChild(this._resumeButton);

        this._retryButton = PixiFactory.getIconButton(AtlasKeys.ICON_RETRY);
        this._retryButton.x = ViewPortSize.HALF_WIDTH - this._retryButton.width * .5 - 4;
        this._retryButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
        this.addChild(this._retryButton);

    }

    private setupText(): void {
        this.addChild(PixiFactory.getTitle(Texts.PAUSED ));
    }
}
