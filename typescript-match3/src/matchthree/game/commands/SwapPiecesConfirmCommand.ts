import { ICommand, inject, injectable } from "@robotlegsjs/core";

import { GameService } from "./../../services/GameService";
import { GameStatus } from "./../models/GameStatus";
import { LevelInfo } from "./../models/LevelInfo";
import { LevelModel } from "./../models/LevelModel";

@injectable()
export class SwapPiecesConfirmCommand implements ICommand {
    @inject(LevelModel) private levelModel: LevelModel;
    @inject(GameStatus) private gameStatus: GameStatus;
    @inject(GameService) private gameService: GameService;

    public execute(): void {
        if (this.levelModel.levelInfo.levelType === LevelInfo.TIMER_TYPE) {
            return;
        }

        this.levelModel.numMoves -= 1;

        this.gameService.updateHUDData();

        if (this.levelModel.numMoves === 0) {
            this.gameStatus.gameOver();
        }
    }
}
