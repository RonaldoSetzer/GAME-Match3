import { inject, injectable } from "@robotlegsjs/core";
import { Mediator } from "@robotlegsjs/pixi";

import { LevelModel } from "./../game/models/LevelModel";
import { FlowService } from "./../services/FlowService";
import { GameService } from "./../services/GameService";
import { YouWinPopup } from "./../views/YouWinPopup";

@injectable()
export class YouWinPopupMediator extends Mediator<YouWinPopup> {
    @inject(LevelModel) private levelModel: LevelModel;
    @inject(FlowService) private flowService: FlowService;
    @inject(GameService) private gameService: GameService;

    public initialize(): void {
        this.view.createStars(this.levelModel.numStars);
        this.view.updateValues(String(this.levelModel.score), String(this.levelModel.levelInfo.hiScore));

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
