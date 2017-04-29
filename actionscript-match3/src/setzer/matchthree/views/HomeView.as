package setzer.matchthree.views
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.ViewPortSize;
	import setzer.matchthree.views.components.IconButton;

	import starling.display.Button;
	import starling.display.Image;
	import starling.display.Sprite;

	public class HomeView extends Sprite
	{
		private var _playButton:Button;
		private var _optionsButton:Button;

		public function HomeView()
		{
			createBackground();
			createImages();
			createButtons();
		}

		private function createBackground():void
		{
			addChild( StarlingFactory.getBackground() );
		}

		private function createImages():void
		{
			var logo:Image = StarlingFactory.getImage( AtlasKeys.LOGO_MATCH_THREE );
			logo.x = ViewPortSize.HALF_WIDTH;
			logo.y = ViewPortSize.MAX_HEIGHT * .3;
			logo.alignPivot();
			addChild( logo );

			var logoSetzer:Image = StarlingFactory.getImage( AtlasKeys.LOGO_SETZER );
			logoSetzer.x = MagicValues.BORDER_OFFSET;
			logoSetzer.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET - logoSetzer.height;
			addChild( logoSetzer );
		}

		private function createButtons():void
		{
			_playButton = StarlingFactory.getIconButton( AtlasKeys.ICON_RESUME, IconButton.TYPE_MEDIUM );
			_playButton.x = ViewPortSize.HALF_WIDTH;
			_playButton.y = ViewPortSize.MAX_HEIGHT - 50 - MagicValues.BORDER_OFFSET_BOTTOM;
			_playButton.alignPivot();

			addChild( _playButton );

			_optionsButton = StarlingFactory.getIconButton( AtlasKeys.ICON_CONFIG, IconButton.TYPE_MEDIUM );
			_optionsButton.x = ViewPortSize.HALF_WIDTH;
			_optionsButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			_optionsButton.alignPivot();
			addChild( _optionsButton );
		}

		public function get playButton():Button
		{
			return _playButton;
		}

		public function get optionsButton():Button
		{
			return _optionsButton;
		}
	}
}
