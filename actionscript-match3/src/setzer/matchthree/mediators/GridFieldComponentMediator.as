package setzer.matchthree.mediators
{
	import flash.utils.Dictionary;

	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.events.GameEvent;
	import setzer.matchthree.game.managers.GameManager;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.game.models.PieceData;
	import setzer.matchthree.game.models.Tile;
	import setzer.matchthree.game.utils.AnimationUtils;
	import setzer.matchthree.services.GameService;
	import setzer.matchthree.views.components.GridFieldComponent;

	import starling.events.Event;
	import starling.events.Touch;
	import starling.events.TouchEvent;
	import starling.events.TouchPhase;

	public class GridFieldComponentMediator extends StarlingMediator
	{
		[Inject]
		public var view:GridFieldComponent;

		[Inject]
		public var levelModel:LevelModel;

		[Inject]
		public var gameManager:GameManager;

		[Inject]
		public var gameService:GameService;

		private var _displays:Dictionary;

		override public function initialize():void
		{
			_displays = new Dictionary();
			view.generateGrid( levelModel.maxCols, levelModel.maxRows );

			eventMap.mapListener( eventDispatcher, GameEvent.CLEAR_GRID, game_onClearGridHandler );
			eventMap.mapListener( eventDispatcher, GameEvent.UPDATE_GRID, game_onUpdateGridHandler );
			eventMap.mapListener( view, TouchEvent.TOUCH, view_onSelectPiecesHandler );

			gameManager.nextStep();
		}

		private function view_onSelectPiecesHandler( e:TouchEvent ):void
		{
			if ( levelModel.toMove.length || levelModel.toRemove.length || levelModel.toAdd.length ) return;

			var touch:Touch = e.getTouch( view );

			if ( touch != null )
			{
				var col:int;
				var row:int;

				if ( touch.phase == TouchPhase.BEGAN && e.touches.length > 0 )
				{
					col = Math.floor( (e.touches[0].globalX - (view.x - Tile.TILE_WIDTH * .5)) / Tile.TILE_WIDTH );
					row = Math.floor( (e.touches[0].globalY - (view.y - Tile.TILE_HEIGHT * .5)) / Tile.TILE_HEIGHT );

					gameService.swapPiecesCommand( TouchPhase.BEGAN, col, row );

				} else if ( touch.phase == TouchPhase.ENDED && e.touches.length > 0 )
				{
					col = Math.floor( (e.touches[0].globalX - (view.x - Tile.TILE_WIDTH * .5)) / Tile.TILE_WIDTH );
					row = Math.floor( (e.touches[0].globalY - (view.y - Tile.TILE_HEIGHT * .5)) / Tile.TILE_HEIGHT );

					gameService.swapPiecesCommand( TouchPhase.ENDED, col, row );
				}
			}
		}

		private function game_onClearGridHandler( e:Event ):void
		{
			for ( var piece:PieceData in _displays )
			{
				removeDisplayFromStage( piece );
			}
		}

		private function game_onUpdateGridHandler( e:Event ):void
		{
			updateDisplays();
		}

		public function updateDisplays():void
		{
			if ( levelModel.toRemove.length > 0 ) removeDisplays(); //
			else if ( levelModel.toAdd.length > 0 ) addDisplays(); //
			else if ( levelModel.toMove.length > 0 ) moveDisplays();
		}

		public function addDisplays():void
		{
			var piece:PieceData;
			while ( levelModel.toAdd.length > 0 )
			{
				piece = levelModel.toAdd.pop();
				if ( _displays[piece] ) continue;

				piece.createDisplay();
				addDisplayToStage( piece );
			}
			gameManager.nextStep();
		}

		public function removeDisplays():void
		{
			var piece:PieceData;
			var animationList:Array = [];

			while ( levelModel.toRemove.length > 0 )
			{
				piece = levelModel.toRemove.pop();

				levelModel.removePiece( piece );
				delete _displays[piece];

				animationList.push( AnimationUtils.createRemoveTween( piece ) );
			}
			AnimationUtils.applyAnimation( animationList, gameManager.nextStep );
		}

		public function moveDisplays():void
		{
			var animationList:Array = [];

			while ( levelModel.toMove.length > 0 )
			{
				animationList.push( AnimationUtils.createMoveTween( levelModel.toMove.pop() ) );
			}
			AnimationUtils.applyAnimation( animationList, gameManager.nextStep );
		}

		public function addDisplayToStage( piece:PieceData ):void
		{
			view.addChild( piece.display );
			_displays[piece] = piece.display;
		}

		public function removeDisplayFromStage( piece:PieceData ):void
		{
			piece.display.removeFromParent();
			delete  _displays[piece];
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
