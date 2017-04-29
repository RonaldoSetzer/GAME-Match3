package setzer.matchthree.game.models
{
	import org.flexunit.Assert;

	import setzer.matchthree.game.utils.PieceType;

	public class GridDataTest
	{
		private var grid:GridData;

		[Before]
		public function setUp():void
		{
			grid = new GridData();
		}

		[After]
		public function tearDown():void
		{
			grid = null;
		}

		[Test]
		public function testConstructorDefaultValues():void
		{
			grid = new GridData();
			Assert.assertEquals( 8, grid.maxCols );
			Assert.assertEquals( 8, grid.maxRows );
		}

		[Test]
		public function testGenerateGrid():void
		{
			grid = new GridData();
			Assert.assertEquals( PieceType.EMPTY, grid.getPiece( 0, 0 ).pieceType );
			Assert.assertNotNull( grid.getPiece( grid.maxCols - 1, grid.maxRows - 1 ) );
		}

		[Test]
		public function testGetTile():void
		{
			var piece:PieceData = new PieceData( 1, 1 );

			grid.setPiece( piece );

			var pieceGet:PieceData = grid.getPiece( 1, 1 );

			Assert.assertEquals( 1, pieceGet.col );
			Assert.assertEquals( 1, pieceGet.row );
			Assert.assertNotNull( pieceGet );
		}

		[Test]
		public function testSetPiece():void
		{
			var piece1:PieceData = new PieceData( 0, 0 );
			var piece2:PieceData = new PieceData( 1, 1 );

			grid.setPiece( piece1 );
			grid.setPiece( piece2 );

			Assert.assertEquals( piece1, grid.getPiece( 0, 0 ) );
			Assert.assertEquals( piece2, grid.getPiece( 1, 1 ) );
		}
	}
}
