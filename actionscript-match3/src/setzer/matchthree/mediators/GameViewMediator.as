package setzer.matchthree.mediators
{
	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.views.GameView;

	public class GameViewMediator extends StarlingMediator
	{
		[Inject]
		public var view:GameView;

		override public function initialize():void
		{
			view.createComponents();
		}

		override public function destroy():void
		{
			view.destroy();
		}
	}
}
