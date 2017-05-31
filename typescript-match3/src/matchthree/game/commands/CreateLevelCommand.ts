import { GameEvent } from "./../../events/GameEvent";
import { GameManager } from "./../managers/GameManager";
import { LevelModel } from "./../models/LevelModel";
import { GameService } from "./../../services/GameService";
import { FlowService } from "./../../services/FlowService";
import { LevelsRepository } from "./../utils/LevelRepository";

import { injectable, inject, ICommand } from "robotlegs";

@injectable()
export class CreateLevelCommand implements ICommand {

    @inject(LevelModel)
    public levelModel: LevelModel;

    @inject(GameManager)
    public gameManager: GameManager;

    @inject(GameService)
    public gameService: GameService;

    @inject(FlowService)
    public flowService: FlowService;

    @inject(GameEvent)
    public gameEvent: GameEvent;

    @inject(LevelsRepository)
    public levelsRepository: LevelsRepository;

    public execute(): void {
        this.levelModel.levelId = this.gameEvent.extra.levelId;
        this.levelModel.levelInfo = this.levelsRepository.getLevelInfoById(this.levelModel.levelId);
        this.levelModel.reset();
        this.levelModel.numMoves = this.levelModel.levelInfo.numMoves;

        this.gameManager.generateGrid(this.levelModel.maxCols, this.levelModel.maxRows);

        this.gameService.updateHUDData();
        this.gameService.start();

        this.flowService.setGameView();
        this.flowService.showStartingPopup();
    }
}
