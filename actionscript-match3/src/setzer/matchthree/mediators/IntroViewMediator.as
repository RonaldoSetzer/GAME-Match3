package setzer.matchthree.mediators
{
	import flash.utils.setTimeout;

	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.views.IntroView;

	public class IntroViewMediator extends StarlingMediator
	{
		[Inject]
		public var flowService:FlowService;

		[Inject]
		public var view:IntroView;

		override public function initialize():void
		{
			view.playAnimation();
			setTimeout( onTimerOutHandler, 3000 );
		}

		private function onTimerOutHandler():void
		{
			flowService.setHomeView();
		}
	}
}