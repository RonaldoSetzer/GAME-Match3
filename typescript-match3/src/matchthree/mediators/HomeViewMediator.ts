import { inject, injectable } from "@robotlegsjs/core";
import { Mediator } from "@robotlegsjs/pixi";

import { FlowService } from "./../services/FlowService";
import { HomeView } from "./../views/HomeView";

@injectable()
export class HomeViewMediator extends Mediator<HomeView> {
    @inject(FlowService) private flowService: FlowService;

    public initialize(): void {
        this.eventMap.mapListener(this.view.playButton, "click", this.playButton_onClick, this);
        this.eventMap.mapListener(this.view.optionsButton, "click", this.optionsButton_onClick, this);
    }
    public destroy(): void {
        this.eventMap.unmapListeners();
    }
    private playButton_onClick(e: any): void {
        this.flowService.setLevelSelectView();
    }
    private optionsButton_onClick(e: any): void {
        this.flowService.setOptionsView();
    }
}
