import { GameEvent } from "./../../events/GameEvent";
import { TouchPhase } from "./../models/TouchPhase";
import { SwapModel } from "./../models/SwapModel";
import { GameManager } from "./../managers/GameManager";
import { injectable, inject, ICommand } from "robotlegs";

@injectable()
export class SwapPiecesCommand implements ICommand {

    @inject(SwapModel)
    public swapModel: SwapModel;

    @inject(GameManager)
    public gameManager: GameManager;

    @inject(GameEvent)
    public gameEvent: GameEvent;

    public execute(): void {
        this.swapModel.status = SwapModel.WAIT;
        this.swapModel.setPosition(this.gameEvent.extra.phase, this.gameEvent.extra.col, this.gameEvent.extra.row);

        if (this.gameEvent.extra.phase === TouchPhase.ENDED) {
            this.swapModel.status = SwapModel.SWAP;
            this.gameManager.nextStep();
        }
    }
}
