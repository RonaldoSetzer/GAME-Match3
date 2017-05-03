package setzer.matchthree.game.managers
{
	import setzer.matchthree.game.models.GameStatus;
	import setzer.matchthree.game.models.GridData;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.game.models.PieceData;
	import setzer.matchthree.game.models.SwapModel;
	import setzer.matchthree.game.utils.GridUtils;
	import setzer.matchthree.game.utils.PieceType;
	import setzer.matchthree.game.utils.PieceUtils;
	import setzer.matchthree.game.utils.PowerUpUtils;
	import setzer.matchthree.services.GameService;

	public class GameManager
	{

		[Inject]
		public var levelModel:LevelModel;

		[Inject]
		public var gameStatus:GameStatus;

		[Inject]
		public var gameService:GameService;

		[Inject]
		public var swapModel:SwapModel;

		private var _grid:GridData;

		public function generateGrid( maxCols:int, maxRows:int ):void
		{
			_grid = new GridData( maxCols, maxRows );
			swapModel.setMaxValues( _grid.maxCols, _grid.maxRows );
		}

		public function nextStep():void
		{
			//SWAP
			if ( swapModel.status == SwapModel.SWAP || swapModel.status == SwapModel.ROLLBACK )
			{
				swapModel.updateStatus();
				swapSelectedPieces();

				return;

			} else if ( swapModel.status == SwapModel.VALIDATE )
			{
				swapModel.updateStatus();
				validateSwap();

				return;
			}

			//UDPATE VIEW - ADD - MOVE - REMOVE
			if ( levelModel.toAdd.length || levelModel.toMove.length || levelModel.toRemove.length )
			{
				gameService.updateGridField();
				return;
			}

			//STAND BY MODE
			if ( GridUtils.hasEmptyPiece( grid ) )
			{
				fillStep();
			} else
			{
				gameStatus.hasToWait = removeAllChains();
				if ( gameStatus.hasToWait == false && gameStatus.isGameOver )
					gameService.gameOverCommand();
			}
			gameService.updateGridField();
		}

		private function validateSwap():void
		{
			var needToRollback:Boolean = false;

			var piece1:PieceData = grid.getPiece( swapModel.first.col, swapModel.first.row );
			var piece2:PieceData = grid.getPiece( swapModel.second.col, swapModel.second.row );

			if ( piece1.pieceType == PieceType.RAINBOW && piece2.pieceType == PieceType.RAINBOW )
			{
				removeAllPieces();

			} else if ( piece1.pieceType == PieceType.RAINBOW || piece2.pieceType == PieceType.RAINBOW )
			{
				var pieceId:int = (piece1.pieceType == PieceType.RAINBOW) ? piece2.pieceId : piece1.pieceId;
				piece1.pieceId = pieceId;
				piece2.pieceId = pieceId;
				removePiecesInList( new <PieceData>[piece1, piece2] );

			} else if ( (piece1.pieceType == PieceType.COL || piece1.pieceType == PieceType.ROW) //
					&& (piece2.pieceType == PieceType.COL || piece2.pieceType == PieceType.ROW) )
			{
				removePiecesInList( new <PieceData>[piece1, piece2] );

			} else
			{
				var chain1:Vector.<PieceData> = GridUtils.getChainWithPiece( grid, piece1 );
				var chain2:Vector.<PieceData> = GridUtils.getChainWithPiece( grid, piece2 );
				var hasChain:Boolean = chain2.length || chain1.length;

				if ( hasChain )
					removeAllChains( new <Vector.<PieceData>>[chain1, chain2] ); //
				else
					needToRollback = true;
			}
			if ( needToRollback )
				swapModel.status = SwapModel.ROLLBACK; //
			else
				gameService.swapPiecesConfirmCommand();

			nextStep();
		}

		public function removeAllPieces():void
		{
			removePiecesInList( GridUtils.getAllPieces( grid ) );
			gameService.updateHUDData();
		}

		public function removeAllChains( chains:Vector.<Vector.<PieceData>> = null ):Boolean
		{
			chains ||= GridUtils.getAllChains( grid );
			var willRemoveSomething:Boolean = chains.length;

			var rndIndex:Number;
			var powerUp:PieceData;
			var toAdd:Vector.<PieceData> = new Vector.<PieceData>();

			for ( var i:int = 0; i < chains.length; i++ )
			{
				if ( chains[i].length > 3 )
				{
					rndIndex = Math.floor( Math.random() * chains[i].length );
					powerUp = PieceUtils.getNewPowerByChainLength( chains[i].length, chains[i][rndIndex] );
					if ( powerUp ) toAdd.push( powerUp );
				}
				removePiecesInList( chains[i] );
			}
			while ( toAdd.length > 0 )
			{
				createPowerUp( toAdd.pop() );
			}

			gameService.updateHUDData();

			return willRemoveSomething;
		}

		public function removePiecesInList( piecesToRemove:Vector.<PieceData> ):void
		{
			var piece:PieceData;
			while ( piecesToRemove.length > 0 )
			{
				piece = piecesToRemove.pop();

				piecesToRemove = piecesToRemove.concat( PowerUpUtils.getPiecesAffectedByPowerUp( piece, grid ) );

				if ( piece.pieceType == PieceType.EMPTY ) continue;

				removePiece( piece );
			}
		}

		public function removePiece( piece:PieceData ):void
		{
			levelModel.updateScoreByPieceType( piece.pieceType );
			levelModel.addToRemoveList( piece );
			GridUtils.removePiece( _grid, piece );
		}

		public function fillStep():void
		{
			dropPieces();
			createNewPiecesAbove();
		}

		public function dropPieces():void
		{
			var piece:PieceData;
			var pieceBellow:PieceData;

			for ( var row:int = _grid.maxRows - 2; row >= 0; row-- )
			{
				for ( var col:int = 0; col < _grid.maxCols; col++ )
				{
					piece = grid.getPiece( col, row );
					pieceBellow = grid.getPiece( col, row + 1 );

					if ( pieceBellow.pieceType == PieceType.EMPTY && piece.pieceType != PieceType.EMPTY )
					{
						GridUtils.swapPieces( grid, piece, pieceBellow );
						levelModel.addToMoveList( piece );
					}
				}
			}
		}

		public function createNewPiecesAbove():void
		{
			var topLine:int = 0;
			var pieces:Vector.<PieceData> = GridUtils.spawnNewRow( grid, topLine );

			for ( var i:int = 0; i < pieces.length; i++ )
			{
				levelModel.addPiece( pieces[i] );
				levelModel.addToMoveList( pieces[i] );
			}
		}

		public function createPowerUp( powerUp:PieceData ):void
		{
			_grid.setPiece( powerUp );
			levelModel.addPiece( powerUp );
			levelModel.addToMoveList( powerUp );
		}

		public function swapSelectedPieces():void
		{
			var piece1:PieceData = _grid.getPiece( swapModel.first.col, swapModel.first.row );
			var piece2:PieceData = _grid.getPiece( swapModel.second.col, swapModel.second.row );

			if ( !PieceUtils.IsAdjacent( piece1, piece2 ) )
			{
				swapModel.status = "";
				return;
			}

			GridUtils.swapPieces( _grid, piece1, piece2 );

			levelModel.addToMoveList( piece1 );
			levelModel.addToMoveList( piece2 );

			gameService.updateGridField();
		}

		public function get grid():GridData
		{
			return _grid;
		}
	}
}
