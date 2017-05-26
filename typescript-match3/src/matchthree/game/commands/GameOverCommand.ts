import { LevelModel } from "./../models/LevelModel";
import { GameService } from "./../../services/GameService";
import { FlowService } from "./../../services/FlowService";
import { LevelsRepository } from "./../utils/LevelRepository";

import { injectable, inject, ICommand } from "robotlegs";

@injectable()
export class GameOverCommand implements ICommand {

    @inject(LevelModel)
    public levelModel: LevelModel;

    @inject(GameService)
    public gameService: GameService;

    @inject(FlowService)
    public flowService: FlowService;

    public execute(): void {
        this.gameService.pause();
        let hiScore = this.levelModel.levelInfo.hiScore;
        hiScore = Math.max(hiScore, this.levelModel.score);

        LevelsRepository.updateHiScore(this.levelModel.levelId, hiScore);
        // SharedObjectManager.updateHighScore();

        let stars = 0;
        for (let i = 0; i < this.levelModel.levelInfo.scoreStarts.length; i++) {
            if (this.levelModel.score >= this.levelModel.levelInfo.scoreStarts[i]) {
                stars++;
            }
        }

        this.levelModel.numStars = stars;

        if (stars > 0) {
            this.flowService.showYouWinPopup();
        } else {
            this.flowService.showGameOverPopup();
        }
    }
}
