package setzer.matchthree.views.components
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.StarlingFactory;

	import starling.display.Quad;

	public class LevelSelectButton extends IconButton
	{
		public function LevelSelectButton()
		{
			super();
		}

		public function setStars( numStars:int ):void
		{
			var star:Quad;
			for ( var i:int = 0; i < numStars; i++ )
			{
				star = StarlingFactory.getImage( AtlasKeys.LEVEL_SELECT_SMALL_STAR );
				star.x = i * 15 + 7;
				star.y = height - 14;
				addChild( star );
			}
		}
	}
}
