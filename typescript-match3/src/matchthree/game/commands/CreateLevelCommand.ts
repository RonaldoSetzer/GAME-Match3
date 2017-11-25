import { ICommand, inject, injectable } from "@robotlegsjs/core";

import { GameEvent } from "./../../events/GameEvent";
import { FlowService } from "./../../services/FlowService";
import { GameService } from "./../../services/GameService";
import { GameManager } from "./../managers/GameManager";
import { LevelModel } from "./../models/LevelModel";
import { LevelsRepository } from "./../utils/LevelRepository";

@injectable()
export class CreateLevelCommand implements ICommand {
    @inject(LevelModel) private levelModel: LevelModel;
    @inject(GameManager) private gameManager: GameManager;
    @inject(GameService) private gameService: GameService;
    @inject(FlowService) private flowService: FlowService;
    @inject(GameEvent) private gameEvent: GameEvent;
    @inject(LevelsRepository) private levelsRepository: LevelsRepository;

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
