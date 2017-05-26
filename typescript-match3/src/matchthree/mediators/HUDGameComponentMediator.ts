import { GameEvent } from "./../events/GameEvent";
import { GameStatus } from "./../game/models/GameStatus";
import { LevelInfo } from "./../game/models/LevelInfo";
import { LevelModel } from "./../game/models/LevelModel";
import { GameService } from "./../services/GameService";
import { FlowService } from "./../services/FlowService";
import { HUDGameComponent } from "./../views/components/HUDGameComponent";

import { injectable, inject } from "robotlegs";
import { Mediator } from "robotlegs-pixi";

@injectable()
export class HUDGameComponentMediator extends Mediator<HUDGameComponent> {

    @inject(LevelModel)
    public levelModel: LevelModel;

    @inject(GameStatus)
    public gameStatus: GameStatus;

    @inject(GameService)
    public gameService: GameService;

    @inject(FlowService)
    public flowService: FlowService;

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
        this.tick(this);
    }

    private tick(obThis: any = this): void {
        if (obThis._paused === true) {
            return;
        }
        obThis.levelModel.clock--;
        obThis.view.updateValues(obThis.levelModel);

        if (obThis.levelModel.levelInfo.levelType === LevelInfo.TIMER_TYPE && obThis.levelModel.clock === 0) {
            if (obThis.gameStatus.hasToWait) {
                obThis.gameService.gameOver();
            } else {
                obThis.gameService.gameOverCommand();
            }
            this._paused = true;
            return;
        }
        setTimeout(obThis.tick, 1000, obThis);
    }

    private game_onUpdateHandler(e: any): void {
        this.view.updateValues(this.levelModel);
    }

    private pauseButton_onTriggeredHandler(e: any): void {
        this._paused = true;
        this.flowService.showPausePopup();
    }

}
