package setzer.matchthree.game.utils
{
	import org.flexunit.Assert;

	import setzer.matchthree.game.models.GridData;
	import setzer.matchthree.game.models.PieceData;
	import setzer.matchthree.game.models.Tile;

	public class GridUtilsTest
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
		public function testSwapPieces():void
		{
			var piece1:PieceData = grid.getPiece( 0, 0 );
			var piece2:PieceData = grid.getPiece( 1, 1 );

			GridUtils.swapPieces( grid, piece1, piece2 );

			Assert.assertEquals( piece1, grid.getPiece( 1, 1 ) );
			Assert.assertEquals( piece2, grid.getPiece( 0, 0 ) );
		}

		[Test]
		public function testGetCol():void
		{
			var column:Vector.<PieceData> = new Vector.<PieceData>();
			var col:int = 2;
			var newPiece:PieceData;
			var resultContains:Boolean = true;
			var resultPosition:Boolean = true;

			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				newPiece = new PieceData( col, row );
				column.push( newPiece );
				grid.setPiece( newPiece );
			}

			var columnGet:Vector.<PieceData> = GridUtils.getCol( grid, col );

			for each ( var piece:PieceData in columnGet )
			{
				resultPosition &&= (piece.col == col);
				resultContains &&= (column.indexOf( piece ) != -1);
			}

			Assert.assertTrue( resultPosition );
			Assert.assertTrue( resultContains );
			Assert.assertTrue( column.length, columnGet.length );
		}

		[Test]
		public function testGetRow():void
		{
			var line:Vector.<PieceData> = new Vector.<PieceData>();
			var row:int = 2;
			var newPiece:PieceData;
			var resultContains:Boolean = true;
			var resultPosition:Boolean = true;

			for ( var col:int = 0; col < grid.maxCols; col++ )
			{
				newPiece = new PieceData( col, row );
				line.push( newPiece );
				grid.setPiece( newPiece );
			}

			var lineGet:Vector.<PieceData> = GridUtils.getRow( grid, row );

			for each ( var piece:PieceData in lineGet )
			{
				resultPosition &&= (piece.row == row);
				resultContains &&= (line.indexOf( piece ) != -1);
			}

			Assert.assertTrue( resultPosition );
			Assert.assertTrue( resultContains );
			Assert.assertTrue( line.length, lineGet.length );
		}

		[Test]
		public function testGetAllPiecesById():void
		{
			var createdPieces:Vector.<PieceData> = new Vector.<PieceData>();
			var row:int = 2;
			var newPiece:PieceData;
			var resultContains:Boolean = true;

			for ( var col:int = 0; col < grid.maxCols; col++ )
			{
				newPiece = new PieceData( col, row, PieceType.NORMAL, PieceIds.BLUE );
				createdPieces.push( newPiece );
				grid.setPiece( newPiece );
			}

			var piecesGet:Vector.<PieceData> = GridUtils.getAllPiecesById( grid, PieceIds.BLUE );

			for each ( var piece:PieceData in piecesGet )
			{
				resultContains &&= (createdPieces.indexOf( piece ) != -1);
			}

			Assert.assertTrue( resultContains );
			Assert.assertTrue( createdPieces.length, piecesGet.length );
		}

		[Test]
		public function testHasEmptyPiece():void
		{
			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				for ( var col:int = 0; col < grid.maxCols; col++ )
				{
					grid.setPiece( new PieceData( col, row, PieceType.NORMAL, PieceIds.BLUE ) );
				}
			}

			Assert.assertFalse( GridUtils.hasEmptyPiece( grid ) );
			Assert.assertTrue( GridUtils.hasEmptyPiece( new GridData() ) );
		}

		[Test]
		public function testRemovePiece():void
		{
			var piece:PieceData = new PieceData( 0, 0, PieceType.NORMAL, PieceIds.BLUE );
			grid.setPiece( piece );

			GridUtils.removePiece( grid, piece );

			Assert.assertEquals( PieceType.EMPTY, grid.getPiece( 0, 0 ).pieceType );
			Assert.assertFalse( piece == grid.getPiece( 0, 0 ) );
		}

		[Test]
		public function testRemovePieces():void
		{
			var pieces:Vector.<PieceData> = new Vector.<PieceData>();
			var tiles:Vector.<Tile> = new Vector.<Tile>();
			var piece:PieceData;
			var tile:Tile;
			var rndCols:int;
			var resultEmpty:Boolean = true;
			var resultNotEqualsPiece:Boolean = true;

			for ( var row:int = 0; row < grid.maxRows; row++ )
			{
				rndCols = Math.floor( grid.maxCols * Math.random() );
				tile = new Tile( rndCols, row );
				piece = PieceUtils.getNewNormalPiece( rndCols, row );

				grid.setPiece( piece );

				tiles.push( tile );
				pieces.push( piece );

			}

			GridUtils.removePieces( grid, pieces );

			for ( var i:int = 0; i < tiles.length; i++ )
			{
				resultEmpty &&= (PieceType.EMPTY == grid.getPiece( tiles[i].col, tiles[i].row ).pieceType);
				resultNotEqualsPiece &&= !(pieces[i] == grid.getPiece( tiles[i].col, tiles[i].row ));
			}

			Assert.assertTrue( resultEmpty );
			Assert.assertTrue( resultNotEqualsPiece );
		}

		[Test]
		public function testGetAllChains():void
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

			GridUtils.generate( grid, map );

			Assert.assertEquals( 5, GridUtils.getAllChains( grid ).length );
		}

		[Test]
		public function testGetHorizontalChains():void
		{
			var line1:Array = [1, 1, 1, 2, 1, 1, 1, 2];
			var line2:Array = [1, 1, 2, 2, 2, 1, 1, 2];
			var line3:Array = [3, 3, 3, 2, 3, 3, 3, 3];
			var list:Array = [line1, line2, line3];

			var piece:PieceData;

			for ( var row:int = 0; row < list.length; row++ )
			{
				for ( var col:int = 0; col < list[row].length; col++ )
				{
					piece = PieceUtils.getNewNormalPiece( col, row, list[row][col] );
					grid.setPiece( piece );
				}
			}
			Assert.assertEquals( 2, GridUtils.getHorizontalChains( grid, 0 ).length );
			Assert.assertEquals( 1, GridUtils.getHorizontalChains( grid, 1 ).length );
			Assert.assertEquals( 2, GridUtils.getHorizontalChains( grid, 2 ).length );
		}

		[Test]
		public function testGetVerticalChains():void
		{
			var column1:Array = [1, 1, 1, 2, 1, 1, 1, 2];
			var column2:Array = [1, 1, 2, 2, 2, 1, 1, 2];
			var column3:Array = [3, 3, 3, 2, 3, 3, 3, 3];
			var list:Array = [column1, column2, column3];

			var piece:PieceData;

			for ( var col:int = 0; col < list.length; col++ )
			{
				for ( var row:int = 0; row < list[col].length; row++ )
				{
					piece = PieceUtils.getNewNormalPiece( col, row, list[col][row] );
					grid.setPiece( piece );
				}
			}
			Assert.assertEquals( 2, GridUtils.getVerticalChains( grid, 0 ).length );
			Assert.assertEquals( 1, GridUtils.getVerticalChains( grid, 1 ).length );
			Assert.assertEquals( 2, GridUtils.getVerticalChains( grid, 2 ).length );
		}

		[Test]
		public function testGetChainWithPiece():void
		{
			var map:Array = [//-
				[1, 4, 3, 1, 2, 3, 1, 2],//0
				[2, 4, 1, 5, 3, 1, 2, 3],//1
				[3, 4, 2, 5, 1, 2, 3, 1],//2
				[1, 4, 5, 5, 5, 3, 1, 2],//3
				[2, 3, 1, 5, 3, 1, 2, 3],//4
				[3, 1, 2, 5, 1, 2, 3, 6],//5
				[1, 2, 3, 1, 2, 3, 1, 6],//6
				[2, 3, 1, 2, 3, 6, 6, 6]//7
			];

			GridUtils.generate( grid, map );

			Assert.assertEquals( 4, GridUtils.getChainWithPiece( grid, grid.getPiece( 1, 0 ) ).length );
			Assert.assertEquals( 8, GridUtils.getChainWithPiece( grid, grid.getPiece( 3, 3 ) ).length );
			Assert.assertEquals( 5, GridUtils.getChainWithPiece( grid, grid.getPiece( 3, 1 ) ).length );
			Assert.assertEquals( 6, GridUtils.getChainWithPiece( grid, grid.getPiece( 7, 7 ) ).length );
			Assert.assertEquals( 3, GridUtils.getChainWithPiece( grid, grid.getPiece( 7, 5 ) ).length );
			Assert.assertEquals( 3, GridUtils.getChainWithPiece( grid, grid.getPiece( 5, 7 ) ).length );
		}

		[Test]
		public function testGetAllPieces():void
		{
			Assert.assertEquals( grid.maxCols * grid.maxRows, GridUtils.getAllPieces( grid ).length );
		}

		[Test]
		public function testSpwanNewLine():void
		{
			var resultLine1:Boolean = true;
			var resultLine2:Boolean = true;

			var line1:Vector.<PieceData> = GridUtils.spawnNewLine( grid, 0 );
			var line2:Vector.<PieceData> = GridUtils.spawnNewLine( grid, 3 );

			for ( var col:int = 0; col < grid.maxCols; col++ )
			{
				resultLine1 &&= (grid.getPiece( col, 0 ).pieceType == PieceType.NORMAL);
				resultLine2 &&= (grid.getPiece( col, 3 ).pieceType == PieceType.NORMAL);
			}

			Assert.assertEquals( grid.maxCols, line1.length );
			Assert.assertEquals( grid.maxCols, line2.length );
			Assert.assertTrue( resultLine1 );
			Assert.assertTrue( resultLine2 );
		}
	}
}
