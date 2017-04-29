package setzer.matchthree.game.models
{
	public class GameStatus
	{
		private var _isPaused:Boolean;
		private var _isGameOver:Boolean;
		public var hasToWait:Boolean;

		public function start():void
		{
			_isGameOver = false;
		}

		public function gameOver():void
		{
			_isGameOver = true;
		}

		public function pause():void
		{
			_isPaused = true;
		}

		public function resume():void
		{
			_isPaused = false;
		}

		public function get isPaused():Boolean
		{
			return _isPaused;
		}

		public function get isGameOver():Boolean
		{
			return _isGameOver;
		}
	}
}
