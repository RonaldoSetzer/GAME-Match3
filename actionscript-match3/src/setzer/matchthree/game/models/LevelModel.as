package setzer.matchthree.game.models
{
	import setzer.matchthree.game.utils.PieceType;
	import setzer.matchthree.game.utils.PieceUtils;

	public class LevelModel
	{
		public var levelId:int;
		public var levelInfo:LevelInfo;
		public var score:int;

		public var numStars:int;
		public var numMoves:int;
		public var clock:int;

		private var _pieces:Vector.<PieceData>;

		private var _toAdd:Vector.<PieceData>;
		private var _toRemove:Vector.<PieceData>;
		private var _toMove:Vector.<PieceData>;

		public function LevelModel()
		{
			reset();
		}

		public function reset():void
		{
			score = 0;
			numStars = 0;

			_pieces = new Vector.<PieceData>();

			_toAdd = new Vector.<PieceData>();
			_toRemove = new Vector.<PieceData>();
			_toMove = new Vector.<PieceData>();

			if ( levelInfo )
			{

				numMoves = levelInfo.numMoves;
				clock = levelInfo.time;
			}

		}

		public function updateScoreByPieceType( pieceType:String ):void
		{
			var list:Object = {};
			list[PieceType.COL] = 200;
			list[PieceType.ROW] = 200;
			list[PieceType.RAINBOW] = 300;

			score += list[pieceType] || 100;
		}

		public function addPiece( piece:PieceData ):void
		{
			_pieces.push( piece );
			_toAdd.push( piece );
		}

		public function addToMoveList( piece:PieceData ):void
		{
			if ( _toMove.indexOf( piece ) != -1 ) return;
			_toMove.push( piece );
		}

		public function addToRemoveList( piece:PieceData ):void
		{
			if ( _toRemove.indexOf( piece ) != -1 ) return;
			_toRemove.push( piece );
		}

		public function removePiece( piece:PieceData ):void
		{
			PieceUtils.removePieceFromArrays( piece, _pieces );
			PieceUtils.removePieceFromArrays( piece, _toAdd );
			PieceUtils.removePieceFromArrays( piece, _toMove );
			PieceUtils.removePieceFromArrays( piece, _toRemove );
		}

		public function get toAdd():Vector.<PieceData>
		{
			return _toAdd;
		}

		public function get toRemove():Vector.<PieceData>
		{
			return _toRemove;
		}

		public function get toMove():Vector.<PieceData>
		{
			return _toMove;
		}

		public function get pieces():Vector.<PieceData>
		{
			return _pieces;
		}

		public function get maxCols():int
		{
			return levelInfo.maxCols;
		}

		public function get maxRows():int
		{
			return levelInfo.maxRows;
		}

	}
}
