package setzer.matchthree.mediators
{
	import flash.events.TimerEvent;
	import flash.utils.Timer;

	import robotlegs.bender.extensions.palidor.starlingIntegration.starlingViewMap.impl.StarlingMediator;

	import setzer.matchthree.events.GameEvent;
	import setzer.matchthree.game.models.GameStatus;
	import setzer.matchthree.game.models.LevelInfo;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.services.GameService;
	import setzer.matchthree.views.components.HUDGameComponent;

	import starling.events.Event;

	public class HUDGameComponentMediator extends StarlingMediator
	{
		[Inject]
		public var view:HUDGameComponent;

		[Inject]
		public var levelModel:LevelModel;
		[Inject]
		public var gameStatus:GameStatus;

		[Inject]
		public var gameService:GameService;

		[Inject]
		public var flowService:FlowService;

		private var clock:Timer;

		override public function initialize():void
		{
			eventMap.mapListener( view.pauseButton, Event.TRIGGERED, pauseButton_onTriggeredHandler );
			eventMap.mapListener( eventDispatcher, GameEvent.UPDATE_HUD_DATA, game_onUpdateHandler );
			clock = new Timer( 1000 );

			setupHUDType();
		}

		private function setupHUDType():void
		{
			if ( levelModel.levelInfo.levelType == LevelInfo.TIMER_TYPE )
			{
				view.setTimerType();
				eventMap.mapListener( eventDispatcher, GameEvent.RESUME, game_onResumeHandler );
				clock.addEventListener( TimerEvent.TIMER, clock_onTimerHandler );
			} else
			{
				view.setMoveType();
			}
		}

		private function game_onResumeHandler( e:Event ):void
		{
			clock.start();
		}

		private function clock_onTimerHandler( e:TimerEvent ):void
		{
			levelModel.clock--;
			view.updateValues( levelModel );

			if ( levelModel.levelInfo.levelType == LevelInfo.TIMER_TYPE && levelModel.clock == 0 )
			{
				if ( gameStatus.hasToWait )
					gameService.gameOver();//
				else
					gameService.gameOverCommand();

				clock.stop();
			}
		}

		private function game_onUpdateHandler( e:Event ):void
		{
			view.updateValues( levelModel );
		}

		private function pauseButton_onTriggeredHandler( e:Event ):void
		{
			clock.stop();
			flowService.showPausePopup();
		}

		override public function destroy():void
		{
			eventMap.unmapListeners();
		}
	}
}
