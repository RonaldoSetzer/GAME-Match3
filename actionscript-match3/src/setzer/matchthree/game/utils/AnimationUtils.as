package setzer.matchthree.game.utils
{
	import com.greensock.TimelineLite;
	import com.greensock.TweenLite;

	import setzer.matchthree.game.models.PieceData;
	import setzer.matchthree.game.models.Tile;

	public class AnimationUtils
	{
		public static function createMoveTween( piece:PieceData ):TweenLite
		{
			return new TweenLite( piece.display, .1, {x:piece.col * Tile.TILE_WIDTH, y:piece.row * Tile.TILE_HEIGHT} );
		}

		public static function createRemoveTween( piece:PieceData ):TweenLite
		{
			return new TweenLite( piece.display, .25, {
				alpha:0, scaleX:1.3, scaleY:1.3, onComplete:piece.display.destroy
			} );
		}

		public static function applyAnimation( animationList:Array, complete:Function ):void
		{
			var timeline:TimelineLite = new TimelineLite();
			timeline.insertMultiple( animationList );
			timeline.insert( new TweenLite( {}, animationList[0].duration + 0.01, {onComplete:complete} ) )
		}
	}
}
