import { ICommand, inject, injectable } from "@robotlegsjs/core";

import { FlowService } from "./../../services/FlowService";
import { GameService } from "./../../services/GameService";
import { GameManager } from "./../managers/GameManager";
import { LevelModel } from "./../models/LevelModel";

@injectable()
export class RetryGameCommand implements ICommand {
    @inject(LevelModel) private levelModel: LevelModel;
    @inject(GameManager) private gameManager: GameManager;
    @inject(GameService) private gameService: GameService;
    @inject(FlowService) private flowService: FlowService;

    public execute(): void {
        this.gameService.clearGridField();

        this.levelModel.reset();

        this.gameService.updateHUDData();
        this.gameService.start();
        this.flowService.showStartingPopup();

        this.gameManager.generateGrid(this.levelModel.maxCols, this.levelModel.maxRows);
        this.gameManager.nextStep();
    }
}
