package setzer.matchthree.mediators
{
	import flash.utils.Dictionary;

	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.game.models.LevelInfo;
	import setzer.matchthree.game.utils.LevelsRepository;
	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.services.GameService;
	import setzer.matchthree.utils.SharedObjectManager;
	import setzer.matchthree.utils.ViewPortSize;
	import setzer.matchthree.views.LevelSelectView;
	import setzer.matchthree.views.components.LevelSelectButton;

	import starling.events.Event;

	public class LevelSelectViewMediator extends StarlingMediator
	{
		[Inject]
		public var view:LevelSelectView;

		[Inject]
		public var flowService:FlowService;

		[Inject]
		public var gameService:GameService;

		private var levelsIds:Dictionary;

		override public function initialize():void
		{
			SharedObjectManager.getExternalData();

			createMapButtons();
			eventMap.mapListener( view.backButton, Event.TRIGGERED, backButton_onTriggeredHandler );
		}

		private function createMapButtons():void
		{
			levelsIds = new Dictionary();
			var levels:Vector.<LevelInfo> = LevelsRepository.getLevels();
			var levelInfo:LevelInfo;
			var levelButton:LevelSelectButton;
			for ( var i:int = 0; i < levels.length; i++ )
			{
				levelInfo = levels[i];
				levelButton = view.createLevelButton( String( levelInfo.levelId + 1 ) );
				levelButton.x = ViewPortSize.HALF_WIDTH - (levelButton.width + 4) + (Math.floor( i % 3 ) * (levelButton.width + 4));
				levelButton.y = 180 + (Math.floor( i / 3 ) * (levelButton.height + 8));
				levelButton.setStars( levelInfo.getNumStars() );
				levelButton.alignPivot();
				levelsIds[levelButton] = levels[i].levelId;
				eventMap.mapListener( levelButton, Event.TRIGGERED, levelButton_onTriggeredHandler )
			}
		}

		private function backButton_onTriggeredHandler( e:Event ):void
		{
			flowService.setHomeView();
		}

		private function levelButton_onTriggeredHandler( e:Event ):void
		{
			gameService.createLevel( levelsIds[e.currentTarget] );
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
