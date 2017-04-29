package setzer.matchthree.views
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Button;
	import starling.display.Sprite;

	public class GameOverPopup extends Sprite
	{
		private var _levelSelectButton:Button;
		private var _retryButton:Button;

		public function GameOverPopup()
		{
			createBackground();
			createText();
			createButtons();
		}

		private function createBackground():void
		{
			addChild( StarlingFactory.getShadowBackground( .9 ) );
		}

		private function createText():void
		{
			addChild( StarlingFactory.getTitle( Texts.GAME_OVER ) );
		}

		private function createButtons():void
		{
			_retryButton = StarlingFactory.getIconButton( AtlasKeys.ICON_RETRY );
			_retryButton.alignPivot();
			_retryButton.x = ViewPortSize.HALF_WIDTH - _retryButton.width * .5 - 4;
			_retryButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			addChild( _retryButton );

			_levelSelectButton = StarlingFactory.getIconButton( AtlasKeys.ICON_LEVEL_SELECT );
			_levelSelectButton.alignPivot();
			_levelSelectButton.x = ViewPortSize.HALF_WIDTH + _levelSelectButton.width * .5 + 4;
			_levelSelectButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			addChild( _levelSelectButton );
		}

		public function get retryButton():Button
		{
			return _retryButton;
		}

		public function get levelSelectButton():Button
		{
			return _levelSelectButton;
		}
	}
}
