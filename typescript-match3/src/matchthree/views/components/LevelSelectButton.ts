import { AtlasKeys } from "./../../utils/AtlasKeys";
import { PixiFactory } from "./../../utils/PixiFactory";
import { IconButton } from "./IconButton";

export class LevelSelectButton extends IconButton {
    constructor() {
        super();
    }

    public setText(text: string): void {
        const label = PixiFactory.getText(text);
        label.pivot.x = label.width * 0.5;
        label.pivot.y = label.height;
        this.addChild(label);
    }
    public setStars(numStars: number): void {
        for (let i = 0; i < numStars; i++) {
            const star = PixiFactory.getImage(AtlasKeys.LEVEL_SELECT_SMALL_STAR);
            star.x = i * 15 + 7;
            star.y = this.height - 14;
            this.addChild(star);
        }
    }
}
