package setzer.matchthree.services
{
	import setzer.matchthree.events.FlowEvent;

	import starling.events.EventDispatcher;

	public class FlowService
	{
		[Inject]
		public var eventDispatcher:EventDispatcher;

		//Views
		public function setHomeView():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_HOME_VIEW );
		}

		public function setGameView():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_GAME_VIEW );
		}

		public function setLevelSelectView():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_LEVEL_SELECT_VIEW );
		}

		public function setOptionsView():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_OPTIONS_VIEW );
		}

		//Floating Views
		public function showAlertPopup():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_ALERT_POPUP );
		}

		public function showPausePopup():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_PAUSE_POPUP );
		}

		public function showStartingPopup():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_STARTING_POPUP );
		}

		public function showGameOverPopup():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_GAME_OVER_POPUP );
		}

		public function showYouWinPopup():void
		{
			eventDispatcher.dispatchEventWith( FlowEvent.SHOW_YOU_WIN_POPUP );
		}
	}
}
