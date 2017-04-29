package setzer.matchthree.game.utils
{
	import setzer.matchthree.game.models.LevelInfo;

	public class LevelsRepository
	{
		private static var levels:Vector.<LevelInfo>;

		public static function init():void
		{
			levels = new Vector.<LevelInfo>();
			levels.push( new LevelInfo( 0, 5, 7, LevelInfo.MOVE_TYPE, 4200, 5000, 6000, 10 ) );//35
			levels.push( new LevelInfo( 1, 6, 8, LevelInfo.TIMER_TYPE, 8000, 9000, 10000, 0, 80 ) );//48
			levels.push( new LevelInfo( 2, 6, 9, LevelInfo.MOVE_TYPE, 8000, 10000, 12000, 20 ) );//54
			levels.push( new LevelInfo( 3, 8, 6, LevelInfo.MOVE_TYPE, 8000, 9000, 10000, 15 ) );//48
			levels.push( new LevelInfo( 4, 7, 7, LevelInfo.TIMER_TYPE, 16000, 18000, 20000, 0, 120 ) );//49
			levels.push( new LevelInfo( 5, 9, 5, LevelInfo.TIMER_TYPE, 42000, 48000, 55000, 0, 300 ) );//45
			levels.push( new LevelInfo( 6, 5, 5, LevelInfo.MOVE_TYPE, 1800, 2600, 3200, 5 ) );//25
			levels.push( new LevelInfo( 7, 6, 8, LevelInfo.MOVE_TYPE, 16000, 21000, 26000, 30 ) );//48
			levels.push( new LevelInfo( 8, 6, 7, LevelInfo.TIMER_TYPE, 24500, 28200, 32000, 0, 180 ) );//45
		}

		public static function getLevelInfoById( levelId:int ):LevelInfo
		{
			return levels[levelId] || levels[0];
		}

		public static function updateHiScore( levelId:int, hiScore:int ):void
		{
			getLevelInfoById( levelId ).hiScore = hiScore;
		}

		public static function getLevels():Vector.<LevelInfo>
		{
			return levels;
		}
	}
}
