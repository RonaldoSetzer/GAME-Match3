package setzer.matchthree.game.models
{
	import org.flexunit.Assert;

	import setzer.matchthree.game.utils.PieceType;

	public class LevelModelTest
	{
		public var levelModel:LevelModel;

		[Before]
		public function setUp():void
		{
			levelModel = new LevelModel();
			levelModel.score = 0;
		}

		[After]
		public function tearDown():void
		{
			levelModel = null;
		}

		[Test]
		public function testReset():void
		{
			levelModel.pieces.push( new PieceData() );
			levelModel.score = 1000;

			levelModel.toAdd.push( new PieceData() );
			levelModel.toRemove.push( new PieceData() );
			levelModel.toMove.push( new PieceData() );
			levelModel.reset();

			Assert.assertEquals( 0, levelModel.score );
			Assert.assertEquals( 0, levelModel.numStars );
			Assert.assertEquals( 0, levelModel.numMoves );
			Assert.assertEquals( 0, levelModel.pieces.length );
			Assert.assertEquals( 0, levelModel.toAdd.length );

			Assert.assertEquals( 0, levelModel.toRemove.length );
			Assert.assertEquals( 0, levelModel.toMove.length );
		}

		[Test]
		public function testAddPiece():void
		{
			var piece:PieceData = new PieceData();
			levelModel.addPiece( piece );

			Assert.assertEquals( 1, levelModel.toAdd.length );
			Assert.assertEquals( 1, levelModel.pieces.length );

			Assert.assertEquals( piece, levelModel.toAdd.pop() );
			Assert.assertEquals( piece, levelModel.pieces.pop() );
		}

		[Test]
		public function testAddToMoveList():void
		{
			var piece:PieceData = new PieceData();
			levelModel.addToMoveList( piece );

			Assert.assertEquals( 1, levelModel.toMove.length );
			Assert.assertEquals( piece, levelModel.toMove.pop() );
		}

		[Test]
		public function testAddToRemoveList():void
		{
			var piece:PieceData = new PieceData();
			levelModel.addToRemoveList( piece );

			Assert.assertEquals( 1, levelModel.toRemove.length );
			Assert.assertEquals( piece, levelModel.toRemove.pop() );
		}

		[Test]
		public function testRemovePiece():void
		{
			var piece:PieceData = new PieceData();
			levelModel.pieces.push( piece );

			levelModel.toAdd.push( piece );
			levelModel.toMove.push( piece );
			levelModel.removePiece( piece );

			Assert.assertEquals( 0, levelModel.pieces.length );

			Assert.assertEquals( 0, levelModel.toAdd.length );
			Assert.assertEquals( 0, levelModel.toRemove.length );
			Assert.assertEquals( 0, levelModel.toMove.length );
		}

		[Test]
		public function testUpateScoreByNormalType():void
		{
			levelModel.updateScoreByPieceType( PieceType.NORMAL );
			Assert.assertEquals( 100, levelModel.score );
		}

		[Test]
		public function testUpateScoreByLineType():void
		{
			levelModel.updateScoreByPieceType( PieceType.ROW );
			Assert.assertEquals( 200, levelModel.score );
		}

		[Test]
		public function testUpateScoreByColumnType():void
		{
			levelModel.updateScoreByPieceType( PieceType.COL );
			Assert.assertEquals( 200, levelModel.score );
		}

		[Test]
		public function testUpateScoreByRainbowType():void
		{
			levelModel.updateScoreByPieceType( PieceType.RAINBOW );
			Assert.assertEquals( 300, levelModel.score );
		}
	}
}
