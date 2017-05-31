import { PieceData } from "./../models/PieceData";
import { Tile } from "./../models/Tile";

import { TweenLite, TimelineLite } from "gsap";

export class AnimationUtils {
    public static createMoveTween(piece: PieceData): TweenLite {
        return new TweenLite(piece.display, .1, { x: piece.col * Tile.TILE_WIDTH, y: piece.row * Tile.TILE_HEIGHT });
    }

    public static createRemoveTween(piece: PieceData, destroyDisplay: Function): TweenLite {
        return new TweenLite(piece.display, .25, {
            alpha: 0, onComplete: destroyDisplay, onCompleteParams: [piece.display], scaleX: 1.3, scaleY: 1.3
        });
    }

    public static applyAnimation(animationList: Array<TweenLite>, complete: Function): void {
        let timeline: TimelineLite = new TimelineLite({ onComplete: complete });
        timeline.insertMultiple(animationList);
    }
}

