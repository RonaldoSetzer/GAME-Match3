package setzer.matchthree.game.commands
{
	import robotlegs.bender.extensions.commandCenter.api.ICommand;

	import setzer.matchthree.events.GameEvent;
	import setzer.matchthree.game.managers.GameManager;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.game.utils.LevelsRepository;
	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.services.GameService;

	public class CreateLevelCommand implements ICommand
	{
		[Inject]
		public var levelModel:LevelModel;

		[Inject]
		public var gameManager:GameManager;

		[Inject]
		public var gameService:GameService;

		[Inject]
		public var flowService:FlowService;

		[Inject]
		public var gameEvent:GameEvent;

		public function execute():void
		{
			levelModel.levelId = gameEvent.extra.levelId;
			levelModel.levelInfo = LevelsRepository.getLevelInfoById( levelModel.levelId );
			levelModel.reset();
			levelModel.numMoves = levelModel.levelInfo.numMoves;

			gameManager.generateGrid( levelModel.maxCols, levelModel.maxRows );

			gameService.updateHUDData();
			gameService.start();

			flowService.setGameView();
			flowService.showStartingPopup();
		}
	}
}
