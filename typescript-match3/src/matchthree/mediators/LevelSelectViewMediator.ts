import { inject, injectable } from "@robotlegsjs/core";
import { Mediator } from "@robotlegsjs/pixi";

import { LevelInfo } from "./../game/models/LevelInfo";
import { LevelsRepository } from "./../game/utils/LevelRepository";
import { ScoreUtils } from "./../game/utils/ScoreUtils";
import { FlowService } from "./../services/FlowService";
import { GameService } from "./../services/GameService";
import { ViewPortSize } from "./../utils/ViewPortSize";
import { LevelSelectButton } from "./../views/components/LevelSelectButton";
import { LevelSelectView } from "./../views/LevelSelectView";

@injectable()
export class LevelSelectViewMediator extends Mediator<LevelSelectView> {
    @inject(FlowService) private flowService: FlowService;
    @inject(GameService) private gameService: GameService;
    @inject(LevelsRepository) private levelsRepository: LevelsRepository;

    private levelsIds: Map<LevelSelectButton, number>;

    public initialize(): void {
        this.createMapButtons();
        this.eventMap.mapListener(this.view.backButton, "click", this.backButton_onTriggeredHandler, this);
    }
    public destroy(): void {
        this.eventMap.unmapListeners();
    }
    private createMapButtons(): void {
        this.levelsIds = new Map<LevelSelectButton, number>();
        const levels: LevelInfo[] = this.levelsRepository.getLevels();
        let levelInfo: LevelInfo;
        let levelButton: LevelSelectButton;

        for (let i = 0; i < levels.length; i++) {
            levelInfo = levels[i];
            levelButton = this.view.createLevelButton(String(levelInfo.levelId + 1));
            levelButton.x =
                ViewPortSize.HALF_WIDTH - (levelButton.width + 4) + Math.floor(i % 3) * (levelButton.width + 4);
            levelButton.y = 180 + Math.floor(i / 3) * (levelButton.height + 8);
            levelButton.setStars(ScoreUtils.getNumStars(levelInfo.hiScore, levelInfo.scoreStarts));
            levelButton.anchor.set(0.5);
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
