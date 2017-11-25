import { inject, injectable } from "@robotlegsjs/core";
import { Mediator } from "@robotlegsjs/pixi";

import { FlowService } from "./../services/FlowService";
import { GameService } from "./../services/GameService";
import { GameOverPopup } from "./../views/GameOverPopup";

@injectable()
export class GameOverPopupMediator extends Mediator<GameOverPopup> {
    @inject(FlowService) private flowService: FlowService;
    @inject(GameService) private gameService: GameService;

    public initialize(): void {
        this.eventMap.mapListener(this.view.retryButton, "click", this.retryButton_onTriggeredHandler, this);
        this.eventMap.mapListener(
            this.view.levelSelectButton,
            "click",
            this.levelSelectButton_onTriggeredHandler,
            this
        );
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
