import { ScoreUtils } from "./../utils/ScoreUtils";
import { LevelModel } from "./../models/LevelModel";
import { GameService } from "./../../services/GameService";
import { FlowService } from "./../../services/FlowService";
import { LevelsRepository } from "./../utils/LevelRepository";

import { injectable, inject, ICommand } from "@robotlegsjs/core";

@injectable()
export class GameOverCommand implements ICommand {

    @inject(LevelModel)
    private levelModel: LevelModel;

    @inject(GameService)
    private gameService: GameService;

    @inject(FlowService)
    private flowService: FlowService;

    @inject(LevelsRepository)
    private levelsRepository: LevelsRepository;

    public execute(): void {
        this.gameService.pause();
        let hiScore = this.levelModel.levelInfo.hiScore;
        hiScore = Math.max(hiScore, this.levelModel.score);

        this.levelsRepository.updateHiScore(this.levelModel.levelId, hiScore);
        // SharedObjectManager.updateHighScore();

        let stars = ScoreUtils.getNumStars(this.levelModel.score, this.levelModel.levelInfo.scoreStarts);

        this.levelModel.numStars = stars;

        if (stars > 0) {
            this.flowService.showYouWinPopup();
        } else {
            this.flowService.showGameOverPopup();
        }
    }
}
