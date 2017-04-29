package setzer.matchthree.game.models
{
	public class LevelInfo
	{
		public static const MOVE_TYPE:String = "moveType";
		public static const TIMER_TYPE:String = "timerType";

		public var hiScore:int;

		private var _maxCols:int;
		private var _maxRows:int;
		private var _levelType:String;

		private var _scoreStarts:Vector.<int>;
		private var _numMoves:int;
		private var _time:int;
		private var _levelId:int;

		public function LevelInfo( levelId:int, maxCols:int, maxRows:int, levelType:String, scoreStart1:int, scoreStart2:int, scoreStart3:int, moves:int = 16, time:int = 0 )
		{
			_levelId = levelId;
			_numMoves = moves;
			_time = time;
			this._maxCols = maxCols;
			this._maxRows = maxRows;
			this._levelType = levelType;
			this._scoreStarts = new <int>[scoreStart1, scoreStart2, scoreStart3];
		}

		public function getNumStars():int
		{
			var numStars:int = 0;
			for ( var i:int = 0; i < scoreStarts.length; i++ )
			{
				if ( hiScore >= scoreStarts[i] )
					numStars++;
			}

			return numStars;
		}

		public function get scoreStarts():Vector.<int>
		{
			return _scoreStarts;
		}

		public function get levelType():String
		{
			return _levelType;
		}

		public function get maxRows():int
		{
			return _maxRows;
		}

		public function get maxCols():int
		{
			return _maxCols;
		}

		public function get numMoves():int
		{
			return _numMoves;
		}

		public function get time():int
		{
			return _time;
		}

		public function get levelId():int
		{
			return _levelId;
		}

	}
}
