package setzer.matchthree.game.commands
{
	import robotlegs.bender.extensions.commandCenter.api.ICommand;

	import setzer.matchthree.events.GameEvent;
	import setzer.matchthree.game.managers.GameManager;
	import setzer.matchthree.game.models.SwapModel;

	import starling.events.TouchPhase;

	public class SwapPiecesCommand implements ICommand
	{
		[Inject]
		public var swapModel:SwapModel;

		[Inject]
		public var gameManager:GameManager;

		[Inject]
		public var gameEvent:GameEvent;

		public function execute():void
		{
			swapModel.status = SwapModel.WAIT;
			swapModel.setPosition( gameEvent.extra.phase, gameEvent.extra.col, gameEvent.extra.row );

			if ( gameEvent.extra.phase == TouchPhase.ENDED )
			{
				swapModel.status = SwapModel.SWAP;
				gameManager.nextStep();
			}
		}
	}
}
