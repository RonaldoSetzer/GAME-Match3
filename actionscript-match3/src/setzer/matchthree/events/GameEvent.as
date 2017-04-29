package setzer.matchthree.events
{
	import starling.events.Event;

	public class GameEvent extends Event
	{
		public static const RETRY_GAME_COMMAND:String = "retryGameCommand";
		public static const CREATE_LEVEL_COMMAND:String = "createLevelCommand";

		public static const SWAP_PIECES_COMMAND:String = "swapPiecesCommand";
		public static const SWAP_PIECES_CONFIRM_COMMAND:String = "piecesSwappedCommand";

		public static const GAME_OVER_COMMAND:String = "gameOver";

		public static const RESUME:String = "resume";
		public static const PAUSE:String = "pause";

		public static const UPDATE_HUD_DATA:String = "updateData";

		public static const CLEAR_GRID:String = "clearGridField";

		public static const UPDATE_GRID:String = "update";

		public var extra:Object;

		public function GameEvent( type:String, bubbles:Boolean = false, data:Object = null )
		{
			super( type, bubbles, data );
		}
	}
}
