package setzer.matchthree.game.models
{
	public class Tile
	{
		public static const TILE_WIDTH:int = 36;
		public static const TILE_HEIGHT:int = 36;

		public var col:int;
		public var row:int;

		public function Tile( col:int = 0, row:int = 0 )
		{
			this.col = col;
			this.row = row;
		}
	}
}
