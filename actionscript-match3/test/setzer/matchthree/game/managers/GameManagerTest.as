package setzer.matchthree.game.managers
{
	import org.flexunit.Assert;

	import setzer.matchthree.game.models.GameStatus;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.game.models.PieceData;
	import setzer.matchthree.game.models.SwapModel;
	import setzer.matchthree.game.utils.GridUtils;
	import setzer.matchthree.game.utils.PieceIds;
	import setzer.matchthree.game.utils.PieceType;
	import setzer.matchthree.game.utils.PieceUtils;
	import setzer.matchthree.services.GameService;

	import starling.events.EventDispatcher;

	public class GameManagerTest
	{
		private var gameManager:GameManager;

		[Before]
		public function setUp():void
		{
			gameManager = new GameManager();
			gameManager.levelModel = new LevelModel();
			gameManager.swapModel = new SwapModel();
			gameManager.gameStatus = new GameStatus();
			gameManager.gameService = new GameService();
			gameManager.gameService.gameStatus = gameManager.gameStatus;
			gameManager.gameService.dispatcher = new EventDispatcher();
			gameManager.generateGrid( 8, 8 );
		}

		[After]
		public function tearDown():void
		{
			gameManager = null;
		}

		[Test]
		public function testCreateNewPiecesAbove():void
		{
			var isNotEmpty:Boolean = true;
			var hasPieceId:Boolean = true;
			var addedToLevelModel:Boolean = true;
			var piece:PieceData;
			var topLine:int = 0;

			gameManager.createNewPiecesAbove();

			for ( var col:int = 0; col < gameManager.grid.maxCols; col++ )
			{
				piece = gameManager.grid.getPiece( col, topLine );
				isNotEmpty &&= (piece.pieceType != PieceType.EMPTY);

				if ( piece.pieceType == PieceType.NORMAL )
				{
					hasPieceId &&= (piece.pieceId);
					addedToLevelModel &&= (gameManager.levelModel.pieces.indexOf( piece ) != -1);
				}
			}

			Assert.assertTrue( isNotEmpty );
			Assert.assertTrue( hasPieceId );
			Assert.assertTrue( addedToLevelModel );
		}

		[Test]
		public function testDropOneSingleLine():void
		{
			var firstLine:Vector.<PieceData> = new Vector.<PieceData>();
			var piece:PieceData;
			var result:Boolean = true;

			for ( var col:int = 0; col < gameManager.grid.maxCols; col++ )
			{
				piece = new PieceData( col, 0, PieceType.NORMAL, PieceIds.BLUE );
				firstLine.push( piece );
				gameManager.grid.setPiece( piece );
			}

			gameManager.dropPieces();

			var secondLine:Vector.<PieceData> = GridUtils.getRow( gameManager.grid, 1 );

			for ( var i:int = 0; i < firstLine.length; i++ )
			{
				result &&= (secondLine.indexOf( firstLine[i] ) != -1);
			}

			Assert.assertTrue( result );
		}

		[Test]
		public function testRemovePiece():void
		{
			var col:int = 3;
			var row:int = 2;
			var piece:PieceData = new PieceData( col, row, PieceType.NORMAL, PieceIds.BLUE );

			gameManager.grid.setPiece( piece );
			gameManager.removePiece( piece );

			Assert.assertEquals( gameManager.levelModel.toRemove.pop(), piece );
			Assert.assertEquals( PieceType.EMPTY, gameManager.grid.getPiece( col, row ).pieceType );
		}

		[Test]
		public function testRemovePieceAndIncreaseScore():void
		{
			var piece:PieceData = new PieceData( 3, 2, PieceType.NORMAL, PieceIds.BLUE );

			gameManager.grid.setPiece( piece );
			gameManager.removePiece( piece );

			Assert.assertTrue( gameManager.levelModel.score > 0 );
		}

		[Test]
		public function testRemovePiecesInList():void
		{
			var pieces:Vector.<PieceData> = new Vector.<PieceData>();
			pieces.push( new PieceData( 1, 6, PieceType.NORMAL, PieceIds.BLUE ) );
			pieces.push( new PieceData( 2, 5, PieceType.NORMAL, PieceIds.GREEN ) );
			pieces.push( new PieceData( 3, 4, PieceType.NORMAL, PieceIds.ORANGE ) );
			pieces.push( new PieceData( 4, 3, PieceType.NORMAL, PieceIds.PINK ) );
			pieces.push( new PieceData( 5, 2, PieceType.NORMAL, PieceIds.LIGHT_BLUE ) );
			pieces.push( new PieceData( 6, 1, PieceType.NORMAL, PieceIds.YELLOW ) );

			for ( var i:int = 0; i < pieces.length; i++ )
			{
				gameManager.grid.setPiece( pieces[i] );
			}
			gameManager.removePiecesInList( pieces );

			var isEmpty:Boolean = true;
			var isInToRemoveList:Boolean = true;
			var piece:PieceData;

			for ( i = 0; i < pieces.length; i++ )
			{
				piece = pieces[i];

				isInToRemoveList &&= (gameManager.levelModel.toRemove.indexOf( piece ) != -1);
				isEmpty &&= PieceType.EMPTY == gameManager.grid.getPiece( piece.col, piece.row ).pieceType
			}
			Assert.assertTrue( isInToRemoveList );
			Assert.assertTrue( isEmpty );
		}

		[Test]
		public function testRemovePiecesInListWithPowerUp():void
		{
			var pieces:Vector.<PieceData> = GridUtils.spawnNewLine( gameManager.grid, 0 );

			var powerUpRow:PieceData = PieceUtils.getNewPowerUpPiece( 0, 0, PieceType.ROW, PieceIds.BLUE );
			gameManager.grid.setPiece( powerUpRow );
			pieces[0] = powerUpRow;

			gameManager.removePiecesInList( pieces );

			var isEmpty:Boolean = true;
			var isInToRemoveList:Boolean = true;
			var piece:PieceData;

			for ( var i:int = 0; i < pieces.length; i++ )
			{
				piece = pieces[i];

				isInToRemoveList &&= (gameManager.levelModel.toRemove.indexOf( piece ) != -1);
				isEmpty &&= PieceType.EMPTY == gameManager.grid.getPiece( piece.col, piece.row ).pieceType
			}
			Assert.assertTrue( isInToRemoveList );
			Assert.assertTrue( isEmpty );
		}

		[Test]
		public function testRemoveAllPieces():void
		{
			var map:Array = [//-
				[1, 2, 3, 1, 2, 3, 1, 2],//0
				[1, 4, 4, 4, 3, 6, 2, 3],//1
				[1, 1, 1, 3, 1, 6, 3, 2],//2
				[1, 2, 3, 1, 2, 6, 1, 2],//3
				[2, 3, 1, 2, 3, 6, 2, 3],//4
				[3, 1, 2, 5, 5, 5, 5, 2],//5
				[1, 2, 3, 1, 2, 3, 1, 2],//6
				[2, 3, 1, 2, 3, 1, 2, 3],//7
			];

			GridUtils.generate( gameManager.grid, map );

			gameManager.removeAllPieces();

			var pieces:Vector.<PieceData> = GridUtils.getAllPieces( gameManager.grid );
			var isEmpty:Boolean = true;
			var piece:PieceData;

			for ( var i:int = 0; i < pieces.length; i++ )
			{
				piece = pieces[i];

				isEmpty &&= PieceType.EMPTY == gameManager.grid.getPiece( piece.col, piece.row ).pieceType
			}
			Assert.assertEquals( 64, pieces.length );
			Assert.assertEquals( 64, gameManager.levelModel.toRemove.length );
			Assert.assertTrue( isEmpty );
		}
	}
}
