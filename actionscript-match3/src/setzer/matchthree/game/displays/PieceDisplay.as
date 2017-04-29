package setzer.matchthree.game.displays
{
	import setzer.matchthree.assets.Assets;
	import setzer.matchthree.game.utils.PieceDisplayPool;
	import setzer.matchthree.game.utils.PieceUtils;

	import starling.display.Image;

	public class PieceDisplay extends Image
	{
		private var _assetId:String;

		public function PieceDisplay( pieceId:int, pieceType:String )
		{
			_assetId = PieceUtils.getAssetId( pieceId, pieceType );
			super( Assets.getTexture( _assetId ) );

			alignPivot();
		}

		public function destroy():void
		{
			PieceDisplayPool.back( this );
			removeFromParent();
		}

		public function get assetId():String
		{
			return _assetId;
		}
	}
}
