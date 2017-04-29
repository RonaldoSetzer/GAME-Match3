package setzer.matchthree.game.commands
{
	import robotlegs.bender.extensions.commandCenter.api.ICommand;

	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.game.utils.LevelsRepository;
	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.services.GameService;
	import setzer.matchthree.utils.SharedObjectManager;

	public class GameOverCommand implements ICommand
	{
		[Inject]
		public var levelModel:LevelModel;

		[Inject]
		public var gameService:GameService;

		[Inject]
		public var flowService:FlowService;


		public function execute():void
		{
			gameService.pause();
			var hiScore:int = levelModel.levelInfo.hiScore;
			hiScore = Math.max( hiScore, levelModel.score );

			LevelsRepository.updateHiScore( levelModel.levelId, hiScore );
			SharedObjectManager.updateHighScore();

			var stars:int = 0;
			for ( var i:int = 0; i < levelModel.levelInfo.scoreStarts.length; i++ )
			{
				if ( levelModel.score >= levelModel.levelInfo.scoreStarts[i] )
					stars++;
			}

			levelModel.numStars = stars;

			if ( stars > 0 )
				flowService.showYouWinPopup(); //
			else
				flowService.showGameOverPopup();
		}
	}
}
