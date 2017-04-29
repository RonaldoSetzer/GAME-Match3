package setzer.matchthree.views
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;
	import setzer.matchthree.views.components.IconButton;
	import setzer.matchthree.views.components.LevelSelectButton;

	import starling.display.Button;
	import starling.display.Sprite;

	public class LevelSelectView extends Sprite
	{
		private var _backButton:Button;

		public function LevelSelectView()
		{
			createBackground();
			createText();
			createButton();
		}

		private function createBackground():void
		{
			addChild( StarlingFactory.getBackground() );
			addChild( StarlingFactory.getBackgroundPopup() );
		}

		private function createText():void
		{
			addChild( StarlingFactory.getTitle( Texts.LEVEL_SELECT ) );
		}

		private function createButton():void
		{
			_backButton = StarlingFactory.getIconButton( AtlasKeys.ICON_HOME, IconButton.TYPE_MEDIUM );
			_backButton.x = ViewPortSize.HALF_WIDTH;
			_backButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			_backButton.alignPivot();
			addChild( _backButton );
		}

		public function createLevelButton( text:String ):LevelSelectButton
		{
			var level:LevelSelectButton = StarlingFactory.getLevelSelectButton();
			level.text = text;
			addChild( level );

			return level;
		}

		public function get backButton():Button
		{
			return _backButton;
		}
	}
}
