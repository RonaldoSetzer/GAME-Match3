import { Container } from "pixi.js";

import { AtlasKeys } from "./../utils/AtlasKeys";
import { MagicValues } from "./../utils/MagicValues";
import { PixiFactory } from "./../utils/PixiFactory";
import { Texts } from "./../utils/Texts";
import { ViewPortSize } from "./../utils/ViewPortSize";
import { IconButton } from "./components/IconButton";

export class OptionsView extends Container {
    private _deleteButton: IconButton;
    private _backButton: IconButton;
    public get deleteButton(): IconButton {
        return this._deleteButton;
    }
    public get backButton(): IconButton {
        return this._backButton;
    }

    constructor() {
        super();

        this.createBackgrounds();
        this.createTexts();
        this.createButtons();
    }
    private createBackgrounds(): void {
        this.addChild(PixiFactory.getBackground());
        this.addChild(PixiFactory.getBackgroundPopup());
    }
    private createTexts(): void {
        this.addChild(PixiFactory.getTitle(Texts.OPTIONS));

        const hiScore: Container = PixiFactory.getText(Texts.HI_SCORE);
        hiScore.x = MagicValues.BORDER_OFFSET_POPUP;
        hiScore.y = 180;
        this.addChild(hiScore);
    }
    private createButtons(): void {
        this._deleteButton = PixiFactory.getIconButton(AtlasKeys.ICON_DELETE, IconButton.TYPE_SMALL_DANGER);
        this._deleteButton.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_POPUP - 25;
        this._deleteButton.y = 200;
        this.addChild(this._deleteButton);

        this._backButton = PixiFactory.getIconButton(AtlasKeys.ICON_HOME, IconButton.TYPE_MEDIUM);
        this._backButton.x = ViewPortSize.HALF_WIDTH;
        this._backButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
        this.addChild(this._backButton);
    }
}
