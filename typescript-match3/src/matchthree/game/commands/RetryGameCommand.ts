import { GameManager } from "./../managers/GameManager";
import { LevelModel } from "./../models/LevelModel";
import { GameService } from "./../../services/GameService";
import { FlowService } from "./../../services/FlowService";

import { injectable, inject, ICommand } from "@robotlegsjs/core";

@injectable()
export class RetryGameCommand implements ICommand {

    @inject(LevelModel)
    private levelModel: LevelModel;

    @inject(GameManager)
    private gameManager: GameManager;

    @inject(GameService)
    private gameService: GameService;

    @inject(FlowService)
    private flowService: FlowService;

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
