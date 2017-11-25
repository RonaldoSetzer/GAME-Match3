import { Container } from "pixi.js";

import { AtlasKeys } from "./../utils/AtlasKeys";
import { MagicValues } from "./../utils/MagicValues";
import { PixiFactory } from "./../utils/PixiFactory";
import { Texts } from "./../utils/Texts";
import { ViewPortSize } from "./../utils/ViewPortSize";
import { IconButton } from "./components/IconButton";

export class YouWinPopup extends Container {
    private _retryButton: IconButton;
    private _levelSelectButton: IconButton;
    private _scoreText: any;
    private _hiScoreText: any;
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
    public createStars(numStars: number): void {
        for (let i = 0; i < numStars; i++) {
            const star = PixiFactory.getImage(AtlasKeys.POPUP_STAR);
            star.x = ViewPortSize.HALF_WIDTH - (i * 60 - (numStars - 1) * 60 * 0.5);
            star.y = 180;
            this.addChild(star);
        }
    }
    public updateValues(score: String, hiScore: String): void {
        this._scoreText.text = score;
        this._scoreText.pivot.x = this._scoreText.width;
        this._hiScoreText.text = "0";
    }
    private createBackground(): void {
        this.addChild(PixiFactory.getShadowBackground());
        this.addChild(PixiFactory.getBackgroundPopup());
    }
    private createText(): void {
        this.addChild(PixiFactory.getTitle(Texts.YOU_WIN));

        const scoreLabel = PixiFactory.getText(Texts.SCORE);
        scoreLabel.x = MagicValues.BORDER_OFFSET_POPUP;
        scoreLabel.y = 220;
        this.addChild(scoreLabel);

        const hiScoreLabel = PixiFactory.getText(Texts.HI_SCORE);
        hiScoreLabel.x = MagicValues.BORDER_OFFSET_POPUP;
        hiScoreLabel.y = 260;
        this.addChild(hiScoreLabel);

        this._scoreText = PixiFactory.getText("0");
        this._scoreText.pivot.x = this._scoreText.width;
        this._scoreText.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_POPUP;
        this._scoreText.y = 220;
        this.addChild(this._scoreText);

        this._hiScoreText = PixiFactory.getText("0");
        this._hiScoreText.pivot.x = this._hiScoreText.width;
        this._hiScoreText.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_POPUP;
        this._hiScoreText.y = 260;
        this.addChild(this._hiScoreText);
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
