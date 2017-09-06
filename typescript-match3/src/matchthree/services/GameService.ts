import { GameStatus } from "./../game/models/GameStatus";
import { GameEvent } from "./../events/GameEvent";

import { injectable, inject, IEventDispatcher, EventDispatcher } from "@robotlegsjs/core";

@injectable()
export class GameService {

    @inject(IEventDispatcher)
    private eventDispatcher: IEventDispatcher;

    @inject(GameStatus)
    private gameStatus: GameStatus;

    // Commands
    public createLevel(levelId: number): void {
        let event: GameEvent = new GameEvent(GameEvent.CREATE_LEVEL_COMMAND);
        event.extra = { levelId: levelId };
        this.eventDispatcher.dispatchEvent(event);
    }

    public retryCommand(): void {
        this.dispatchEventWith(GameEvent.RETRY_GAME_COMMAND);
    }

    public swapPiecesCommand(phase: String, col: number, row: number): void {
        let event: GameEvent = new GameEvent(GameEvent.SWAP_PIECES_COMMAND);
        event.extra = {
            col: col, //
            phase: phase, //
            row: row //
        };
        this.eventDispatcher.dispatchEvent(event);
    }

    public swapPiecesConfirmCommand(): void {
        this.dispatchEventWith(GameEvent.SWAP_PIECES_CONFIRM_COMMAND);
    }

    public gameOverCommand(): void {
        this.dispatchEventWith(GameEvent.GAME_OVER_COMMAND);
    }

    // Game
    public start(): void {
        this.gameStatus.start();
    }

    public pause(): void {
        this.gameStatus.pause();
        this.dispatchEventWith(GameEvent.PAUSE);
    }

    public resume(): void {
        this.gameStatus.resume();
        this.dispatchEventWith(GameEvent.RESUME);
    }

    public gameOver(): void {
        this.gameStatus.gameOver();
    }

    // UPDATE_GRID
    public updateHUDData(): void {
        this.dispatchEventWith(GameEvent.UPDATE_HUD_DATA);
    }

    public clearGridField(): void {
        this.dispatchEventWith(GameEvent.CLEAR_GRID);
    }

    public updateGridField(): void {
        this.dispatchEventWith(GameEvent.UPDATE_GRID);
    }


    public dispatchEventWith(type: string): void {
        (<EventDispatcher>this.eventDispatcher).dispatchEventWith(type);
    }
}
