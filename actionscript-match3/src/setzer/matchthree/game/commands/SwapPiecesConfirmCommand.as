package setzer.matchthree.game.commands
{
	import robotlegs.bender.extensions.commandCenter.api.ICommand;

	import setzer.matchthree.game.models.GameStatus;
	import setzer.matchthree.game.models.LevelInfo;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.services.GameService;

	public class SwapPiecesConfirmCommand implements ICommand
	{
		[Inject]
		public var levelModel:LevelModel;

		[Inject]
		public var gameStatus:GameStatus;

		[Inject]
		public var gameService:GameService;

		public function execute():void
		{
			if ( levelModel.levelInfo.levelType == LevelInfo.TIMER_TYPE ) return;

			levelModel.numMoves -= 1;

			gameService.updateHUDData();

			if ( levelModel.numMoves == 0 )
				gameStatus.gameOver();

		}
	}
}
