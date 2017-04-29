package setzer.matchthree.views
{
	import com.greensock.TimelineLite;
	import com.greensock.TweenLite;
	import com.greensock.easing.Bounce;

	import setzer.matchthree.utils.MagicValues;

	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.DisplayObject;
	import starling.display.Sprite;
	import starling.events.Event;
	import starling.text.TextField;

	public class StartingPopup extends Sprite
	{
		private var _clockText:TextField;
		private var timeline:TimelineLite;
		private var count:int;
		private var background:DisplayObject;

		public function StartingPopup()
		{
			createBackground();

			createText();

			createStopwatch();
		}

		private function createStopwatch():void
		{
			timeline = new TimelineLite( {onComplete:timeLineComplete} );
			timeline.append( new TweenLite( _clockText, .4, {
				scaleX:1.5, scaleY:1.5, ease:Bounce.easeOut, onComplete:changeNumber
			} ) );
			timeline.append( new TweenLite( _clockText, .4, {
				scaleX:1.5, scaleY:1.5, ease:Bounce.easeOut, onComplete:changeNumber
			} ) );
			timeline.append( new TweenLite( _clockText, .4, {
				scaleX:1.5, scaleY:1.5, ease:Bounce.easeOut
			} ) );
			timeline.stop();
		}

		private function createText():void
		{
			count = 3;

			_clockText = StarlingFactory.getTextField( MagicValues.TEXT_SMALL_WIDTH, "3" );
			_clockText.alignPivot();
			_clockText.x = ViewPortSize.HALF_WIDTH;
			_clockText.y = ViewPortSize.HALF_HEIGHT;
			addChild( _clockText );
		}

		private function createBackground():void
		{
			background = StarlingFactory.getShadowBackground();
			addChild( background );
		}

		private function changeNumber():void
		{
			count -= 1;
			background.alpha -= .1;
			_clockText.scaleX = .1;
			_clockText.scaleY = .1;
			_clockText.text = String( count );
		}

		private function timeLineComplete():void
		{
			timeline.stop();
			timeline = null;
			dispatchEvent( new Event( Event.COMPLETE ) );
		}

		public function destroy():void
		{
			removeFromParent();
		}

		public function start():void
		{
			timeline.restart();
		}
	}
}
