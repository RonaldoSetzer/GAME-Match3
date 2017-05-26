import { MagicValues } from "./MagicValues";
import { Texts } from "./Texts";
import { LevelSelectButton } from "./../views/components/LevelSelectButton";
import { IconButton } from "./../views/components/IconButton";
import { ViewPortSize } from "./ViewPortSize";
import { AtlasKeys } from "./AtlasKeys";

import { Graphics, Text, Container, Sprite, Texture } from "pixi.js";

export class PixiFactory {

    public static getText(text: string, fontSize: number = MagicValues.SIZE_DEFAULT): Container {
        let style = {
            align: "center",
            font: { name: MagicValues.FONT_FAMILY, size: fontSize }
        };

        return new PIXI.extras.BitmapText(text, style);
    }
    public static getTitle(label: string): Container {
        let style = {
            align: "center",
            font: { name: MagicValues.FONT_FAMILY, size: MagicValues.SIZE_TITLE }
        };

        let title = new PIXI.extras.BitmapText(label, style);
        title.x = ViewPortSize.HALF_WIDTH;
        title.y = 110;
        title.pivot.x = title.width * .5;
        title.pivot.y = title.height * .5;
        return title;
    }

    public static getIconButton(icon: string, shapeType: string = IconButton.TYPE_SMALL): IconButton {
        let button: IconButton = new IconButton(shapeType);
        button.setIco(icon);
        return button;
    }

    public static getImage(atlasKey: string): Sprite {
        let texture: Texture = AtlasKeys.getTexture(atlasKey);
        return new Sprite(texture);
    }

    public static getBackground(): Sprite {
        return PIXI.Sprite.fromImage(AtlasKeys.BG_IMAGE);
    }

    public static getColorBackground(color = 0x000000): Graphics {
        return this.getColorBox(ViewPortSize.MAX_WIDTH, ViewPortSize.MAX_HEIGHT, color);
    }

    public static getColorBox(width: number, heigth: number, color = 0x00000): Graphics {
        let background: Graphics = new Graphics();
        background.beginFill(color);
        background.drawRect(0, 0, width, heigth);
        return background;
    }
    public static getBackgroundPopup(): Sprite {
        let image: Sprite = PIXI.Sprite.fromImage(AtlasKeys.BG_POPUP_IMAGE);
        image.anchor.set(.5);
        image.x = ViewPortSize.HALF_WIDTH;
        image.y = ViewPortSize.HALF_HEIGHT;
        return image;
    }

    public static getBackgroundHUD(): Sprite {
        return PIXI.Sprite.fromImage(AtlasKeys.BG_HUD_IMAGE);
    }

    public static getShadowBackground(alpha = .6): Graphics {
        let bg: Graphics = PixiFactory.getColorBackground(0x000000);
        bg.alpha = alpha;
        return bg;
    }

    public static getLevelSelectButton(): LevelSelectButton {
        return new LevelSelectButton();
    }

    /*

        public static getShadowBackground(): Graphics {
            let background: Graphics = this.getColorBox(ViewPortSize.MAX_WIDTH, ViewPortSize.MAX_HEIGHT);
            background.alpha = .6;
            return background;
        }*/
}
