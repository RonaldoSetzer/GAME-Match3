package setzer.matchthree.mediators
{
	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.services.GameService;
	import setzer.matchthree.views.PausePopup;

	import starling.events.Event;

	public class PausePopupMediator extends StarlingMediator
	{
		[Inject]
		public var view:PausePopup;

		[Inject]
		public var gameService:GameService;

		[Inject]
		public var flowService:FlowService;

		override public function initialize():void
		{
			eventMap.mapListener( view.resumeButton, Event.TRIGGERED, resumeButton_onTriggeredHandler );
			eventMap.mapListener( view.levelSelectButton, Event.TRIGGERED, levelSelectButton_onTriggeredHandler );
			eventMap.mapListener( view.retryButton, Event.TRIGGERED, replayButton_onTriggeredHandler );
		}

		private function resumeButton_onTriggeredHandler( e:Event ):void
		{
			flowService.showStartingPopup();
			view.removeFromParent();
		}

		private function levelSelectButton_onTriggeredHandler( e:Event ):void
		{
			flowService.setLevelSelectView();
			view.removeFromParent();
		}

		private function replayButton_onTriggeredHandler( e:Event ):void
		{
			gameService.retryCommand();
			view.removeFromParent();
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
