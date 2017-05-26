import { AlertPopupMediator } from "./../mediators/AlertPopupMediator";
import { GameOverPopupMediator } from "./../mediators/GameOverPopupMediator";
import { GameViewMediator } from "./../mediators/GameViewMediator";
import { GridFieldComponentMediator } from "./../mediators/GridFieldComponentMediator";
import { HUDGameComponentMediator } from "./../mediators/HUDGameComponentMediator";
import { HomeViewMediator } from "./../mediators/HomeViewMediator";
import { IntroViewMediator } from "./../mediators/IntroViewMediator";
import { LevelSelectViewMediator } from "./../mediators/LevelSelectViewMediator";
import { OptionsViewMediator } from "./../mediators/OptionsViewMediator";
import { PausePopupMediator } from "./../mediators/PausePopupMediator";
import { PixiContainerMediator } from "./../mediators/PixiContainerMediator";
import { StartingPopupMediator } from "./../mediators/StartingPopupMediator";
import { YouWinPopupMediator } from ".././mediators/YouWinPopupMediator";

import { AlertPopup } from "./../views/AlertPopup";
import { GameOverPopup } from "./../views/GameOverPopup";
import { GameView } from "./../views/GameView";
import { GridFieldComponent } from "./../views/components/GridFieldComponent";
import { HomeView } from "./../views/HomeView";
import { HUDGameComponent } from "./../views/components/HUDGameComponent";
import { IntroView } from "./../views/IntroView";
import { LevelSelectView } from "./../views/LevelSelectView";
import { OptionsView } from "./../views/OptionsView";
import { PausePopup } from "./../views/PausePopup";
import { StartingPopup } from "./../views/StartingPopup";
import { YouWinPopup } from "./../views/YouWinPopup";

import { PixiContainer } from "./../../robotlegs/bender/extensions/palidorFlowManager/impl/PixiContainer";
import { injectable, IConfig, inject } from "robotlegs";
import { IMediatorMap } from "robotlegs-pixi";

@injectable()
export class ViewsConfig implements IConfig {

    @inject(IMediatorMap)
    public mediatorMap: IMediatorMap;

    public configure(): void {
        this.mapMediators();
    }

    private mapMediators(): void {
        this.mediatorMap.map(IntroView).toMediator(IntroViewMediator);
        this.mediatorMap.map(GameView).toMediator(GameViewMediator);
        this.mediatorMap.map(HomeView).toMediator(HomeViewMediator);
        this.mediatorMap.map(OptionsView).toMediator(OptionsViewMediator);
        this.mediatorMap.map(LevelSelectView).toMediator(LevelSelectViewMediator);

        this.mediatorMap.map(GridFieldComponent).toMediator(GridFieldComponentMediator);
        this.mediatorMap.map(HUDGameComponent).toMediator(HUDGameComponentMediator);

        this.mediatorMap.map(PixiContainer).toMediator(PixiContainerMediator);

        this.mediatorMap.map(AlertPopup).toMediator(AlertPopupMediator);
        this.mediatorMap.map(GameOverPopup).toMediator(GameOverPopupMediator);
        this.mediatorMap.map(PausePopup).toMediator(PausePopupMediator);
        this.mediatorMap.map(StartingPopup).toMediator(StartingPopupMediator);
        this.mediatorMap.map(YouWinPopup).toMediator(YouWinPopupMediator);
    }
}
