package setzer.matchthree.mediators
{
	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.services.GameService;
	import setzer.matchthree.views.GameOverPopup;

	import starling.events.Event;

	public class GameOverPopupMediator extends StarlingMediator
	{
		[Inject]
		public var view:GameOverPopup;

		[Inject]
		public var flowService:FlowService;

		[Inject]
		public var gameService:GameService;

		override public function initialize():void
		{
			eventMap.mapListener( view.retryButton, Event.TRIGGERED, retryButton_onTriggeredHandler );
			eventMap.mapListener( view.levelSelectButton, Event.TRIGGERED, levelSelectButton_onTriggeredHandler );
		}

		private function retryButton_onTriggeredHandler( e:Event ):void
		{
			gameService.retryCommand();
			view.removeFromParent();
		}

		private function levelSelectButton_onTriggeredHandler( e:Event ):void
		{
			flowService.setLevelSelectView();
			view.removeFromParent();
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
