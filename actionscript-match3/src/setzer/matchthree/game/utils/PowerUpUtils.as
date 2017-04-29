package setzer.matchthree.game.utils
{
	import setzer.matchthree.game.models.GridData;
	import setzer.matchthree.game.models.PieceData;

	public class PowerUpUtils
	{
		public static function getPiecesAffectedByPowerUp( piece:PieceData, grid:GridData ):Vector.<PieceData>
		{
			var piecesToRemove:Vector.<PieceData> = new Vector.<PieceData>();
			if ( piece.pieceType == PieceType.ROW )
			{
				piecesToRemove = piecesToRemove.concat( GridUtils.getRow( grid, piece.row ) );

			} else if ( piece.pieceType == PieceType.COL )
			{
				piecesToRemove = piecesToRemove.concat( GridUtils.getCol( grid, piece.col ) );

			} else if ( piece.pieceType == PieceType.RAINBOW && piece.pieceId == PieceIds.RAINBOW )
			{
				piecesToRemove = piecesToRemove.concat( GridUtils.getRow( grid, piece.row ) );
				piecesToRemove = piecesToRemove.concat( GridUtils.getCol( grid, piece.col ) );

			} else if ( piece.pieceType == PieceType.RAINBOW && (PieceIds.ALL_NORMAL_IDS.indexOf( piece.pieceId ) != -1) )
			{
				piecesToRemove = piecesToRemove.concat( GridUtils.getAllPiecesById( grid, piece.pieceId ) );
			}

			return piecesToRemove;
		}
	}
}
