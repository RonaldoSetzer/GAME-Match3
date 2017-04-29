package setzer.matchthree.views.components
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.game.models.LevelModel;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Button;
	import starling.display.Sprite;
	import starling.text.TextField;

	public class HUDGameComponent extends Sprite
	{
		private var _pauseButton:Button;
		private var _scoreText:TextField;
		private var _movesText:TextField;
		private var _timeText:TextField;
		private var _movesLabel:TextField;
		private var _timeLabel:TextField;

		private var _starComponent:StarDisplayComponent;

		public function HUDGameComponent()
		{
			createBackground();
			createTextFields();
			createButtons();
			createStarCompont();
		}

		private function createBackground():void
		{
			addChild( StarlingFactory.getBackgroundHUD() )
		}

		private function createTextFields():void
		{
			/* Static Texts */
			var scoreLabel:TextField = StarlingFactory.getTextField( MagicValues.TEXT_MEDIUM_WIDTH, Texts.SCORE, "left", MagicValues.SIZE_HUD );
			scoreLabel.format.verticalAlign = "top";
			scoreLabel.x = MagicValues.BORDER_OFFSET_HUD;
			scoreLabel.y = MagicValues.BORDER_OFFSET_HUD - 5;
			addChild( scoreLabel );

			_movesLabel = StarlingFactory.getTextField( MagicValues.TEXT_SMALL_WIDTH, Texts.MOVES, "center", MagicValues.SIZE_HUD );
			_movesLabel.format.verticalAlign = "top";
			_movesLabel.pivotX = _movesLabel.width * .5;
			_movesLabel.x = ViewPortSize.HALF_WIDTH;
			_movesLabel.y = MagicValues.BORDER_OFFSET_HUD - 5;
			addChild( _movesLabel );

			_timeLabel = StarlingFactory.getTextField( MagicValues.TEXT_MEDIUM_WIDTH, Texts.TIME, "center", MagicValues.SIZE_HUD );
			_timeLabel.format.verticalAlign = "top";
			_timeLabel.pivotX = _timeLabel.width * .5;
			_timeLabel.x = ViewPortSize.HALF_WIDTH;
			_timeLabel.y = MagicValues.BORDER_OFFSET_HUD - 5;
			addChild( _timeLabel );

			/* Dynamic Texts */
			_scoreText = StarlingFactory.getTextField( MagicValues.TEXT_MEDIUM_WIDTH, "0", "left", MagicValues.SIZE_DEFAULT );
			_scoreText.x = MagicValues.BORDER_OFFSET_HUD;
			_scoreText.y = scoreLabel.y + 16;
			addChild( _scoreText );

			_movesText = StarlingFactory.getTextField( MagicValues.TEXT_SMALL_WIDTH, "0", "center", MagicValues.SIZE_DEFAULT );
			_movesText.pivotX = _movesText.width * .5;
			_movesText.x = ViewPortSize.HALF_WIDTH;
			_movesText.y = _movesLabel.y + 16;
			addChild( _movesText );

			_timeText = StarlingFactory.getTextField( MagicValues.TEXT_SMALL_WIDTH, "0", "center", MagicValues.SIZE_DEFAULT );
			_timeText.pivotX = _timeText.width * .5;
			_timeText.x = ViewPortSize.HALF_WIDTH;
			_timeText.y = _timeLabel.y + 16;
			addChild( _timeText );
		}

		private function createButtons():void
		{
			_pauseButton = StarlingFactory.getIconButton( AtlasKeys.ICON_PAUSE );
			_pauseButton.pivotX = _pauseButton.width;
			_pauseButton.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_HUD;
			_pauseButton.y = MagicValues.BORDER_OFFSET_HUD;
			addChild( _pauseButton );
		}

		private function createStarCompont():void
		{
			_starComponent = new StarDisplayComponent();
			_starComponent.alignPivot();
			_starComponent.x = ViewPortSize.HALF_WIDTH;
			_starComponent.y = MagicValues.BORDER_OFFSET_HUD + 60;
			addChild( _starComponent )
		}

		public function updateValues( model:LevelModel ):void
		{
			_scoreText.text = String( model.score );
			_movesText.text = String( model.numMoves );
			_timeText.text = MagicValues.convertTime( model.clock );
			_starComponent.update( model.score, model.levelInfo.scoreStarts );
		}

		public function setTimerType():void
		{
			_movesLabel.visible = false;
			_movesText.visible = false;
			_timeLabel.visible = true;
			_timeText.visible = true;
		}

		public function setMoveType():void
		{
			_movesLabel.visible = true;
			_movesText.visible = true;
			_timeLabel.visible = false;
			_timeText.visible = false;
		}

		public function get pauseButton():Button
		{
			return _pauseButton;
		}

	}
}