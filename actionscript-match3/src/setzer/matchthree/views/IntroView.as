package setzer.matchthree.views
{
	import com.greensock.TimelineLite;
	import com.greensock.TweenLite;

	import setzer.matchthree.assets.Embeds;

	import setzer.matchthree.utils.MagicValues;

	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Image;

	import starling.display.Sprite;
	import starling.text.TextField;
	import starling.textures.Texture;

	public class IntroView extends Sprite
	{
		private var _developer:TextField;
		private var _logo:Image;

		public function IntroView()
		{
			createBackground();
			createText();
			createImages();
		}

		private function createImages():void
		{
			_logo = new Image( Texture.fromEmbeddedAsset( Embeds.LANGUAGE_IMAGE ) );
			_logo.pivotX = _logo.width * .5;
			_logo.x = ViewPortSize.HALF_WIDTH;
			_logo.y = ViewPortSize.MAX_HEIGHT - _logo.height;
			_logo.alpha = 0;
			addChild( _logo );
		}

		private function createText():void
		{
			_developer = StarlingFactory.getTextField( MagicValues.TEXT_TITLE_WIDTH, Texts.DEVELOPER );
			_developer.height = 100;
			_developer.alignPivot();
			_developer.x = ViewPortSize.HALF_WIDTH;
			_developer.y = ViewPortSize.HALF_HEIGHT;
			_developer.alpha = 0;
			addChild( _developer );
		}

		private function createBackground():void
		{
			addChild( StarlingFactory.getColorBackground(0x773f16) );
		}

		public function playAnimation():void
		{
			var timeline:TimelineLite = new TimelineLite();
			timeline.append( new TweenLite( _developer, .8, {scaleX:1.2, scaleY:1.2, alpha:1} ) );
			timeline.append( new TweenLite( _developer, 2, {scaleX:1.2, scaleY:1.2, alpha:1} ) );
			timeline.append( new TweenLite( _developer, .3, {scaleX:1, scaleY:1, alpha:0} ) );

			var timelineLogo:TimelineLite = new TimelineLite();
			timelineLogo.append( new TweenLite( _logo, .8, {alpha:1} ) );
			timelineLogo.append( new TweenLite( _logo, 2, {alpha:1} ) );
			timelineLogo.append( new TweenLite( _logo, .3, {alpha:0} ) );
		}
	}
}
