import { inject, injectable } from "@robotlegsjs/core";
import { Mediator } from "@robotlegsjs/pixi";

import { GameEvent } from "./../events/GameEvent";
import { GameStatus } from "./../game/models/GameStatus";
import { LevelInfo } from "./../game/models/LevelInfo";
import { LevelModel } from "./../game/models/LevelModel";
import { FlowService } from "./../services/FlowService";
import { GameService } from "./../services/GameService";
import { HUDGameComponent } from "./../views/components/HUDGameComponent";

@injectable()
export class HUDGameComponentMediator extends Mediator<HUDGameComponent> {
    @inject(LevelModel) private levelModel: LevelModel;
    @inject(GameStatus) private gameStatus: GameStatus;
    @inject(GameService) private gameService: GameService;
    @inject(FlowService) private flowService: FlowService;

    private _paused: boolean;

    public initialize(): void {
        this.eventMap.mapListener(this.view.pauseButton, "click", this.pauseButton_onTriggeredHandler, this);
        this.eventMap.mapListener(this.eventDispatcher, GameEvent.UPDATE_HUD_DATA, this.game_onUpdateHandler, this);

        this.setupHUDType();
    }
    public destroy(): void {
        this._paused = true;
        this.eventMap.unmapListeners();
    }
    private setupHUDType(): void {
        if (this.levelModel.levelInfo.levelType === LevelInfo.TIMER_TYPE) {
            this.view.setTimerType();
            this.eventMap.mapListener(this.eventDispatcher, GameEvent.RESUME, this.game_onResumeHandler, this);
        } else {
            this.view.setMoveType();
        }
    }
    private game_onResumeHandler(e: any): void {
        this._paused = false;
        this.tick();
    }
    private tick(): void {
        if (this._paused === true) {
            return;
        }
        this.levelModel.clock--;
        this.view.updateValues(this.levelModel);

        if (this.levelModel.levelInfo.levelType === LevelInfo.TIMER_TYPE && this.levelModel.clock === 0) {
            if (this.gameStatus.hasToWait) {
                this.gameService.gameOver();
            } else {
                this.gameService.gameOverCommand();
            }
            this._paused = true;
            return;
        }
        setTimeout(this.tick.bind(this), 1000);
    }
    private game_onUpdateHandler(e: any): void {
        this.view.updateValues(this.levelModel);
    }
    private pauseButton_onTriggeredHandler(e: any): void {
        this._paused = true;
        this.flowService.showPausePopup();
    }
}
