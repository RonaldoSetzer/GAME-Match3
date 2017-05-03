package setzer.matchthree.game.utils
{
	import org.flexunit.Assert;

	import setzer.matchthree.game.models.GridData;
	import setzer.matchthree.game.models.PieceData;

	public class PowerUpUtilsTest
	{
		private var result:Vector.<PieceData>;
		private var pieces:Vector.<PieceData>;
		private var grid:GridData;

		[Before]
		public function setUp():void
		{
			result = new Vector.<PieceData>();
			pieces = new Vector.<PieceData>();
			grid = new GridData( 5, 5 );
		}

		[After]
		public function tearDown():void
		{
			result = null;
			pieces = null;
			grid = null;
		}

		[Test]
		public function testGetPiecesAffectedByPowerUpPieceAffectedIsAPowerUpRow():void
		{
			var piece:PieceData;
			var row:int = 0;
			var isSameRow:Boolean = true;
			for ( var col:int = 0; col < grid.maxCols; col++ )
			{
				piece = PieceUtils.getNewNormalPiece( col, row );
				pieces.push( piece );
				grid.setPiece( piece );
			}

			var removePiece:PieceData = PieceUtils.getNewPowerUpPiece( 0, 0, PieceType.ROW, PieceIds.BLUE );
			result = PowerUpUtils.getPiecesAffectedByPowerUp( removePiece, grid );

			for ( var i:int = 0; i < result.length; i++ )
			{
				piece = result[i];
				isSameRow &&= (piece.row == row);
			}

			Assert.assertEquals( grid.maxRows, result.length );
			Assert.assertTrue( isSameRow );
		}

		[Test]
		public function testGetPiecesAffectedByPowerUpPieceAffectedIsAPowerUpCol():void
		{
			var piece:PieceData;
			var col:int = 0;
			var isSameCol:Boolean = true;
			for ( var row:int = 0; row < grid.maxCols; row++ )
			{
				piece = PieceUtils.getNewNormalPiece( col, row );
				pieces.push( piece );
				grid.setPiece( piece );
			}

			var removePiece:PieceData = PieceUtils.getNewPowerUpPiece( 0, 0, PieceType.COL, PieceIds.BLUE );
			result = PowerUpUtils.getPiecesAffectedByPowerUp( removePiece, grid );

			for ( var i:int = 0; i < result.length; i++ )
			{
				piece = result[i];
				isSameCol &&= (piece.col == col);
			}

			Assert.assertEquals( grid.maxCols, result.length );
			Assert.assertTrue( isSameCol );
		}

		[Test]
		public function testGetPiecesAffectedByPowerUpPieceAffectedIsAPowerUpRainbow():void
		{
			var piece:PieceData;
			var col:int = 0;
			var row:int = 0;
			var isInPieces:Boolean = true;
			for ( var i:int = 0; i < grid.maxCols; i++ )
			{
				//ROW
				row = 3;
				col = i;
				piece = PieceUtils.getNewNormalPiece( col, row );
				pieces.push( piece );
				grid.setPiece( piece );

				//COL
				row = i;
				col = 3;
				piece = PieceUtils.getNewNormalPiece( col, row );
				pieces.push( piece );
				grid.setPiece( piece );
			}

			var removePiece:PieceData = PieceUtils.getNewPowerUpPiece( 3, 3, PieceType.RAINBOW, PieceIds.RAINBOW );
			result = PowerUpUtils.getPiecesAffectedByPowerUp( removePiece, grid );

			for ( i = 0; i < result.length; i++ )
			{
				piece = result[i];
				isInPieces &&= (pieces.indexOf( piece ) != -1);
			}

			Assert.assertEquals( pieces.length, result.length );
			Assert.assertTrue( isInPieces );
		}

		[Test]
		public function testGetPiecesAffectedByPowerUpPieceAffectedIsAPowerUpColoredRainbow():void
		{
			var piece:PieceData;
			var col:int = 0;
			var row:int = 0;
			var isInPieces:Boolean = true;

			for ( var i:int = 0; i < 10; i++ )
			{

				do {
					row = Math.floor( Math.random() * grid.maxRows );
					col = Math.floor( Math.random() * grid.maxCols );
				} while ( grid.getPiece( col, row ).pieceType != PieceType.EMPTY );

				piece = PieceUtils.getNewNormalPiece( col, row, PieceIds.GREEN );
				pieces.push( piece );
				grid.setPiece( piece );
			}

			var removePiece:PieceData = PieceUtils.getNewPowerUpPiece( 0, 0, PieceType.RAINBOW, PieceIds.GREEN );
			result = PowerUpUtils.getPiecesAffectedByPowerUp( removePiece, grid );

			for ( i = 0; i < result.length; i++ )
			{
				piece = result[i];
				isInPieces &&= (pieces.indexOf( piece ) != -1);
			}

			Assert.assertEquals( pieces.length, result.length );
			Assert.assertTrue( isInPieces );
		}
	}
}
