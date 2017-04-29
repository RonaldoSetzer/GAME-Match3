package setzer.matchthree.game.models
{
	import starling.events.TouchPhase;

	public class SwapModel
	{

		public static const SWAP:String = "swap";
		public static const WAIT:String = "wait";
		public static const ROLLBACK:String = "rollback";
		public static const VALIDATE:String = "validate";
		public static const HORIZONTAL:String = "horizontal";
		public static const VERTICAL:String = "vertical";

		public var status:String;

		private var _first:Tile;
		private var _second:Tile;
		private var _maxCols:int;
		private var _maxRows:int;

		public function SwapModel()
		{
			_first = new Tile();
			_second = new Tile();
		}

		public function setMaxValues( maxCols:int, maxRows:int ):void
		{
			_maxCols = maxCols;
			_maxRows = maxRows;
		}

		public function setPosition( phase:String, col:int, row:int ):void
		{
			var position:Tile = (TouchPhase.BEGAN == phase) ? _first : _second;

			position.col = solveRanger( col, _maxCols );
			position.row = solveRanger( row, _maxRows );
		}

		private static function solveRanger( value:int, max:int ):int
		{
			return Math.max( Math.min( value, max - 1 ), 0 );
		}

		public function get swapDirection():String
		{
			return (first.col == second.col) ? VERTICAL : HORIZONTAL;
		}

		public function get first():Tile
		{
			return _first;
		}

		public function get second():Tile
		{
			return _second;
		}

		public function udpateStatus():void
		{
			if ( status == SwapModel.SWAP )
				status = SwapModel.VALIDATE; //
			else
				status = "";
		}
	}
}
