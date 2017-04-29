package setzer.matchthree.game.models
{
	import setzer.matchthree.game.utils.PieceUtils;

	public class GridData
	{
		private var _maxCols:uint;
		private var _maxRows:uint;
		private var _grid:Vector.<Vector.<PieceData>>;

		public function GridData( cols:uint = 8, rows:uint = 8 )
		{
			_grid = new Vector.<Vector.<PieceData>>();
			_maxCols = cols;
			_maxRows = rows;
			generateEmptyGrid();
		}

		private function generateEmptyGrid():void
		{
			var line:Vector.<PieceData>;
			for ( var row:int = 0; row < _maxRows; row++ )
			{
				line = new Vector.<PieceData>();
				for ( var col:int = 0; col < _maxCols; col++ )
				{
					line.push( PieceUtils.getEmptyPiece( col, row ) );
				}
				_grid.push( line );
			}
		}

		public function get maxRows():uint
		{
			return _maxRows;
		}

		public function get maxCols():uint
		{
			return _maxCols;
		}

		public function getPiece( col:int, row:int ):PieceData
		{
			return _grid[row][col] || null;
		}

		public function setPiece( piece:PieceData ):void
		{
			_grid[piece.row][piece.col] = piece;
		}
	}
}
