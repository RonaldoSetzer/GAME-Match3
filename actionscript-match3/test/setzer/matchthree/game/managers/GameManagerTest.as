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
	import starling.events.TouchPhase;

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
		public function testGenerateGrid():void
		{
			gameManager = null;
			gameManager = new GameManager();
			gameManager.swapModel = new SwapModel();

			var maxCols:int = 4;
			var maxRows:int = 6;
			gameManager.generateGrid( maxCols, maxRows );

			Assert.assertNotNull( gameManager.grid );
			Assert.assertEquals( maxCols, gameManager.grid.maxCols );
			Assert.assertEquals( maxRows, gameManager.grid.maxRows );
		}

		[Test]
		public function testNextStepFillGrid():void
		{
			var count:int = 0;
			while ( GridUtils.hasEmptyPiece( gameManager.grid ) )
			{
				count++;
				gameManager.nextStep();
				gameManager.levelModel.toAdd.length = 0;
				gameManager.levelModel.toRemove.length = 0;
				gameManager.levelModel.toMove.length = 0;
			}
			Assert.assertTrue( count >= gameManager.grid.maxRows );
		}

		[Test]
		public function testFillStepOnce():void
		{
			var row:int = 0;
			var firstRow:Vector.<PieceData> = GridUtils.getRow( gameManager.grid, row );

			gameManager.fillStep();

			var firstRowAfter:Vector.<PieceData> = GridUtils.getRow( gameManager.grid, row );

			var wasEmpty:Boolean = true;
			var hasPieceAfterFillStep:Boolean = true;

			for ( var i:int = 0; i < gameManager.grid.maxCols; i++ )
			{
				wasEmpty &&= firstRow[i].pieceType == PieceType.EMPTY;
				hasPieceAfterFillStep &&= firstRowAfter[i].pieceType != PieceType.EMPTY;
			}

			Assert.assertTrue( wasEmpty );
			Assert.assertTrue( hasPieceAfterFillStep );
		}

		[Test]
		public function testFillStepTwice():void
		{
			var row:int = 0;
			gameManager.fillStep();

			var firstRowBefore:Vector.<PieceData> = GridUtils.getRow( gameManager.grid, row );

			gameManager.fillStep();
			var firstRowAfter:Vector.<PieceData> = GridUtils.getRow( gameManager.grid, row );
			var secondRowAfter:Vector.<PieceData> = GridUtils.getRow( gameManager.grid, row + 1 );

			var firstRowWasDroppedToSecondRow:Boolean = true;
			var firstRowAfterIsNotEmpty:Boolean = true;

			for ( var i:int = 0; i < gameManager.grid.maxCols; i++ )
			{
				firstRowAfterIsNotEmpty &&= firstRowAfter[i].pieceType != PieceType.EMPTY;
				firstRowWasDroppedToSecondRow &&= (secondRowAfter.indexOf( firstRowBefore[i] ) != -1);
			}

			Assert.assertTrue( firstRowWasDroppedToSecondRow );
			Assert.assertTrue( firstRowAfterIsNotEmpty );
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
		public function testCreatePowerUp():void
		{
			var powerUp:PieceData = PieceUtils.getNewPowerUpPiece( 0, 0, PieceType.COL, PieceIds.YELLOW );
			gameManager.createPowerUp( powerUp );

			Assert.assertEquals( powerUp, gameManager.grid.getPiece( powerUp.col, powerUp.row ) );
			Assert.assertTrue( gameManager.levelModel.toAdd.indexOf( powerUp ) != -1 );
			Assert.assertTrue( gameManager.levelModel.toMove.indexOf( powerUp ) != -1 );
		}

		[Test]
		public function testSwapSelectedPieces():void
		{
			var piece1col:int = 1;
			var piece2col:int = 2;
			var row:int = 1;
			var piece1:PieceData = PieceUtils.getNewNormalPiece( piece1col, row, PieceIds.YELLOW );
			var piece2:PieceData = PieceUtils.getNewNormalPiece( piece2col, row, PieceIds.GREEN );
			gameManager.grid.setPiece( piece1 );
			gameManager.grid.setPiece( piece2 );

			gameManager.swapModel.setPosition( TouchPhase.BEGAN, piece1.col, piece1.row );
			gameManager.swapModel.setPosition( TouchPhase.ENDED, piece2.col, piece2.row );

			gameManager.swapSelectedPieces();

			Assert.assertEquals( piece2col, piece1.col );
			Assert.assertEquals( piece1col, piece2.col );
			Assert.assertTrue( gameManager.levelModel.toMove.indexOf( piece1 ) != -1 );
			Assert.assertTrue( gameManager.levelModel.toMove.indexOf( piece2 ) != -1 );
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
		public function testRemoveAllChains():void
		{
			var map:Array = [//-
				[1, 2, 3, 1, 2, 3, 1, 2],//0
				[1, 4, 4, 4, 3, 6, 2, 3],//1
				[1, 1, 1, 3, 1, 6, 3, 2],//2
				[1, 2, 3, 1, 2, 6, 1, 2],//3
				[2, 3, 1, 2, 3, 6, 2, 3],//4
				[3, 1, 2, 5, 5, 5, 5, 2],//5
				[1, 2, 3, 1, 2, 3, 1, 2],//6
				[2, 3, 1, 2, 3, 1, 2, 3]//7
			];// 5 Chains

			GridUtils.generateByMap( gameManager.grid, map );

			var numAllChainsBefore:int = GridUtils.getAllChains( gameManager.grid ).length;

			gameManager.removeAllChains();

			var numAllChainsAfter:int = GridUtils.getAllChains( gameManager.grid ).length;

			Assert.assertTrue( numAllChainsBefore > 0 );
			Assert.assertTrue( numAllChainsAfter == 0 );
		}

		[Test]
		public function testRemoveAllChainsWithPowerUpRow():void
		{
			var map:Array = [//-
				[6, 2, 3, 1, 2, 3, 1, 2],//0
				[6, 4, 4, 4, 3, 6, 2, 3],//1
				[6, 1, 1, 1, 2, 6, 3, 2],//2
				[1, 2, 3, 1, 2, 6, 1, 2],//3
				[2, 3, 1, 2, 3, 4, 2, 3],//4
				[3, 1, 2, 5, 5, 5, 5, 2],//5
				[1, 2, 3, 1, 2, 3, 1, 2],//6
				[2, 3, 1, 2, 3, 1, 2, 3]//7
			];

			GridUtils.generateByMap( gameManager.grid, map );

			var row:int = 2;
			var powerUp:PieceData = PieceUtils.getNewPowerUpPiece( 2, row, PieceType.ROW, PieceIds.BLUE );

			gameManager.grid.setPiece( powerUp );
			gameManager.removeAllChains();

			var rowWithPowerUpEffect:Vector.<PieceData> = GridUtils.getRow( gameManager.grid, row );
			var isAllPiecesEmpty:Boolean = true;
			for ( var i:int = 0; i < rowWithPowerUpEffect.length; i++ )
			{
				isAllPiecesEmpty &&= (rowWithPowerUpEffect[i].pieceType == PieceType.EMPTY);

			}
			Assert.assertTrue( isAllPiecesEmpty );
		}

		[Test]
		public function testRemoveAllChainsWithPowerUpCol():void
		{
			var map:Array = [//-
				[6, 2, 3, 1, 2, 3, 1, 2],//0
				[6, 4, 4, 4, 3, 6, 2, 3],//1
				[6, 1, 1, 1, 2, 6, 3, 2],//2
				[1, 2, 3, 1, 2, 6, 1, 2],//3
				[2, 3, 1, 2, 3, 4, 2, 3],//4
				[3, 1, 2, 5, 5, 5, 5, 2],//5
				[1, 2, 3, 1, 2, 3, 1, 2],//6
				[2, 3, 1, 2, 3, 1, 2, 3]//7
			];

			GridUtils.generateByMap( gameManager.grid, map );

			var col:int = 0;
			var powerUp:PieceData = PieceUtils.getNewPowerUpPiece( col, 0, PieceType.COL, PieceIds.LIGHT_BLUE );

			gameManager.grid.setPiece( powerUp );
			gameManager.removeAllChains();

			var colWithPowerUpEffect:Vector.<PieceData> = GridUtils.getCol( gameManager.grid, col );
			var isAllPiecesEmpty:Boolean = true;
			for ( var i:int = 0; i < colWithPowerUpEffect.length; i++ )
			{
				isAllPiecesEmpty &&= (colWithPowerUpEffect[i].pieceType == PieceType.EMPTY);

			}
			Assert.assertTrue( isAllPiecesEmpty );
		}

		[Test]
		public function testRemoveAllChainsWithPowerUpRainbow():void
		{
			var map:Array = [//-
				[6, 2, 3, 1, 2, 3, 1, 2],//0
				[6, 4, 4, 4, 3, 6, 2, 3],//1
				[6, 1, 1, 1, 2, 6, 3, 2],//2
				[1, 2, 3, 1, 2, 6, 1, 2],//3
				[2, 3, 1, 2, 3, 4, 2, 3],//4
				[3, 1, 2, 5, 5, 5, 1, 2],//5
				[1, 2, 3, 1, 2, 3, 1, 2],//6
				[2, 3, 1, 2, 3, 1, 2, 3]//7
			];

			GridUtils.generateByMap( gameManager.grid, map );

			var col:int = 4;
			var row:int = 2;

			var powerUpRainbow:PieceData = PieceUtils.getNewPowerUpPiece( col, row, PieceType.RAINBOW, PieceIds.RAINBOW );
			gameManager.grid.setPiece( powerUpRainbow );

			var powerUpRow:PieceData = PieceUtils.getNewPowerUpPiece( col - 1, row, PieceType.ROW, PieceIds.BLUE );
			gameManager.grid.setPiece( powerUpRow );
			gameManager.removeAllChains();

			var isAllPiecesEmpty:Boolean = true;
			var colAndRowWithPowerUpEffect:Vector.<PieceData> = GridUtils.getCol( gameManager.grid, col );
			colAndRowWithPowerUpEffect = colAndRowWithPowerUpEffect.concat( GridUtils.getRow( gameManager.grid, row ) );

			for ( var i:int = 0; i < colAndRowWithPowerUpEffect.length; i++ )
			{
				isAllPiecesEmpty &&= (colAndRowWithPowerUpEffect[i].pieceType == PieceType.EMPTY);

			}
			Assert.assertTrue( isAllPiecesEmpty );
		}

		[Test]
		public function testRemoveAllChainsAndCreatePowerUp():void
		{
			var map:Array = [//-
				[6, 2, 3, 1, 2, 3, 1, 2],//0
				[6, 4, 4, 4, 3, 6, 2, 3],//1
				[6, 1, 1, 1, 1, 6, 3, 1],//2
				[6, 2, 3, 1, 2, 3, 1, 2],//3
				[2, 3, 6, 6, 6, 6, 6, 2],//4
				[3, 1, 2, 5, 5, 2, 2, 1],//5
				[1, 2, 3, 1, 2, 3, 1, 1],//6
				[2, 3, 1, 2, 3, 1, 2, 3]//7
			];
			/* PowerUps
				col:1 (Row or Col)
				row:2 (Row or Col)
				row:3 (Rainbow)
			* */
			GridUtils.generateByMap( gameManager.grid, map );
			gameManager.removeAllChains();

			var numPowerUps:int = 3;
			var allPowerUpsLength:int = GridUtils.getAllPowerUps( gameManager.grid ).length;

			Assert.assertEquals( numPowerUps, allPowerUpsLength );
		}

		[Test]
		public function testRemovePiecesInListWithPowerUp():void
		{
			var pieces:Vector.<PieceData> = GridUtils.spawnNewRow( gameManager.grid, 0 );

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
				[2, 3, 1, 2, 3, 4, 2, 3],//4
				[3, 1, 2, 5, 5, 5, 5, 2],//5
				[1, 2, 3, 1, 2, 3, 1, 2],//6
				[2, 3, 1, 2, 3, 1, 2, 3]//7
			];

			GridUtils.generateByMap( gameManager.grid, map );

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