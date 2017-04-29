package setzer.matchthree.game.commands
{
	import robotlegs.bender.extensions.commandCenter.api.ICommand;

	import setzer.matchthree.game.managers.GameManager;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.services.GameService;

	public class RetryGameCommand implements ICommand
	{
		[Inject]
		public var levelModel:LevelModel;

		[Inject]
		public var gameManager:GameManager;

		[Inject]
		public var gameService:GameService;

		[Inject]
		public var flowService:FlowService;

		public function execute():void
		{
			gameService.clearGridField();

			levelModel.reset();

			gameService.updateHUDData();
			gameService.start();
			flowService.showStartingPopup();

			gameManager.generateGrid( levelModel.maxCols, levelModel.maxRows );
			gameManager.nextStep();
		}
	}
}
