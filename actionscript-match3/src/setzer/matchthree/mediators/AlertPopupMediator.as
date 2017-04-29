package setzer.matchthree.mediators
{
	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.utils.SharedObjectManager;
	import setzer.matchthree.views.AlertPopup;

	import starling.events.Event;

	public class AlertPopupMediator extends StarlingMediator
	{
		[Inject]
		public var view:AlertPopup;

		override public function initialize():void
		{
			eventMap.mapListener( view.confirmButton, Event.TRIGGERED, confirmButton_onTriggeredHandler );
			eventMap.mapListener( view.cancelButton, Event.TRIGGERED, cancelButton_onTriggeredHandler );
		}

		private function confirmButton_onTriggeredHandler( e:Event ):void
		{
			SharedObjectManager.clear();
			view.removeFromParent();
		}

		private function cancelButton_onTriggeredHandler( e:Event ):void
		{
			view.removeFromParent();
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
