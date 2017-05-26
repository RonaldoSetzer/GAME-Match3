import { GameManager } from "./../managers/GameManager";
import { LevelModel } from "./../models/LevelModel";
import { GameService } from "./../../services/GameService";
import { FlowService } from "./../../services/FlowService";

import { injectable, inject, ICommand } from "robotlegs";

@injectable()
export class RetryGameCommand implements ICommand {

    @inject(LevelModel)
    public levelModel: LevelModel;

    @inject(GameManager)
    public gameManager: GameManager;

    @inject(GameService)
    public gameService: GameService;

    @inject(FlowService)
    public flowService: FlowService;

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
