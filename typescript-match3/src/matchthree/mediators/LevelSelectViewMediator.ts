import { LevelInfo } from "./../game/models/LevelInfo";
import { LevelsRepository } from "./../game/utils/LevelRepository";
import { GameService } from "./../services/GameService";
import { FlowService } from "./../services/FlowService";
import { ViewPortSize } from "./../utils/ViewPortSize";
import { LevelSelectButton } from "./../views/components/LevelSelectButton";
import { LevelSelectView } from "./../views/LevelSelectView";

import { injectable, inject } from "robotlegs";
import { Mediator } from "robotlegs-pixi";

@injectable()
export class LevelSelectViewMediator extends Mediator<LevelSelectView> {

    @inject(FlowService)
    public flowService: FlowService;

    @inject(GameService)
    public gameService: GameService;

    private levelsIds: Map<LevelSelectButton, number>;

    public initialize(): void {
        // SharedObjectManager.getExternalData();

        this.createMapButtons();
        this.eventMap.mapListener(this.view.backButton, "click", this.backButton_onTriggeredHandler, this);
    }

    public destroy(): void {
        this.eventMap.unmapListeners();
    }

    private createMapButtons(): void {
        this.levelsIds = new Map<LevelSelectButton, number>();
        let levels: Array<LevelInfo> = LevelsRepository.getLevels();
        let levelInfo: LevelInfo;
        let levelButton: LevelSelectButton;

        for (let i = 0; i < levels.length; i++) {
            levelInfo = levels[i];
            levelButton = this.view.createLevelButton(String(levelInfo.levelId + 1));
            levelButton.x = ViewPortSize.HALF_WIDTH - (levelButton.width + 4) + (Math.floor(i % 3) * (levelButton.width + 4));
            levelButton.y = 180 + (Math.floor(i / 3) * (levelButton.height + 8));
            levelButton.setStars(levelInfo.getNumStars());
            levelButton.anchor.set(.5);
            this.levelsIds.set(levelButton, levels[i].levelId);
            this.eventMap.mapListener(levelButton, "click", this.levelButton_onTriggeredHandler, this);
        }
    }

    private backButton_onTriggeredHandler(e: any): void {
        this.flowService.setHomeView();
    }

    private levelButton_onTriggeredHandler(e: any): void {
        this.gameService.createLevel(this.levelsIds.get(e.currentTarget));
    }

}
