package setzer.matchthree.config
{
	import robotlegs.bender.extensions.mediatorMap.api.IMediatorMap;
	import robotlegs.bender.extensions.palidor.starlingIntegration.flowManager.api.IFlowManager;
	import robotlegs.bender.framework.api.IConfig;
	import robotlegs.bender.framework.api.IContext;

	import setzer.matchthree.events.FlowEvent;
	import setzer.matchthree.mediators.OptionsViewMediator;
	import setzer.matchthree.mediators.YouWinPopupMediator;
	import setzer.matchthree.mediators.GameOverPopupMediator;
	import setzer.matchthree.mediators.GameViewMediator;
	import setzer.matchthree.mediators.GridFieldComponentMediator;
	import setzer.matchthree.mediators.HUDGameComponentMediator;
	import setzer.matchthree.mediators.HomeViewMediator;
	import setzer.matchthree.mediators.IntroViewMediator;
	import setzer.matchthree.mediators.LevelSelectViewMediator;
	import setzer.matchthree.mediators.PausePopupMediator;
	import setzer.matchthree.mediators.AlertPopupMediator;
	import setzer.matchthree.mediators.StartingPopupMediator;
	import setzer.matchthree.services.FlowService;
	import setzer.matchthree.views.OptionsView;
	import setzer.matchthree.views.YouWinPopup;
	import setzer.matchthree.views.GameOverPopup;
	import setzer.matchthree.views.GameView;
	import setzer.matchthree.views.HomeView;
	import setzer.matchthree.views.IntroView;
	import setzer.matchthree.views.LevelSelectView;
	import setzer.matchthree.views.PausePopup;
	import setzer.matchthree.views.AlertPopup;
	import setzer.matchthree.views.StartingPopup;
	import setzer.matchthree.views.components.GridFieldComponent;
	import setzer.matchthree.views.components.HUDGameComponent;

	import starling.events.EventDispatcher;

	public class ViewsConfig implements IConfig
	{
		[Inject]
		public var eventDispatcher:EventDispatcher;

		[Inject]
		public var mediatorMap:IMediatorMap;

		[Inject]
		public var context:IContext;

		[Inject]
		public var flowManager:IFlowManager;

		public function configure():void
		{
			context.afterInitializing( init );
		}

		private function init():void
		{
			mapServices();
			mapMediators();
			mapFlowManager();

			eventDispatcher.dispatchEvent( new FlowEvent( FlowEvent.SHOW_INTRO_VIEW ) );
		}

		private function mapServices():void
		{
			context.injector.map( FlowService ).asSingleton();
		}

		private function mapMediators():void
		{
			mediatorMap.map( IntroView ).toMediator( IntroViewMediator );
			mediatorMap.map( HomeView ).toMediator( HomeViewMediator );
			mediatorMap.map( LevelSelectView ).toMediator( LevelSelectViewMediator );
			mediatorMap.map( GameView ).toMediator( GameViewMediator );

			mediatorMap.map( HUDGameComponent ).toMediator( HUDGameComponentMediator );
			mediatorMap.map( GridFieldComponent ).toMediator( GridFieldComponentMediator );

			mediatorMap.map( OptionsView ).toMediator( OptionsViewMediator );
			mediatorMap.map( AlertPopup ).toMediator( AlertPopupMediator );
			mediatorMap.map( StartingPopup ).toMediator( StartingPopupMediator );

			mediatorMap.map( PausePopup ).toMediator( PausePopupMediator );
			mediatorMap.map( GameOverPopup ).toMediator( GameOverPopupMediator );
			mediatorMap.map( YouWinPopup ).toMediator( YouWinPopupMediator );
		}

		private function mapFlowManager():void
		{
			flowManager.map( FlowEvent.SHOW_INTRO_VIEW ).toView( IntroView );
			flowManager.map( FlowEvent.SHOW_HOME_VIEW ).toView( HomeView );
			flowManager.map( FlowEvent.SHOW_LEVEL_SELECT_VIEW ).toView( LevelSelectView );
			flowManager.map( FlowEvent.SHOW_GAME_VIEW ).toView( GameView );
			flowManager.map( FlowEvent.SHOW_OPTIONS_VIEW ).toView( OptionsView );

			flowManager.map( FlowEvent.SHOW_ALERT_POPUP ).toFloatingView( AlertPopup );
			flowManager.map( FlowEvent.SHOW_PAUSE_POPUP ).toFloatingView( PausePopup );
			flowManager.map( FlowEvent.SHOW_STARTING_POPUP ).toFloatingView( StartingPopup );
			flowManager.map( FlowEvent.SHOW_GAME_OVER_POPUP ).toFloatingView( GameOverPopup );
			flowManager.map( FlowEvent.SHOW_YOU_WIN_POPUP ).toFloatingView( YouWinPopup );
		}
	}
}
