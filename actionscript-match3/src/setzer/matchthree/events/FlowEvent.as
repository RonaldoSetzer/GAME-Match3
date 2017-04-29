package setzer.matchthree.events
{
	import starling.events.Event;

	public class FlowEvent extends Event
	{
		public static const SHOW_INTRO_VIEW:String = "showIntroView";
		public static const SHOW_HOME_VIEW:String = "showHomeView";
		public static const SHOW_GAME_VIEW:String = "showGameView";
		public static const SHOW_LEVEL_SELECT_VIEW:String = "showLevelSelectView";
		public static const SHOW_OPTIONS_VIEW:String = "showOptionsView";

		public static const SHOW_PAUSE_POPUP:String = "showPausePopup";
		public static const SHOW_ALERT_POPUP:String = "showAlertPopup";
		public static const SHOW_GAME_OVER_POPUP:String = "showGameOverPopup";
		public static const SHOW_STARTING_POPUP:String = "showStartingPopup";
		public static const SHOW_YOU_WIN_POPUP:String = "showYouWinPopup";

		public function FlowEvent( type:String, bubbles:Boolean = false, data:Object = null )
		{
			super( type, bubbles, data );
		}
	}
}
