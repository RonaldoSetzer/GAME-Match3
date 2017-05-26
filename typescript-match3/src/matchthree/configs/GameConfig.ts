import { GameEvent } from "./../events/GameEvent";
import { CreateLevelCommand } from "./../game/commands/CreateLevelCommand";
import { GameOverCommand } from "./../game/commands/GameOverCommand";
import { RetryGameCommand } from "./../game/commands/RetryGameCommand";
import { SwapPiecesConfirmCommand } from "./../game/commands/SwapPiecesConfirmCommand";
import { SwapPiecesCommand } from "./../game/commands/SwapPiecesCommand";
import { GameManager } from "./../game/managers/GameManager";
import { GameStatus } from "./../game/models/GameStatus";
import { LevelModel } from "./../game/models/LevelModel";
import { SwapModel } from "./../game/models/SwapModel";
import { LevelsRepository } from "./../game/utils/LevelRepository";
import { PieceDisplayPool } from "./../game/utils/PieceDisplayPool";
import { GameService } from "./../services/GameService";

import { IConfig, injectable, inject, IEventCommandMap, IContext } from "robotlegs";

@injectable()
export class GameConfig implements IConfig {

    @inject(IContext)
    public context: IContext;

    @inject(IEventCommandMap)
    public commandMap: IEventCommandMap;

    public configure(): void {

        LevelsRepository.init();
        PieceDisplayPool.init();

        this.mapCommands();
        this.mapServices();
        this.mapManager();
        this.mapModels();
    }

    private mapCommands(): void {
        this.commandMap.map(GameEvent.CREATE_LEVEL_COMMAND).toCommand(CreateLevelCommand);
        this.commandMap.map(GameEvent.GAME_OVER_COMMAND).toCommand(GameOverCommand);
        this.commandMap.map(GameEvent.RETRY_GAME_COMMAND).toCommand(RetryGameCommand);

        this.commandMap.map(GameEvent.SWAP_PIECES_CONFIRM_COMMAND).toCommand(SwapPiecesConfirmCommand);
        this.commandMap.map(GameEvent.SWAP_PIECES_COMMAND).toCommand(SwapPiecesCommand);
    }

    private mapServices(): void {
        this.context.injector.bind(GameService).to(GameService).inSingletonScope();
    }

    private mapManager(): void {
        this.context.injector.bind(GameManager).to(GameManager).inSingletonScope();
    }

    private mapModels(): void {
        this.context.injector.bind(GameStatus).to(GameStatus).inSingletonScope();
        this.context.injector.bind(LevelModel).to(LevelModel).inSingletonScope();
        this.context.injector.bind(SwapModel).to(SwapModel).inSingletonScope();
    }
}
