import { EventDispatcher, IEventDispatcher, inject, injectable } from "@robotlegsjs/core";
import { PalidorEvent } from "@robotlegsjs/pixi-palidor/lib";

import { FlowEvent } from "./../events/FlowEvent";

@injectable()
export class FlowService {
    @inject(IEventDispatcher) private eventDispatcher: IEventDispatcher;

    // Views
    public setHomeView(): void {
        this.dispatchEventWith(FlowEvent.SHOW_HOME_VIEW);
    }
    public setGameView(): void {
        this.dispatchEventWith(FlowEvent.SHOW_GAME_VIEW);
    }
    public setLevelSelectView(): void {
        this.dispatchEventWith(FlowEvent.SHOW_LEVEL_SELECT_VIEW);
    }
    public setOptionsView(): void {
        this.dispatchEventWith(FlowEvent.SHOW_OPTIONS_VIEW);
    }
    // Floating Views
    public showAlertPopup(): void {
        this.dispatchEventWith(FlowEvent.SHOW_ALERT_POPUP);
    }
    public showPausePopup(): void {
        this.dispatchEventWith(FlowEvent.SHOW_PAUSE_POPUP);
    }
    public showStartingPopup(): void {
        this.dispatchEventWith(FlowEvent.SHOW_STARTING_POPUP);
    }
    public showGameOverPopup(): void {
        this.dispatchEventWith(FlowEvent.SHOW_GAME_OVER_POPUP);
    }
    public showYouWinPopup(): void {
        this.dispatchEventWith(FlowEvent.SHOW_YOU_WIN_POPUP);
    }
    // extras
    public closePopup(): void {
        this.dispatchEventWith(PalidorEvent.REMOVE_LAST_FLOATING_VIEW_ADDED);
    }
    public dispatchEventWith(type: string): void {
        (<EventDispatcher>this.eventDispatcher).dispatchEventWith(type);
    }
}
