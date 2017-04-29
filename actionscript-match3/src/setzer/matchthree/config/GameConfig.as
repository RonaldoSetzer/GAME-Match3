package setzer.matchthree.config
{
	import robotlegs.bender.extensions.palidor.starlingCommandMap.api.IStarlingCommandMap;
	import robotlegs.bender.framework.api.IConfig;
	import robotlegs.bender.framework.api.IContext;

	import setzer.matchthree.assets.Assets;
	import setzer.matchthree.events.GameEvent;
	import setzer.matchthree.game.commands.CreateLevelCommand;
	import setzer.matchthree.game.commands.GameOverCommand;
	import setzer.matchthree.game.commands.RetryGameCommand;
	import setzer.matchthree.game.commands.SwapPiecesCommand;
	import setzer.matchthree.game.commands.SwapPiecesConfirmCommand;
	import setzer.matchthree.game.managers.GameManager;
	import setzer.matchthree.game.models.GameStatus;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.game.models.SwapModel;
	import setzer.matchthree.game.utils.LevelsRepository;
	import setzer.matchthree.game.utils.PieceDisplayPool;
	import setzer.matchthree.services.GameService;

	import starling.events.EventDispatcher;

	public class GameConfig implements IConfig
	{
		[Inject]
		public var eventDispatcher:EventDispatcher;

		[Inject]
		public var context:IContext;

		[Inject]
		public var commandMap:IStarlingCommandMap;

		public function configure():void
		{
			Assets.init();
			LevelsRepository.init();
			PieceDisplayPool.init();

			context.afterInitializing( init );
		}

		private function init():void
		{
			mapModels();
			mapServices();
			mapCommands();
			mapManager();
		}

		private function mapModels():void
		{
			context.injector.map( GameStatus ).asSingleton();
			context.injector.map( LevelModel ).asSingleton();
			context.injector.map( SwapModel ).asSingleton();
		}

		private function mapManager():void
		{
			context.injector.map( GameManager ).asSingleton();
		}

		private function mapCommands():void
		{
			commandMap.map( GameEvent.CREATE_LEVEL_COMMAND ).toCommand( CreateLevelCommand );
			commandMap.map( GameEvent.RETRY_GAME_COMMAND ).toCommand( RetryGameCommand );
			commandMap.map( GameEvent.GAME_OVER_COMMAND ).toCommand( GameOverCommand );

			commandMap.map( GameEvent.SWAP_PIECES_COMMAND ).toCommand( SwapPiecesCommand );
			commandMap.map( GameEvent.SWAP_PIECES_CONFIRM_COMMAND ).toCommand( SwapPiecesConfirmCommand );
		}

		private function mapServices():void
		{
			context.injector.map( GameService ).asSingleton();
		}
	}
}
