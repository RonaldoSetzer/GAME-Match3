package setzer.matchthree.game.utils
{
	import flash.utils.Dictionary;

	import setzer.matchthree.game.displays.PieceDisplay;

	public class PieceDisplayPool
	{
		public static var pieceLists:Dictionary;

		public static function init():void
		{
			pieceLists = new Dictionary();
		}

		public static function getPieceDisplay( pieceId:int, pieceType:String ):PieceDisplay
		{
			var assetId:String = PieceUtils.getAssetId( pieceId, pieceType );

			if ( pieceLists[assetId] == null ) pieceLists[assetId] = new Vector.<PieceDisplay>();

			var list:Vector.<PieceDisplay> = pieceLists[assetId];
			var piece:PieceDisplay = list.shift() || new PieceDisplay( pieceId, pieceType );
			piece.visible = true;
			piece.alpha = 1;
			piece.scaleX = 1;
			piece.scaleY = 1;

			return piece;
		}

		public static function back( piece:PieceDisplay ):void
		{
			var list:Vector.<PieceDisplay> = pieceLists[piece.assetId];
			piece.visible = false;

			if ( list.indexOf( piece ) == -1 )
				list.push( piece );
		}
	}
}
