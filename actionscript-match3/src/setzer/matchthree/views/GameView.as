package setzer.matchthree.views
{
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.views.components.GridFieldComponent;
	import setzer.matchthree.views.components.HUDGameComponent;

	import starling.display.Sprite;

	public class GameView extends Sprite
	{
		private var _gridField:GridFieldComponent;
		private var _hudComponent:HUDGameComponent;

		public function GameView()
		{
			createBackground();
		}

		private function createBackground():void
		{
			addChild( StarlingFactory.getBackground() );
		}

		public function destroy():void
		{
			removeChild( _gridField );
			removeChild( _hudComponent );

			_gridField = null;
			_hudComponent = null;
		}

		public function createComponents():void
		{
			_hudComponent = new HUDGameComponent();
			addChild( _hudComponent );

			_gridField = new GridFieldComponent();
			addChild( _gridField );
		}

		public function get gridField():GridFieldComponent
		{
			return _gridField;
		}
	}
}
