package setzer.matchthree.utils
{
	import flash.net.SharedObject;

	import setzer.matchthree.game.models.LevelInfo;
	import setzer.matchthree.game.utils.LevelsRepository;

	public class SharedObjectManager
	{
		public static function getExternalData():void
		{
			var so:SharedObject = SharedObject.getLocal( MagicValues.SHARED_OBJECT_NAME );
			var levelsInfo:Vector.<LevelInfo> = LevelsRepository.getLevels();

			if ( so.data.levels )
			{
				for ( var levelId:int = 0; levelId < so.data.levels.length; levelId++ )
				{
					levelsInfo[levelId].hiScore = int( so.data.levels[levelId] );

					trace( "LevelId:", levelId, ":: hiScore: " + so.data.levels[levelId].toString() );
				}

			}
			so.close();
		}

		public static function updateHighScore():void
		{
			var so:SharedObject = SharedObject.getLocal( MagicValues.SHARED_OBJECT_NAME );
			var levelsInfo:Vector.<LevelInfo> = LevelsRepository.getLevels();
			var levels:Array = [];

			for ( var levelId:int = 0; levelId < levelsInfo.length; levelId++ )
			{
				levels.push( levelsInfo[levelId].hiScore );

				trace( "LevelId:", levelId, ":: hiScore: " + levels[levelId].toString() );
			}
			so.data.levels = levels;

			so.flush();
			so.close();
		}

		public static function clear():void
		{
			var so:SharedObject = SharedObject.getLocal( MagicValues.SHARED_OBJECT_NAME );
			if ( so.data.levels )
			{
				for ( var levelId:int = 0; levelId < so.data.levels.length; levelId++ )
				{
					so.data.levels[levelId] = 0;

					trace( "LevelId:", levelId, ":: hiScore: " + so.data.levels[levelId].toString() );
				}

			}

			so.flush();
			so.close();
		}
	}
}
