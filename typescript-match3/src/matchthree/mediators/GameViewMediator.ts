import { GameView } from "./../views/GameView";

import { injectable, inject } from "robotlegs";
import { Mediator } from "robotlegs-pixi";

@injectable()
export class GameViewMediator extends Mediator<GameView> {

    public initialize(): void {
        this.view.createComponents();
    }

    public destroy(): void {
        this.view.destroy();
    }
}
