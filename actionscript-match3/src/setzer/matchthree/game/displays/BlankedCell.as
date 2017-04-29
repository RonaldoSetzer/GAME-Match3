package setzer.matchthree.game.displays
{
	import setzer.matchthree.game.models.Tile;

	import starling.display.Quad;

	public class BlankedCell extends Quad
	{
		public function BlankedCell()
		{
			super( Tile.TILE_WIDTH, Tile.TILE_HEIGHT, 0xFFFFFF );
			alpha = .3;
			alignPivot();
		}
	}
}
