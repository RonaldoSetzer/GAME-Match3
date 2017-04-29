package setzer.matchthree.views
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Button;
	import starling.display.Sprite;

	public class PausePopup extends Sprite
	{
		private var _resumeButton:Button;
		private var _levelSelectButton:Button;
		private var _retryButton:Button;

		public function PausePopup()
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
			addChild( StarlingFactory.getTitle( Texts.PAUSED ) );
		}

		private function createButtons():void
		{
			_resumeButton = StarlingFactory.getIconButton( AtlasKeys.ICON_RESUME );
			_resumeButton.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_HUD;
			_resumeButton.y = MagicValues.BORDER_OFFSET_HUD;
			_resumeButton.pivotX = _resumeButton.width;
			addChild( _resumeButton );

			_retryButton = StarlingFactory.getIconButton( AtlasKeys.ICON_RETRY );
			_retryButton.x = ViewPortSize.HALF_WIDTH - _retryButton.width * .5 - 4;
			_retryButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			_retryButton.alignPivot();
			addChild( _retryButton );

			_levelSelectButton = StarlingFactory.getIconButton( AtlasKeys.ICON_LEVEL_SELECT );
			_levelSelectButton.x = ViewPortSize.HALF_WIDTH + _levelSelectButton.width * .5 + 4;
			_levelSelectButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			_levelSelectButton.alignPivot();
			addChild( _levelSelectButton );
		}

		public function get resumeButton():Button
		{
			return _resumeButton;
		}

		public function get levelSelectButton():Button
		{
			return _levelSelectButton;
		}

		public function get retryButton():Button
		{
			return _retryButton;
		}
	}
}