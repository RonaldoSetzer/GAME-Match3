import { Container } from "pixi.js";

import { PixiFactory } from "./../utils/PixiFactory";
import { GridFieldComponent } from "./components/GridFieldComponent";
import { HUDGameComponent } from "./components/HUDGameComponent";

export class GameView extends Container {
    private _gridField: GridFieldComponent;
    private _hudComponent: HUDGameComponent;
    public get gridField(): GridFieldComponent {
        return this._gridField;
    }

    constructor() {
        super();
        this.createBackground();
    }
    public destroy(): void {
        this.removeChild(this._gridField);
        this.removeChild(this._hudComponent);

        this._gridField = null;
        this._hudComponent = null;
    }
    public createComponents(): void {
        this._hudComponent = new HUDGameComponent();
        this.addChild(this._hudComponent);

        this._gridField = new GridFieldComponent();
        this.addChild(this._gridField);
    }
    private createBackground(): void {
        this.addChild(PixiFactory.getBackground());
    }
}
