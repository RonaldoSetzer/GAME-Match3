package setzer.matchthree.mediators
{
	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.views.HomeView;

	import starling.events.Event;

	public class HomeViewMediator extends StarlingMediator
	{
		[Inject]
		public var view:HomeView;

		[Inject]
		public var flowService:FlowService;

		override public function initialize():void
		{
			eventMap.mapListener( view.optionsButton, Event.TRIGGERED, optionsButton_onTriggeredHandler );
			eventMap.mapListener( view.playButton, Event.TRIGGERED, playButton_onTriggeredHandler );
		}

		private function optionsButton_onTriggeredHandler( e:Event ):void
		{
			flowService.setOptionsView();
		}

		private function playButton_onTriggeredHandler( e:Event ):void
		{
			flowService.setLevelSelectView();
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
