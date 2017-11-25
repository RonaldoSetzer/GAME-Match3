import { Sprite, Texture } from "pixi.js";

import { AtlasKeys } from "./../../utils/AtlasKeys";

export class IconButton extends Sprite {
    public static TYPE_SMALL = "button_small";
    public static TYPE_MEDIUM = "button_medium";
    public static TYPE_SMALL_DANGER = "button_small_danger";

    private _downState: Texture;
    private _overState: Texture;
    private _upState: Texture;

    private _isDown: boolean;
    private _isOver: boolean;

    private _ico: Sprite;

    constructor(shapeType: String = IconButton.TYPE_SMALL) {
        super(AtlasKeys.getTexture(shapeType + "_up.png"));

        const downStateTexture: Texture = AtlasKeys.getTexture(shapeType + "_down.png");
        const upStateTexture: Texture = AtlasKeys.getTexture(shapeType + "_up.png");

        this._downState = downStateTexture;
        this._overState = downStateTexture;
        this._upState = upStateTexture;

        this.setInitialValues();
        this.setupInteractions();
    }
    public setIco(name: string): void {
        if (this._ico) {
            this.removeChild(this._ico);
        }

        this._ico = new Sprite(AtlasKeys.getTexture(name));
        this._ico.anchor.set(0.5);
        this.addChild(this._ico);
    }
    private setInitialValues(): void {
        this.anchor.set(0.5);
        this.interactive = true;
        this.buttonMode = true;
    }
    private setupInteractions(): void {
        this.on("pointerup", this.onButtonUp);
        this.on("pointerupoutside", this.onButtonUp);
        this.on("pointerdown", this.onButtonDown);
        this.on("pointerover", this.onButtonOver);
        this.on("pointerout", this.onButtonOut);
    }
    private onButtonDown(): void {
        this._isDown = true;
        this.texture = this._downState;
        this.scale.set(0.95, 0.95);
    }
    private onButtonOut(): void {
        this._isOver = false;
        this.texture = this._upState;
        this.scale.set(1, 1);
    }
    private onButtonOver(): void {
        this._isOver = true;
        this.texture = this._overState;
    }
    private onButtonUp(): void {
        this._isDown = false;
        this.scale.set(1, 1);

        this.texture = this._isOver ? this._overState : this._upState;
    }
}
