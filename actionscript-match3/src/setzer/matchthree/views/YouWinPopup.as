package setzer.matchthree.views
{
	import setzer.matchthree.assets.AtlasKeys;
	import setzer.matchthree.utils.MagicValues;
	import setzer.matchthree.utils.StarlingFactory;
	import setzer.matchthree.utils.Texts;
	import setzer.matchthree.utils.ViewPortSize;

	import starling.display.Button;
	import starling.display.Image;
	import starling.display.Quad;
	import starling.display.Sprite;
	import starling.text.TextField;

	public class YouWinPopup extends Sprite
	{
		private var _retryButton:Button;
		private var _levelSelectButton:Button;
		private var _scoreText:TextField;
		private var _hiScoreText:TextField;

		public function YouWinPopup()
		{
			createBackground();
			createText();
			createButtons();
		}

		private function createBackground():void
		{
			addChild( StarlingFactory.getShadowBackground() );
			addChild( StarlingFactory.getBackgroundPopup() );
		}

		private function createText():void
		{
			addChild( StarlingFactory.getTitle( Texts.YOU_WIN ) );

			var scoreLabel:TextField = StarlingFactory.getTextField( MagicValues.TEXT_MEDIUM_WIDTH, Texts.SCORE, "left" );
			scoreLabel.x = MagicValues.BORDER_OFFSET_POPUP;
			scoreLabel.y = 220;
			addChild( scoreLabel );

			var hiScoreLabel:TextField = StarlingFactory.getTextField(  MagicValues.TEXT_MEDIUM_WIDTH, Texts.HI_SCORE, "left" );
			hiScoreLabel.x = MagicValues.BORDER_OFFSET_POPUP;
			hiScoreLabel.y = 260;
			addChild( hiScoreLabel );

			_scoreText = StarlingFactory.getTextField( MagicValues.TEXT_MEDIUM_WIDTH, "0", "right" );
			_scoreText.pivotX = _scoreText.width;
			_scoreText.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_POPUP;
			_scoreText.y = 220;
			addChild( _scoreText );

			_hiScoreText = StarlingFactory.getTextField( MagicValues.TEXT_MEDIUM_WIDTH, "0", "right" );
			_hiScoreText.pivotX = _hiScoreText.width;
			_hiScoreText.x = ViewPortSize.MAX_WIDTH - MagicValues.BORDER_OFFSET_POPUP;
			_hiScoreText.y = 260;
			addChild( _hiScoreText );
		}

		private function createButtons():void
		{
			_retryButton = StarlingFactory.getIconButton( AtlasKeys.ICON_RETRY );
			_retryButton.alignPivot();
			_retryButton.x = ViewPortSize.HALF_WIDTH - _retryButton.width * .5 - 4;
			_retryButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			addChild( _retryButton );

			_levelSelectButton = StarlingFactory.getIconButton( AtlasKeys.ICON_LEVEL_SELECT );
			_levelSelectButton.alignPivot();
			_levelSelectButton.x = ViewPortSize.HALF_WIDTH + _levelSelectButton.width * .5 + 4;
			_levelSelectButton.y = ViewPortSize.MAX_HEIGHT - MagicValues.BORDER_OFFSET_BOTTOM;
			addChild( _levelSelectButton );
		}

		public function createStars( numStars:int ):void
		{
			var star:Image;
			for ( var i:int = 0; i < numStars; i++ )
			{
				star = StarlingFactory.getImage( AtlasKeys.POPUP_STAR );
				star.x = ViewPortSize.HALF_WIDTH - (i * 60 - ((numStars - 1) * 60 * .5));
				star.y = 180;
				star.alignPivot();
				addChild( star )
			}
		}

		public function updateValues( score:String, hiScore:String ):void
		{
			_scoreText.text = score;
			_hiScoreText.text = hiScore;
		}

		public function get retryButton():Button
		{
			return _retryButton;
		}

		public function get levelSelectButton():Button
		{
			return _levelSelectButton;
		}


	}
}
