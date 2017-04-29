package setzer.matchthree.utils
{
	import setzer.matchthree.assets.Assets;
	import setzer.matchthree.assets.Embeds;
	import setzer.matchthree.views.components.IconButton;
	import setzer.matchthree.views.components.LevelSelectButton;

	import starling.display.Image;
	import starling.display.MovieClip;
	import starling.display.Quad;
	import starling.text.TextField;
	import starling.text.TextFormat;
	import starling.textures.Texture;
	import starling.utils.Color;

	public class StarlingFactory
	{
		/* TEXT FIELDS */
		public static function getTextField( width:int, text:String = "", fontAlign:String = "center", size:int = MagicValues.SIZE_DEFAULT ):TextField
		{
			var textFormat:TextFormat = new TextFormat( MagicValues.FONT_FAMILY, size, 0xFFFFFF, fontAlign );
			return new TextField( width, MagicValues.SIZE_DEFAULT + 2, text, textFormat );
		}

		public static function getTitle( label:String ):TextField
		{
			var title:TextField = getTextField( MagicValues.TEXT_TITLE_WIDTH, label, "center", MagicValues.SIZE_TITLE );
			title.height = 120;
			title.x = ViewPortSize.HALF_WIDTH;
			title.y = 110;
			title.alignPivot();
			return title;
		}

		/* IMAGES */
		public static function getImage( assetKey:String ):Image
		{
			return new Image( Assets.getTexture( assetKey ) );
		}

		public static function getMovieClip( assetKey:String, fps:int = 10 ):MovieClip
		{
			return new MovieClip( Assets.getTextures( assetKey ), fps );
		}

		/* BUTTONS */
		public static function getIconButton( icon:String, shapeType:String = IconButton.TYPE_SMALL ):IconButton
		{
			var button:IconButton = new IconButton( shapeType );
			button.setIco( icon );
			return button;
		}

		public static function getLevelSelectButton():LevelSelectButton
		{
			return new LevelSelectButton();
		}

		/* BACKGROUNDS */
		public static function getBackground():Image
		{
			var texture:Texture = Texture.fromEmbeddedAsset( Embeds.BG_IMAGE );
			return new Image( texture );
		}

		public static function getBackgroundPopup():Image
		{
			var texture:Texture = Texture.fromEmbeddedAsset( Embeds.BG_POPUP_IMAGE );
			var image:Image = new Image( texture );
			image.alignPivot();
			image.x = ViewPortSize.HALF_WIDTH;
			image.y = ViewPortSize.HALF_HEIGHT;
			return image;
		}

		public static function getBackgroundHUD():Image
		{
			var texture:Texture = Texture.fromEmbeddedAsset( Embeds.BG_HUD_IMAGE );
			return new Image( texture );
		}

		public static function getColorBackground( color:uint = Color.WHITE ):Quad
		{
			return new Quad( ViewPortSize.MAX_WIDTH, ViewPortSize.MAX_HEIGHT, color );
		}

		public static function getShadowBackground( alpha:Number = .6 ):Quad
		{
			var quad:Quad = new Quad( ViewPortSize.MAX_WIDTH, ViewPortSize.MAX_HEIGHT, 0x000000 );
			quad.alpha = alpha;
			return quad;
		}
	}
}
