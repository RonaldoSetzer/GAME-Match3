package setzer.matchthree.game.models
{
	import org.flexunit.Assert;

	import setzer.matchthree.game.utils.PieceType;

	public class PieceTest
	{
		private var piece:PieceData;

		[Before]
		public function setUp():void
		{
			piece = new PieceData();
		}

		[After]
		public function tearDown():void
		{
			piece = null;
		}

		[Test]
		public function testConstructor():void
		{
			piece = new PieceData( 1, 2, PieceType.NORMAL );
			Assert.assertEquals( PieceType.NORMAL, piece.pieceType );
			Assert.assertEquals( 1, piece.col );
			Assert.assertEquals( 2, piece.row );
		}

		[Test]
		public function testSetPosition():void
		{
			piece.setPosition( 1, 2 );
			Assert.assertEquals( 1, piece.col );
			Assert.assertEquals( 2, piece.row );
		}

		[Test]
		public function testToString():void
		{
			piece.row = 5;
			piece.col = 5;

			var str:String = piece.toString();
			Assert.assertEquals( "piece_id_0_type_empty_col_5_row_5", str );
		}
	}
}
