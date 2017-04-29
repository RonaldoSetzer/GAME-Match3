package setzer.matchthree.views
{
	import com.greensock.TimelineLite;
	import com.greensock.TweenLite;

	import setzer.matchthree.utils.MagicValues;

	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Sprite;
	import starling.text.TextField;

	public class IntroView extends Sprite
	{
		private var _developer:TextField;

		public function IntroView()
		{
			createBackground();
			createText();
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
			addChild( StarlingFactory.getColorBackground() );
		}

		public function playAnimation():void
		{
			var timeline:TimelineLite = new TimelineLite();
			timeline.append( new TweenLite( _developer, .8, {scaleX:1.2, scaleY:1.2, alpha:1} ) );
			timeline.append( new TweenLite( _developer, 1.2, {scaleX:1.2, scaleY:1.2, alpha:1} ) );
			timeline.append( new TweenLite( _developer, .3, {scaleX:1, scaleY:1, alpha:0} ) );
		}
	}
}
