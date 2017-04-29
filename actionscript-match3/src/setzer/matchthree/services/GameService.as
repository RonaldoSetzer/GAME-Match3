package setzer.matchthree.services
{
	import setzer.matchthree.events.GameEvent;
	import setzer.matchthree.game.models.GameStatus;

	import starling.events.EventDispatcher;

	public class GameService
	{
		[Inject]
		public var dispatcher:EventDispatcher;

		[Inject]
		public var gameStatus:GameStatus;

		//Commands
		public function createLevel( levelId:int = 1 ):void
		{
			var event:GameEvent = new GameEvent( GameEvent.CREATE_LEVEL_COMMAND );
			event.extra = {levelId:levelId};
			dispatcher.dispatchEvent( event );
		}

		public function retryCommand():void
		{
			dispatcher.dispatchEventWith( GameEvent.RETRY_GAME_COMMAND );
		}

		public function swapPiecesCommand( phase:String, col:int, row:int ):void
		{
			var event:GameEvent = new GameEvent( GameEvent.SWAP_PIECES_COMMAND );
			event.extra = {
				phase:phase, //
				col:col, //
				row:row //
			};
			dispatcher.dispatchEvent( event );
		}

		public function swapPiecesConfirmCommand():void
		{
			dispatcher.dispatchEvent( new GameEvent( GameEvent.SWAP_PIECES_CONFIRM_COMMAND ) );
		}

		public function gameOverCommand():void
		{
			dispatcher.dispatchEventWith( GameEvent.GAME_OVER_COMMAND );
		}

		//Game
		public function start():void
		{
			gameStatus.start();
		}

		public function pause():void
		{
			gameStatus.pause();
			dispatcher.dispatchEventWith( GameEvent.PAUSE );
		}

		public function resume():void
		{
			gameStatus.resume();
			dispatcher.dispatchEventWith( GameEvent.RESUME );
		}

		public function gameOver():void
		{
			gameStatus.gameOver();
		}

		//UPDATE_GRID
		public function updateHUDData():void
		{
			dispatcher.dispatchEvent( new GameEvent( GameEvent.UPDATE_HUD_DATA ) );
		}

		public function clearGridField():void
		{
			dispatcher.dispatchEvent( new GameEvent( GameEvent.CLEAR_GRID ) );
		}

		public function updateGridField():void
		{
			dispatcher.dispatchEvent( new GameEvent( GameEvent.UPDATE_GRID ) );
		}

	}
}
