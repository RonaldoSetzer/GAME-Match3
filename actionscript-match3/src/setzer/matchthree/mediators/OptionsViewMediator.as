package setzer.matchthree.mediators
{
	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.views.OptionsView;

	import starling.events.Event;

	public class OptionsViewMediator extends StarlingMediator
	{
		[Inject]
		public var view:OptionsView;

		[Inject]
		public var flowService:FlowService;

		override public function initialize():void
		{
			eventMap.mapListener( view.backButton, Event.TRIGGERED, closeButton_onTriggeredHandler )
			eventMap.mapListener( view.deleteButton, Event.TRIGGERED, deleteButton_onTriggeredHandler )
		}

		private function deleteButton_onTriggeredHandler( e:Event ):void
		{
			flowService.showAlertPopup();
		}

		private function closeButton_onTriggeredHandler( e:Event ):void
		{
			flowService.setHomeView();
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
