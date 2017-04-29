package setzer.matchthree.views.components
{

	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.StarlingFactory;

	import starling.display.MovieClip;
	import starling.display.Sprite;

	public class StarDisplayComponent extends Sprite
	{
		private var _stars:Vector.<MovieClip>;

		public function StarDisplayComponent()
		{
			createMovieClips();
		}

		private function createMovieClips():void
		{
			_stars = new Vector.<MovieClip>();
			_stars.push( createSingleStar( -36, -6 ) );
			_stars.push( createSingleStar( 0, 0 ) );
			_stars.push( createSingleStar( 36, -6 ) );
		}

		private function createSingleStar( x:int, y:int ):MovieClip
		{
			var star:MovieClip = StarlingFactory.getMovieClip( AtlasKeys.STAR_HUD_DISPLAY );
			star.alignPivot();
			star.x = x;
			star.y = y;
			addChild( star );

			return star;
		}

		public function update( score:int, scoreStarts:Vector.<int> ):void
		{
			var nextFrame:Number;
			var scoreStarsPrevious:int = 0;
			var scoreIni:int;
			var scoreEnd:int;
			var star:MovieClip;

			for ( var i:int = 0; i < scoreStarts.length; i++ )
			{
				scoreIni = score - scoreStarsPrevious;
				scoreEnd = scoreStarts[i] - scoreStarsPrevious;
				star = _stars[i];

				nextFrame = Math.min( Math.floor( (scoreIni / scoreEnd) * 10 ), star.numFrames - 1 );
				nextFrame = Math.max( nextFrame, 0 );

				star.currentFrame = nextFrame;
				star.readjustSize();
				scoreStarsPrevious = scoreStarts[i]
			}
		}

	}
}
