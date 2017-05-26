import { SingleStar } from "./SingleStart";
import { AtlasKeys } from "./../../utils/AtlasKeys";
import { PixiFactory } from "./../../utils/PixiFactory";
import { Container, Sprite } from "pixi.js";

export class StarDisplayComponent extends Container {

    private _stars: Array<SingleStar>;

    constructor() {
        super();
        this.createStarts();
    }

    public update(score: number, scoreStarts: Array<number>): void {
        let nextFrame: number;
        let scoreStarsPrevious = 0;
        let scoreIni: number;
        let scoreEnd: number;
        let star: SingleStar;

        for (let i = 0; i < scoreStarts.length; i++) {
            scoreIni = score - scoreStarsPrevious;
            scoreEnd = scoreStarts[i] - scoreStarsPrevious;
            star = this._stars[i];

            nextFrame = Math.min(Math.floor((scoreIni / scoreEnd) * 10), star.numFrames - 1);
            nextFrame = Math.max(nextFrame, 0);

            star.currentFrame(nextFrame);
            scoreStarsPrevious = scoreStarts[i];
        }
    }

    private createStarts(): void {
        this._stars = new Array<SingleStar>();
        this._stars.push(this.createSingleStar(-36, -6));
        this._stars.push(this.createSingleStar(0, 0));
        this._stars.push(this.createSingleStar(36, -6));
    }

    private createSingleStar(x: number, y: number): SingleStar {
        let star: SingleStar = new SingleStar();
        star.anchor.set(.5);
        star.x = x;
        star.y = y;
        this.addChild(star);

        return star;
    }
}
