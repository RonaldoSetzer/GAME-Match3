import { Event } from "@robotlegsjs/core";

export class FlowEvent extends Event {
    public static SHOW_INTRO_VIEW = "showIntroView";
    public static SHOW_GAME_VIEW = "showGameView";
    public static SHOW_HOME_VIEW = "showHomeView";
    public static SHOW_LEVEL_SELECT_VIEW = "showLevelSelectView";
    public static SHOW_OPTIONS_VIEW = "showOptionsView";

    public static SHOW_ALERT_POPUP = "showAlertPopup";
    public static SHOW_GAME_OVER_POPUP = "showGameOverPopup";
    public static SHOW_PAUSE_POPUP = "showPausePopup";
    public static SHOW_STARTING_POPUP = "showStartingPopup";
    public static SHOW_YOU_WIN_POPUP = "showYouWinPopup";

    constructor(type: string) {
        super(type);
    }
}
