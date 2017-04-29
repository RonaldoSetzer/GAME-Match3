package setzer.matchthree.views
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;
	import setzer.matchthree.views.components.IconButton;

	import starling.display.Button;
	import starling.display.Sprite;
	import starling.text.TextField;

	public class OptionsView extends Sprite
	{
		private var _deleteButton:Button;
		private var _backButton:Button;

		public function OptionsView()
		{
			createBackgrounds();
			createTexts();
			createButtons();
		}

		private function createBackgrounds():void
		{
			addChild( StarlingFactory.getBackground() );
			addChild( StarlingFactory.getBackgroundPopup() );
		}

		private function createTexts():void
		{
			addChild( StarlingFactory.getTitle( Texts.OPTIONS ) );

			var hiScore:TextField = StarlingFactory.getTextField( MagicValues.TEXT_MEDIUM_WIDTH, Texts.HI_SCORE, "left" );
			hiScore.x = MagicValues.BORDER_OFFSET_POPUP;
			hiScore.y = 180;
			addChild( hiScore );
		}

		private function createButtons():void
		{
			_deleteButton = StarlingFactory.getIconButton( AtlasKeys.ICON_DELETE, IconButton.TYPE_SMALL_DANGER );
			_deleteButton.pivotX = _deleteButton.width;
			_deleteButton.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_POPUP;
			_deleteButton.y = 175;
			addChild( _deleteButton );

			_backButton = StarlingFactory.getIconButton( AtlasKeys.ICON_HOME, IconButton.TYPE_MEDIUM );
			_backButton.x = ViewPortSize.HALF_WIDTH;
			_backButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			_backButton.alignPivot();
			addChild( _backButton );
		}

		public function get deleteButton():Button
		{
			return _deleteButton;
		}

		public function get backButton():Button
		{
			return _backButton;
		}
	}
}
