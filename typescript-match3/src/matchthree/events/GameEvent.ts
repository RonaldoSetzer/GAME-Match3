import { Event } from "@robotlegsjs/core";

export class GameEvent extends Event {
    public static CREATE_LEVEL_COMMAND = "createLevelCommand";
    public static GAME_OVER_COMMAND = "gameOverCommand";
    public static RETRY_GAME_COMMAND = "retryGameCommand";
    public static SWAP_PIECES_COMMAND = "swapPiecesCommand";
    public static SWAP_PIECES_CONFIRM_COMMAND = "piecesSwappedCommand";

    public static RESUME = "resume";
    public static PAUSE = "pause";

    public static UPDATE_HUD_DATA = "updateData";

    public static CLEAR_GRID = "clearGridField";
    public static UPDATE_GRID = "update";

    public extra: any;

    constructor(type: string) {
        super(type);
    }
}
