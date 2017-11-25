import { inject, injectable } from "@robotlegsjs/core";
import { Mediator } from "@robotlegsjs/pixi";

import { FlowService } from "./../services/FlowService";
import { OptionsView } from "./../views/OptionsView";

@injectable()
export class OptionsViewMediator extends Mediator<OptionsView> {
    @inject(FlowService) private flowService: FlowService;

    public initialize(): void {
        this.eventMap.mapListener(this.view.backButton, "click", this.backButton_onClick, this);
        this.eventMap.mapListener(this.view.deleteButton, "click", this.deleteButton_onClick, this);
    }
    public destroy(): void {
        this.eventMap.unmapListeners();
    }
    private backButton_onClick(e: any, thisObject: any): void {
        this.flowService.setHomeView();
    }
    private deleteButton_onClick(e: any): void {
        this.flowService.showAlertPopup();
    }
}
