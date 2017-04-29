package setzer.matchthree.views
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Button;
	import starling.display.Sprite;
	import starling.text.TextField;

	public class AlertPopup extends Sprite
	{
		private var _cancelButton:Button;
		private var _confirmButton:Button;

		public function AlertPopup()
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
			addChild( StarlingFactory.getTitle( Texts.ALERT ) );

			var alert:TextField = StarlingFactory.getTextField( MagicValues.TEXT_LARGE_WIDTH, Texts.CONFIRM_DELETE );
			alert.x = ViewPortSize.HALF_WIDTH;
			alert.y = ViewPortSize.HALF_HEIGHT;
			alert.height = 350;
			alert.alignPivot();
			addChild( alert );
		}

		private function createButtons():void
		{
			_confirmButton = StarlingFactory.getIconButton( AtlasKeys.ICON_CONFIRM );
			_confirmButton.alignPivot();
			_confirmButton.x = ViewPortSize.HALF_WIDTH - _confirmButton.width * .5 - 4;
			_confirmButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			addChild( _confirmButton );

			_cancelButton = StarlingFactory.getIconButton( AtlasKeys.ICON_CLOSE );
			_cancelButton.alignPivot();
			_cancelButton.x = ViewPortSize.HALF_WIDTH + _cancelButton.width * .5 + 4;
			_cancelButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			addChild( _cancelButton );
		}

		public function get confirmButton():Button
		{
			return _confirmButton;
		}

		public function get cancelButton():Button
		{
			return _cancelButton;
		}
	}
}
