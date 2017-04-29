package setzer.matchthree.game.models
{
	import setzer.matchthree.game.displays.PieceDisplay;
	import setzer.matchthree.game.utils.PieceDisplayPool;
	import setzer.matchthree.game.utils.PieceType;

	public class PieceData
	{
		private var _pieceType:String;
		public var pieceId:int;
		public var row:int;
		public var col:int;

		public var display:PieceDisplay;

		public function PieceData( col:int = 0, row:int = 0, pieceType:String = PieceType.EMPTY, pieceId:int = 0 )
		{
			this._pieceType = pieceType;
			this.pieceId = pieceId;
			this.col = col;
			this.row = row;
		}

		public function createDisplay():void
		{
			display = PieceDisplayPool.getPieceDisplay( pieceId, _pieceType );
			display.x = Tile.TILE_WIDTH * col;
			display.y = row ? Tile.TILE_WIDTH * row : -Tile.TILE_HEIGHT;
		}

		public function setPosition( col:int, row:int ):void
		{
			this.col = col;
			this.row = row;
		}

		public function toString():String
		{
			return "piece_id_" + pieceId + "_type_" + _pieceType + "_col_" + col + "_row_" + row;
		}

		public function get pieceType():String
		{
			return _pieceType;
		}
	}
}
