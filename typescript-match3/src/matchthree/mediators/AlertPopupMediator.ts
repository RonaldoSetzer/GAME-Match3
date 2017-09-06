import { AlertPopup } from "./../views/AlertPopup";

import { inject, injectable } from "@robotlegsjs/core";
import { Mediator } from "@robotlegsjs/pixi";

@injectable()
export class AlertPopupMediator extends Mediator<AlertPopup> {

    public initialize(): void {
        this.eventMap.mapListener(this.view.confirmButton, "click", this.confirmButton_onTriggeredHandler, this);
        this.eventMap.mapListener(this.view.cancelButton, "click", this.cancelButton_onTriggeredHandler, this);
    }

    public destroy(): void {
        this.eventMap.unmapListeners();
    }
    private confirmButton_onTriggeredHandler(e: any): void {
        // SharedObjectManager.clear();
        this.view.parent.removeChild(this.view);
    }

    private cancelButton_onTriggeredHandler(e: any): void {
        this.view.parent.removeChild(this.view);
    }
}
