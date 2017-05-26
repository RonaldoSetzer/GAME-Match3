import { LevelModel } from "./../game/models/LevelModel";
import { GameService } from "./../services/GameService";
import { FlowService } from "./../services/FlowService";
import { YouWinPopup } from "./../views/YouWinPopup";

import { injectable, inject } from "robotlegs";
import { Mediator } from "robotlegs-pixi";

@injectable()
export class YouWinPopupMediator extends Mediator<YouWinPopup> {

    @inject(LevelModel)
    public levelModel: LevelModel;

    @inject(FlowService)
    public flowService: FlowService;

    @inject(GameService)
    public gameService: GameService;

    public initialize(): void {
        this.view.createStars(this.levelModel.numStars);
        this.view.updateValues(String(this.levelModel.score), String(this.levelModel.levelInfo.hiScore));

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
