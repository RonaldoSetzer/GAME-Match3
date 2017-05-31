
import { GameStatus } from "./../models/GameStatus";
import { LevelInfo } from "./../models/LevelInfo";
import { LevelModel } from "./../models/LevelModel";
import { GameService } from "./../../services/GameService";
import { injectable, inject, ICommand } from "robotlegs";

@injectable()
export class SwapPiecesConfirmCommand implements ICommand {

    @inject(LevelModel)
    public levelModel: LevelModel;

    @inject(GameStatus)
    public gameStatus: GameStatus;

    @inject(GameService)
    public gameService: GameService;

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
