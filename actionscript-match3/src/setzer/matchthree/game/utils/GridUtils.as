package setzer.matchthree.game.utils
{
	import setzer.matchthree.game.models.GridData;
	import setzer.matchthree.game.models.PieceData;

	public class GridUtils
	{
		public static function generateByMap( grid:GridData, map:Array ):void
		{
			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				for ( var col:int = 0; col < grid.maxCols; col++ )
				{
					grid.setPiece( PieceUtils.getNewNormalPiece( col, row, map[row][col] ) );
				}
			}
		}

		public static function spawnNewRow( grid:GridData, row:int ):Vector.<PieceData>
		{
			var pieces:Vector.<PieceData> = new Vector.<PieceData>();
			var piece:PieceData;

			for ( var col:int = 0; col < grid.maxCols; col++ )
			{
				piece = grid.getPiece( col, row );

				if ( piece.pieceType != PieceType.EMPTY ) continue;

				piece = PieceUtils.getNewNormalPiece( col, row );
				pieces.push( piece );
				grid.setPiece( piece );
			}
			return pieces;
		}

		public static function swapPieces( grid:GridData, piece1:PieceData, piece2:PieceData ):void
		{
			var row1:int = piece1.row;
			var col1:int = piece1.col;

			piece1.row = piece2.row;
			piece1.col = piece2.col;

			piece2.row = row1;
			piece2.col = col1;

			grid.setPiece( piece1 );
			grid.setPiece( piece2 );
		}

		public static function getCol( grid:GridData, col:int ):Vector.<PieceData>
		{
			var result:Vector.<PieceData> = new Vector.<PieceData>();
			var piece:PieceData;

			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				piece = grid.getPiece( col, row );
				result.push( piece );
			}
			return result;
		}

		public static function getRow( grid:GridData, row:int ):Vector.<PieceData>
		{
			var result:Vector.<PieceData> = new Vector.<PieceData>();
			var piece:PieceData;

			for ( var col:int = 0; col < grid.maxCols; col++ )
			{
				piece = grid.getPiece( col, row );
				result.push( piece );
			}
			return result;
		}

		public static function getAllPiecesById( grid:GridData, pieceId:int ):Vector.<PieceData>
		{
			var result:Vector.<PieceData> = new Vector.<PieceData>();
			var piece:PieceData;
			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				for ( var col:int = 0; col < grid.maxCols; col++ )
				{
					piece = grid.getPiece( col, row );

					if ( piece.pieceId == pieceId )
						result.push( piece );
				}
			}
			return result;
		}

		public static function hasEmptyPiece( grid:GridData ):Boolean
		{
			var piece:PieceData;

			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				for ( var col:int = 0; col < grid.maxCols; col++ )
				{
					piece = grid.getPiece( col, row );
					if ( piece.pieceType == PieceType.EMPTY )
						return true;
				}
			}
			return false;
		}

		public static function removePiece( grid:GridData, piece:PieceData ):void
		{
			grid.setPiece( new PieceData( piece.col, piece.row ) );
		}

		public static function removePieces( grid:GridData, pieces:Vector.<PieceData> ):void
		{
			for each ( var piece:PieceData in pieces )
			{
				removePiece( grid, piece );
			}
		}

		public static function getAllChains( grid:GridData ):Vector.<Vector.<PieceData>>
		{
			var result:Vector.<Vector.<PieceData>> = new Vector.<Vector.<PieceData>>();
			var row:int;
			var col:int;

			for ( row = 0; row < grid.maxRows; row++ )
			{
				result = result.concat( getHorizontalChains( grid, row ) );
			}

			for ( col = 0; col < grid.maxCols; col++ )
			{
				result = result.concat( getVerticalChains( grid, col ) );
			}

			return result;
		}

		public static function getHorizontalChains( grid:GridData, row:int ):Vector.<Vector.<PieceData>>
		{
			var result:Vector.<Vector.<PieceData>> = new Vector.<Vector.<PieceData>>();
			var horizontal:Vector.<PieceData>;
			var piece:PieceData;
			var pieceBefore:PieceData;
			var col:int;

			pieceBefore = grid.getPiece( 0, row );
			horizontal = new Vector.<PieceData>();
			horizontal.push( pieceBefore );

			for ( col = 1; col < grid.maxCols; col++ )
			{
				piece = grid.getPiece( col, row );

				if ( (piece.pieceId == pieceBefore.pieceId) && (PieceType.EMPTY != piece.pieceType) )
				{
					horizontal.push( piece );
				} else
				{
					if ( horizontal.length >= 3 )
					{
						result.push( horizontal );
					}
					horizontal = new Vector.<PieceData>();

					if ( PieceType.EMPTY != piece.pieceType )
						horizontal.push( piece );
				}

				pieceBefore = piece;
			}
			if ( horizontal.length >= 3 )
			{
				result.push( horizontal );
			}
			return result;
		}

		public static function getVerticalChains( grid:GridData, col:int ):Vector.<Vector.<PieceData>>
		{
			var result:Vector.<Vector.<PieceData>> = new Vector.<Vector.<PieceData>>();
			var vertical:Vector.<PieceData>;
			var piece:PieceData;
			var pieceBefore:PieceData;
			var row:int;

			pieceBefore = grid.getPiece( col, 0 );

			vertical = new Vector.<PieceData>();
			vertical.push( pieceBefore );

			for ( row = 1; row < grid.maxRows; row++ )
			{
				piece = grid.getPiece( col, row );

				if ( piece.pieceId == pieceBefore.pieceId && (PieceType.EMPTY != piece.pieceType) )
				{
					vertical.push( piece );
				} else
				{
					if ( vertical.length >= 3 )
					{
						result.push( vertical );
					}
					vertical = new Vector.<PieceData>();
					if ( PieceType.EMPTY != piece.pieceType )
						vertical.push( piece );
				}

				pieceBefore = piece;
			}
			if ( vertical.length >= 3 )
			{
				result.push( vertical );
			}
			return result;
		}

		public static function getChainWithPiece( grid:GridData, piece:PieceData ):Vector.<PieceData>
		{
			var chains:Vector.<Vector.<PieceData>> = new Vector.<Vector.<PieceData>>();
			chains = chains.concat( getVerticalChains( grid, piece.col ) );
			chains = chains.concat( getHorizontalChains( grid, piece.row ) );

			var result:Vector.<PieceData> = new Vector.<PieceData>();

			for ( var i:int = 0; i < chains.length; i++ )
			{
				if ( chains[i].indexOf( piece ) != -1 ) result = result.concat( chains[i] );
			}

			return result;
		}

		public static function getAllPieces( grid:GridData ):Vector.<PieceData>
		{
			var result:Vector.<PieceData> = new Vector.<PieceData>();
			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				result = result.concat( GridUtils.getRow( grid, row ) );
			}
			return result;
		}

		public static function getAllPowerUps( grid:GridData ):Vector.<PieceData>
		{
			var pieces:Vector.<PieceData> = new Vector.<PieceData>();
			var piece:PieceData;
			var powerUpTypeIds:Array = [PieceType.ROW, PieceType.COL, PieceType.RAINBOW];

			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				for ( var col:int = 0; col < grid.maxCols; col++ )
				{
					piece = grid.getPiece( col, row );
					if ( powerUpTypeIds.indexOf( piece.pieceType ) != -1 )
						pieces.push( piece );
				}
			}
			return pieces;
		}

		public static function printMap( grid:GridData ):void
		{
			var result:String = "------------------------\n";
			var piece:PieceData;
			var pieceDescription:String;

			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				result += "[";
				for ( var col:int = 0; col < grid.maxCols; col++ )
				{
					piece = grid.getPiece( col, row );

					if ( PieceType.NORMAL == piece.pieceType )
						pieceDescription = piece.pieceId + " ";//
					else if ( PieceType.EMPTY == piece.pieceType )
						pieceDescription = "EE";//
					else
						pieceDescription = piece.pieceId + "P";

					pieceDescription = result += pieceDescription;
					result += (col < grid.maxCols - 1) ? "," : "";
				}
				result += "]\n";
			}
			result += "------------------------\n";
			trace( result );
		}

	}
}
