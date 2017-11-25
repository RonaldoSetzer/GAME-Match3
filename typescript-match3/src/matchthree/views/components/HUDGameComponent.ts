import { Container } from "pixi.js";

import { LevelModel } from "./../../game/models/LevelModel";
import { AtlasKeys } from "./../../utils/AtlasKeys";
import { MagicValues } from "./../../utils/MagicValues";
import { PixiFactory } from "./../../utils/PixiFactory";
import { Texts } from "./../../utils/Texts";
import { ViewPortSize } from "./../../utils/ViewPortSize";
import { IconButton } from "./IconButton";
import { StarDisplayComponent } from "./StarDisplayComponent";

export class HUDGameComponent extends Container {
    private _pauseButton: IconButton;
    public get pauseButton(): IconButton {
        return this._pauseButton;
    }

    private _scoreText: any;
    private _movesText: any;
    private _timeText: any;
    private _movesLabel: any;
    private _timeLabel: any;

    private _starComponent: StarDisplayComponent;

    constructor() {
        super();

        this.createBackground();
        this.createTextFields();
        this.createButtons();
        this.createStarCompont();
    }
    public updateValues(model: LevelModel): void {
        this._scoreText.text = String(model.score);
        this._movesText.text = String(model.numMoves);
        this._timeText.text = MagicValues.convertTime(model.clock);
        this._timeText.pivot.x = this._timeText.width * 0.5;
        this._starComponent.update(model.score, model.levelInfo.scoreStarts);
    }
    public setTimerType(): void {
        this._movesLabel.visible = false;
        this._movesText.visible = false;
        this._timeLabel.visible = true;
        this._timeText.visible = true;
    }
    public setMoveType(): void {
        this._movesLabel.visible = true;
        this._movesText.visible = true;
        this._timeLabel.visible = false;
        this._timeText.visible = false;
    }
    private createBackground(): void {
        this.addChild(PixiFactory.getBackgroundHUD());
    }
    private createTextFields(): void {
        /* Static Texts */
        const scoreLabel = PixiFactory.getText(Texts.SCORE, MagicValues.SIZE_HUD);
        scoreLabel.x = MagicValues.BORDER_OFFSET_HUD;
        scoreLabel.y = MagicValues.BORDER_OFFSET_HUD - 5;
        this.addChild(scoreLabel);

        this._movesLabel = PixiFactory.getText(Texts.MOVES, MagicValues.SIZE_HUD);
        this._movesLabel.pivot.x = this._movesLabel.width * 0.5;
        this._movesLabel.x = ViewPortSize.HALF_WIDTH;
        this._movesLabel.y = MagicValues.BORDER_OFFSET_HUD - 5;
        this.addChild(this._movesLabel);

        this._timeLabel = PixiFactory.getText(Texts.TIME, MagicValues.SIZE_HUD);
        this._timeLabel.pivot.x = this._timeLabel.width * 0.5;
        this._timeLabel.x = ViewPortSize.HALF_WIDTH;
        this._timeLabel.y = MagicValues.BORDER_OFFSET_HUD - 5;
        this.addChild(this._timeLabel);

        // Dynamic Texts
        this._scoreText = PixiFactory.getText("0", MagicValues.SIZE_DEFAULT);
        this._scoreText.x = MagicValues.BORDER_OFFSET_HUD;
        this._scoreText.y = scoreLabel.y + 16;
        this.addChild(this._scoreText);

        this._movesText = PixiFactory.getText("0", MagicValues.SIZE_DEFAULT);
        this._movesText.pivot.x = this._movesText.width * 0.5;
        this._movesText.x = ViewPortSize.HALF_WIDTH;
        this._movesText.y = this._movesLabel.y + 16;
        this.addChild(this._movesText);

        this._timeText = PixiFactory.getText("0", MagicValues.SIZE_DEFAULT);
        this._timeText.pivot.x = this._timeText.width * 0.5;
        this._timeText.x = ViewPortSize.HALF_WIDTH;
        this._timeText.y = this._timeLabel.y + 16;
        this.addChild(this._timeText);
    }
    private createButtons(): void {
        this._pauseButton = PixiFactory.getIconButton(AtlasKeys.ICON_PAUSE);
        this._pauseButton.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_HUD - 30;
        this._pauseButton.y = MagicValues.BORDER_OFFSET_HUD + 20;
        this.addChild(this._pauseButton);
    }
    private createStarCompont(): void {
        this._starComponent = new StarDisplayComponent();
        this._starComponent.x = ViewPortSize.HALF_WIDTH;
        this._starComponent.y = MagicValues.BORDER_OFFSET_HUD + 60;
        this.addChild(this._starComponent);
    }
}
