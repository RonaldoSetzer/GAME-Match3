package setzer.matchthree.views.components
{
	import flash.utils.Dictionary;

	import setzer.matchthree.assets.Assets;
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;

	import starling.display.Button;
	import starling.display.Image;
	import starling.text.TextFormat;

	public class IconButton extends Button
	{
		public static const TYPE_SMALL:String = "small";
		public static const TYPE_MEDIUM:String = "medium";
		public static const TYPE_SMALL_DANGER:String = "small_danger";

		private var size:String;

		private var _ico:Image;

		public function IconButton( shapeType:String = TYPE_SMALL )
		{
			this.size = shapeType;

			var prefix:Dictionary = new Dictionary();
			prefix[TYPE_SMALL + "up"] = AtlasKeys.BUTTON_SMALL_UP;
			prefix[TYPE_SMALL + "down"] = AtlasKeys.BUTTON_SMALL_DOWN;

			prefix[TYPE_MEDIUM + "up"] = AtlasKeys.BUTTON_MEDIUM_UP;
			prefix[TYPE_MEDIUM + "down"] = AtlasKeys.BUTTON_MEDIUM_DOWN;

			prefix[TYPE_SMALL_DANGER + "up"] = AtlasKeys.BUTTON_SMALL_DANGER_UP;
			prefix[TYPE_SMALL_DANGER + "down"] = AtlasKeys.BUTTON_SMALL_DANGER_DOWN;

			super( Assets.getTexture( prefix[shapeType + "up"] ), "", Assets.getTexture( prefix[shapeType + "down"] ) );

			textFormat = new TextFormat( MagicValues.FONT_FAMILY, MagicValues.SIZE_DEFAULT, 0xFFFFFF, "center", "top" );
		}

		public function setIco( name:String ):void
		{
			if ( _ico ) _ico.removeFromParent();

			_ico = new Image( Assets.getTexture( name ) );
			_ico.pivotX = _ico.width * .5;
			_ico.pivotY = _ico.height * .5;
			_ico.x = width * .5;
			_ico.y = height * .5;
			addChild( _ico );
		}
	}
}