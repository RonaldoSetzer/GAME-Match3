import { IConfig, inject, injectable } from "@robotlegsjs/core";
import { IMediatorMap } from "@robotlegsjs/pixi";

import { YouWinPopupMediator } from ".././mediators/YouWinPopupMediator";
import { AlertPopupMediator } from "./../mediators/AlertPopupMediator";
import { GameOverPopupMediator } from "./../mediators/GameOverPopupMediator";
import { GameViewMediator } from "./../mediators/GameViewMediator";
import { GridFieldComponentMediator } from "./../mediators/GridFieldComponentMediator";
import { HomeViewMediator } from "./../mediators/HomeViewMediator";
import { HUDGameComponentMediator } from "./../mediators/HUDGameComponentMediator";
import { IntroViewMediator } from "./../mediators/IntroViewMediator";
import { LevelSelectViewMediator } from "./../mediators/LevelSelectViewMediator";
import { OptionsViewMediator } from "./../mediators/OptionsViewMediator";
import { PausePopupMediator } from "./../mediators/PausePopupMediator";
import { StartingPopupMediator } from "./../mediators/StartingPopupMediator";
import { AlertPopup } from "./../views/AlertPopup";
import { GridFieldComponent } from "./../views/components/GridFieldComponent";
import { HUDGameComponent } from "./../views/components/HUDGameComponent";
import { GameOverPopup } from "./../views/GameOverPopup";
import { GameView } from "./../views/GameView";
import { HomeView } from "./../views/HomeView";
import { IntroView } from "./../views/IntroView";
import { LevelSelectView } from "./../views/LevelSelectView";
import { OptionsView } from "./../views/OptionsView";
import { PausePopup } from "./../views/PausePopup";
import { StartingPopup } from "./../views/StartingPopup";
import { YouWinPopup } from "./../views/YouWinPopup";

@injectable()
export class ViewsConfig implements IConfig {
    @inject(IMediatorMap) private mediatorMap: IMediatorMap;

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

        this.mediatorMap.map(AlertPopup).toMediator(AlertPopupMediator);
        this.mediatorMap.map(GameOverPopup).toMediator(GameOverPopupMediator);
        this.mediatorMap.map(PausePopup).toMediator(PausePopupMediator);
        this.mediatorMap.map(StartingPopup).toMediator(StartingPopupMediator);
        this.mediatorMap.map(YouWinPopup).toMediator(YouWinPopupMediator);
    }
}
