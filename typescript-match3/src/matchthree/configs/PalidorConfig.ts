import { FlowEvent } from "./../events/FlowEvent";
import { FlowService } from "./../services/FlowService";
import { AlertPopup } from "./../views/AlertPopup";
import { GameOverPopup } from "./../views/GameOverPopup";
import { GameView } from "./../views/GameView";
import { HomeView } from "./../views/HomeView";
import { IntroView } from "./../views/IntroView";
import { OptionsView } from "./../views/OptionsView";
import { PausePopup } from "./../views/PausePopup";
import { StartingPopup } from "./../views/StartingPopup";
import { YouWinPopup } from "../views/YouWinPopup";
import { LevelSelectView } from "./../views/LevelSelectView";

import { IFlowManager } from "./../../robotlegs/bender/extensions/palidorFlowManager/api/IFlowManager";
import { PixiContainer } from "./../../robotlegs/bender/extensions/palidorFlowManager/impl/PixiContainer";
import { IFlowContainer } from "./../../robotlegs/bender/extensions/palidorFlowManager/api/IFlowContainer";

import { injectable, IConfig, inject, IContext } from "robotlegs";

@injectable()
export class PalidorConfig implements IConfig {

    @inject(IContext)
    public context: IContext;

    @inject(IFlowManager)
    public flowManager: IFlowManager;

    public configure(): void {
        this.mapPalidor();
    }

    private mapPalidor(): void {
        this.context.injector.bind(FlowService).to(FlowService).inSingletonScope();

        this.flowManager.map(FlowEvent.SHOW_GAME_VIEW).toView(GameView);
        this.flowManager.map(FlowEvent.SHOW_HOME_VIEW).toView(HomeView);
        this.flowManager.map(FlowEvent.SHOW_INTRO_VIEW).toView(IntroView);
        this.flowManager.map(FlowEvent.SHOW_LEVEL_SELECT_VIEW).toView(LevelSelectView);
        this.flowManager.map(FlowEvent.SHOW_OPTIONS_VIEW).toView(OptionsView);

        this.flowManager.map(FlowEvent.SHOW_ALERT_POPUP).toFloatingView(AlertPopup);
        this.flowManager.map(FlowEvent.SHOW_GAME_OVER_POPUP).toFloatingView(GameOverPopup);
        this.flowManager.map(FlowEvent.SHOW_PAUSE_POPUP).toFloatingView(PausePopup);
        this.flowManager.map(FlowEvent.SHOW_STARTING_POPUP).toFloatingView(StartingPopup);
        this.flowManager.map(FlowEvent.SHOW_YOU_WIN_POPUP).toFloatingView(YouWinPopup);

        this.flowManager.map(FlowEvent.CLOSE_POPUP).toRemoveLastFloatingView();
    }
}
