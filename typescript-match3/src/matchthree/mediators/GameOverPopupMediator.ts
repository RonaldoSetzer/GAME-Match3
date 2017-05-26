import { GameService } from "./../services/GameService";
import { FlowService } from "./../services/FlowService";
import { GameOverPopup } from "./../views/GameOverPopup";

import { injectable, inject } from "robotlegs";
import { Mediator } from "robotlegs-pixi";

@injectable()
export class GameOverPopupMediator extends Mediator<GameOverPopup> {

    @inject(FlowService)
    public flowService: FlowService;

    @inject(GameService)
    public gameService: GameService;

    public initialize(): void {
        this.eventMap.mapListener(this.view.retryButton, "click", this.retryButton_onTriggeredHandler, this);
        this.eventMap.mapListener(this.view.levelSelectButton, "click", this.levelSelectButton_onTriggeredHandler, this);
    }

    public destroy(): void {
        this.eventMap.unmapListeners();
    }

    private retryButton_onTriggeredHandler(e: any): void {
        this.flowService.closePopup();
        this.gameService.retryCommand();
    }

    private levelSelectButton_onTriggeredHandler(e: any): void {
        this.flowService.closePopup();
        this.flowService.setLevelSelectView();
    }
}
