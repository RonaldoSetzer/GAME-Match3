package setzer.matchthree.game.utils
{
	import flash.utils.Dictionary;

	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.game.models.PieceData;
	import setzer.matchthree.game.models.SwapModel;

	public class PieceUtils
	{
		public static function IsAdjacent( piece1:PieceData, piece2:PieceData ):Boolean
		{
			var vertical:Boolean = ( piece1.col == piece2.col && Math.abs( piece1.row - piece2.row ) == 1 );
			var horizontal:Boolean = ( piece1.row == piece2.row && Math.abs( piece1.col - piece2.col ) == 1 );

			return vertical || horizontal;
		}

		public static function getEmptyPiece( col:int, row:int ):PieceData
		{
			return new PieceData( col, row );
		}

		public static function getNewNormalPiece( col:int, row:int, pieceId:int = 0 ):PieceData
		{
			if ( pieceId == 0 )
			{
				var ids:Array = PieceIds.ALL_NORMAL_IDS;
				var rnd:int = Math.floor( Math.random() * ids.length );
				pieceId = ids[rnd];
			}
			var pieceData:PieceData = new PieceData( col, row, PieceType.NORMAL, pieceId );

			return pieceData;
		}

		public static function getNewPowerUpPiece( col:int, row:int, type:String, pieceId:int = PieceIds.RAINBOW ):PieceData
		{
			return new PieceData( col, row, type, pieceId );
		}

		public static function getNewPowerByChainLenght( chainLength:int, piece:PieceData, direction:String = "random" ):PieceData
		{
			var pieceId:int;
			var pieceType:String;

			if ( chainLength > 4 )
			{
				pieceType = PieceType.RAINBOW;
				pieceId = PieceIds.RAINBOW;
			} else if ( chainLength == 4 )
			{
				var list:Object = {};
				list[SwapModel.HORIZONTAL] = PieceType.COL;
				list[SwapModel.VERTICAL] = PieceType.ROW;
				list["random"] = (Math.floor( Math.random() * 2 )) ? PieceType.COL : PieceType.ROW;

				pieceType = list[direction];
				pieceId = piece.pieceId;
			} else
			{
				return null;
			}

			return new PieceData( piece.col, piece.row, pieceType, pieceId );
		}

		public static function removePieceFromArrays( piece:PieceData, pieces:Vector.<PieceData> ):void
		{
			var index:int = pieces.indexOf( piece );
			if ( index > -1 ) pieces.splice( index, 1 );
		}

		public static function getAssetId( pieceId:int, pieceType:String ):String
		{
			var preFix:Dictionary = new Dictionary();
			preFix[PieceType.RAINBOW] = AtlasKeys.PIECE_RAINBOW;
			preFix[PieceType.NORMAL] = AtlasKeys.PIECE_NORMAL + "_" + pieceId;
			preFix[PieceType.ROW] = AtlasKeys.PIECE_ROW + "_" + pieceId;
			preFix[PieceType.COL] = AtlasKeys.PIECE_COL + "_" + pieceId;

			return preFix[pieceType];
		}
	}
}
