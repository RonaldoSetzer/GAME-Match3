import { ICommand, inject, injectable } from "@robotlegsjs/core";

import { FlowService } from "./../../services/FlowService";
import { GameService } from "./../../services/GameService";
import { LevelModel } from "./../models/LevelModel";
import { LevelsRepository } from "./../utils/LevelRepository";
import { ScoreUtils } from "./../utils/ScoreUtils";

@injectable()
export class GameOverCommand implements ICommand {
    @inject(LevelModel) private levelModel: LevelModel;
    @inject(GameService) private gameService: GameService;
    @inject(FlowService) private flowService: FlowService;
    @inject(LevelsRepository) private levelsRepository: LevelsRepository;

    public execute(): void {
        this.gameService.pause();
        let hiScore = this.levelModel.levelInfo.hiScore;
        hiScore = Math.max(hiScore, this.levelModel.score);

        this.levelsRepository.updateHiScore(this.levelModel.levelId, hiScore);
        // SharedObjectManager.updateHighScore();

        const stars = ScoreUtils.getNumStars(this.levelModel.score, this.levelModel.levelInfo.scoreStarts);

        this.levelModel.numStars = stars;

        if (stars > 0) {
            this.flowService.showYouWinPopup();
        } else {
            this.flowService.showGameOverPopup();
        }
    }
}
