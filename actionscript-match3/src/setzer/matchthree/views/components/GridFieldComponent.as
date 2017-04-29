package setzer.matchthree.views.components
{
	import setzer.matchthree.game.displays.BlankedCell;
	import setzer.matchthree.game.models.Tile;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Quad;
	import starling.display.Sprite;

	public class GridFieldComponent extends Sprite
	{
		public function GridFieldComponent()
		{
			x = 10 + (Tile.TILE_WIDTH * .5);
			y = 130 + (Tile.TILE_HEIGHT * .5);
		}

		public function generateGrid( maxCols:int, maxRows:int ):void
		{
			var gridSize:int = maxCols * Tile.TILE_WIDTH;
			var newX:int = (ViewPortSize.MAX_WIDTH - gridSize) * .5;
			x = newX + (Tile.TILE_WIDTH * .5);

			for ( var row:int = 0; row < maxRows; row++ )
			{
				for ( var col:int = 0; col < maxCols; col++ )
				{
					var cell:Quad = new BlankedCell();
					cell.x = Tile.TILE_WIDTH * col;
					cell.y = Tile.TILE_HEIGHT * row;
					addChild( cell );
				}
			}
		}
	}
}
