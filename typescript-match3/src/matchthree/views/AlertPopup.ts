import { Container } from "pixi.js";

import { AtlasKeys } from "./../utils/AtlasKeys";
import { MagicValues } from "./../utils/MagicValues";
import { PixiFactory } from "./../utils/PixiFactory";
import { Texts } from "./../utils/Texts";
import { ViewPortSize } from "./../utils/ViewPortSize";
import { IconButton } from "./components/IconButton";

export class AlertPopup extends Container {
    private _cancelButton: IconButton;
    private _confirmButton: IconButton;

    public get confirmButton(): IconButton {
        return this._confirmButton;
    }
    public get cancelButton(): IconButton {
        return this._cancelButton;
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
        this.addChild(PixiFactory.getTitle(Texts.ALERT));

        const alert: Container = PixiFactory.getText(Texts.CONFIRM_DELETE);
        alert.x = ViewPortSize.HALF_WIDTH;
        alert.y = ViewPortSize.HALF_HEIGHT;
        alert.pivot.x = alert.width * 0.5;
        alert.pivot.y = alert.height * 0.5;
        this.addChild(alert);
    }
    private createButtons(): void {
        this._confirmButton = PixiFactory.getIconButton(AtlasKeys.ICON_CONFIRM);
        this._confirmButton.x = ViewPortSize.HALF_WIDTH - this._confirmButton.width * 0.5 - 4;
        this._confirmButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
        this.addChild(this._confirmButton);

        this._cancelButton = PixiFactory.getIconButton(AtlasKeys.ICON_CLOSE);
        this._cancelButton.x = ViewPortSize.HALF_WIDTH + this._cancelButton.width * 0.5 + 4;
        this._cancelButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
        this.addChild(this._cancelButton);
    }
}
