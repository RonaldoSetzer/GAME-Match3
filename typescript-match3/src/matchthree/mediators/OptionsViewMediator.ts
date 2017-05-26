import { FlowService } from "./../services/FlowService";
import { OptionsView } from "./../views/OptionsView";

import { injectable, inject, EventDispatcher } from "robotlegs";
import { Mediator } from "robotlegs-pixi";

@injectable()
export class OptionsViewMediator extends Mediator<OptionsView> {

    @inject(FlowService)
    public flowService: FlowService;

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
