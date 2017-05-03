package setzer.matchthree.game.utils
{
	import org.flexunit.Assert;

	import setzer.matchthree.game.models.PieceData;

	public class PieceUtilsTest
	{

		[Test]
		public function testGetEmpytPiece():void
		{
			var piece:PieceData = PieceUtils.getEmptyPiece( 1, 1 );
			Assert.assertNotNull( piece );
			Assert.assertEquals( 1, piece.row );
			Assert.assertEquals( 1, piece.col );
			Assert.assertEquals( PieceType.EMPTY, piece.pieceType );
		}

		[Test]
		public function testGetNewNormalPiece():void
		{
			var col:int = 1;
			var row:int = 1;

			var piece:PieceData = PieceUtils.getNewNormalPiece( col, row );
			var ids:Array = PieceIds.ALL_NORMAL_IDS;

			Assert.assertNotNull( piece );
			Assert.assertEquals( piece.pieceType, PieceType.NORMAL );
			Assert.assertEquals( piece.col, col );
			Assert.assertEquals( piece.row, row );
			Assert.assertTrue( ids.indexOf( piece.pieceId ) != -1 );
		}

		[Test]
		public function testgGetNewPowerUpPiece():void
		{
			var col:int = 2;
			var row:int = 3;
			var piece1:PieceData = PieceUtils.getNewPowerUpPiece( col, row, PieceType.RAINBOW );
			var piece2:PieceData = PieceUtils.getNewPowerUpPiece( col, row, PieceType.ROW, PieceIds.BLUE );
			var piece3:PieceData = PieceUtils.getNewPowerUpPiece( col, row, PieceType.COL, PieceIds.ORANGE );

			Assert.assertEquals( PieceType.RAINBOW, piece1.pieceType );
			Assert.assertEquals( PieceType.ROW, piece2.pieceType );
			Assert.assertEquals( PieceType.COL, piece3.pieceType );
			Assert.assertEquals( PieceIds.RAINBOW, piece1.pieceId );
			Assert.assertEquals( PieceIds.BLUE, piece2.pieceId );
			Assert.assertEquals( PieceIds.ORANGE, piece3.pieceId );

			Assert.assertNotNull( piece1 );
			Assert.assertEquals( piece1.col, col );
			Assert.assertEquals( piece1.row, row );
		}

		[Test]
		public function testGetNewPowerByChainLengthThree():void
		{
			var normalPiece:PieceData = PieceUtils.getNewPowerByChainLength( 3, PieceUtils.getNewNormalPiece( 0, 0 ) );
			var powerUpColRow:PieceData = PieceUtils.getNewPowerByChainLength( 4, PieceUtils.getNewNormalPiece( 0, 0, PieceIds.YELLOW ) );
			var powerUpRainbow:PieceData = PieceUtils.getNewPowerByChainLength( 5, PieceUtils.getNewNormalPiece( 0, 0, PieceIds.GREEN ) );

			Assert.assertNull( normalPiece );
			Assert.assertNotNull( powerUpColRow );
			Assert.assertNotNull( powerUpRainbow );

			Assert.assertTrue( (powerUpColRow.pieceType == PieceType.COL || powerUpColRow.pieceType == PieceType.ROW) );
			Assert.assertTrue( PieceType.RAINBOW, powerUpRainbow.pieceType );

			Assert.assertEquals( PieceIds.YELLOW, powerUpColRow.pieceId );
			Assert.assertEquals( PieceIds.RAINBOW, powerUpRainbow.pieceId );
		}

		[Test]
		public function testRemovePieceFromListsOfPieces():void
		{
			var piece:PieceData = new PieceData();
			var pieces:Vector.<PieceData> = new <PieceData>[piece];

			PieceUtils.removePieceFromListOfPieces( piece, pieces );

			Assert.assertEquals( 0, pieces.length );
		}

		[Test]
		public function testIsAdjacentHorizontalTrue():void
		{
			var piece1:PieceData = new PieceData( 1, 1 );
			var piece2:PieceData = new PieceData( piece1.col + 1, piece1.row );
			var piece3:PieceData = new PieceData( piece1.col - 1, piece1.row );

			Assert.assertTrue( PieceUtils.IsAdjacent( piece1, piece2 ) );
			Assert.assertTrue( PieceUtils.IsAdjacent( piece1, piece3 ) );
			Assert.assertTrue( PieceUtils.IsAdjacent( piece2, piece1 ) );
			Assert.assertTrue( PieceUtils.IsAdjacent( piece3, piece1 ) );
		}

		[Test]
		public function testIsAdjacentHorizontalFalse():void
		{
			var piece1:PieceData = new PieceData( 1, 1 );
			var piece2:PieceData = new PieceData( piece1.col + 2, piece1.row );

			var result:Boolean = false;
			var start:int = piece2.col;
			var end:int = piece2.col + 10;

			for ( var right:int = start; right < end; right++ )
			{
				piece2.col = right;
				result ||= PieceUtils.IsAdjacent( piece1, piece2 )
			}

			end = piece2.col - 10;
			for ( var left:int = start; left < end; left-- )
			{
				piece2.col = left;
				result ||= PieceUtils.IsAdjacent( piece1, piece2 )
			}

			Assert.assertFalse( PieceUtils.IsAdjacent( piece1, piece2 ) );
		}

		[Test]
		public function testIsAdjacentVerticalTrue():void
		{
			var piece1:PieceData = new PieceData( 1, 1 );
			var piece2:PieceData = new PieceData( piece1.col, piece1.row + 1 );
			var piece3:PieceData = new PieceData( piece1.col, piece1.row - 1 );

			Assert.assertTrue( PieceUtils.IsAdjacent( piece1, piece2 ) );
			Assert.assertTrue( PieceUtils.IsAdjacent( piece1, piece3 ) );
			Assert.assertTrue( PieceUtils.IsAdjacent( piece2, piece1 ) );
			Assert.assertTrue( PieceUtils.IsAdjacent( piece3, piece1 ) );
		}

		[Test]
		public function testIsAdjacentVerticalFalse():void
		{
			var piece1:PieceData = new PieceData( 1, 1 );
			var piece2:PieceData = new PieceData( piece1.col, piece1.row + 2 );

			var result:Boolean = false;
			var start:int = piece2.row;
			var end:int = piece2.row + 10;

			for ( var down:int = start; down < end; down++ )
			{
				piece2.row = down;
				result ||= PieceUtils.IsAdjacent( piece1, piece2 )
			}

			end = piece2.row - 10;
			for ( var up:int = start; up < end; up-- )
			{
				piece2.row = up;
				result ||= PieceUtils.IsAdjacent( piece1, piece2 )
			}

			Assert.assertFalse( PieceUtils.IsAdjacent( piece1, piece2 ) );
		}
	}
}
