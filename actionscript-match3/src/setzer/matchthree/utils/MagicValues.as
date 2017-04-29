package setzer.matchthree.utils
{
	public class MagicValues
	{
		/* FONT */
		public static const FONT_FAMILY:String = "BerlinSansFBDemi";

		public static const SHARED_OBJECT_NAME:String = "Match3Palidor";

		public static const SIZE_TITLE:int = 42;
		public static const SIZE_DEFAULT:int = 32;
		public static const SIZE_HUD:int = 22;

		public static const TEXT_SMALL_WIDTH:int = 60;
		public static const TEXT_MEDIUM_WIDTH:int = 120;
		public static const TEXT_TITLE_WIDTH:int = 200;
		public static const TEXT_LARGE_WIDTH:int = 320;

		public static const BORDER_OFFSET:int = 18;
		public static const BORDER_OFFSET_BOTTOM:int = 120;
		public static const BORDER_OFFSET_POPUP:Number = 60;
		public static const BORDER_OFFSET_HUD:Number = 10;

		public static function convertTime( secs:Number ):String
		{
			var m:Number = Math.floor( (secs % 3600) / 60 );
			var s:Number = Math.max( Math.floor( (secs % 3600) % 60 ), 0 );
			return ( m.toString() + ":" + (s < 10 ? "0" + s.toString() : s.toString()));
		}
	}
}
