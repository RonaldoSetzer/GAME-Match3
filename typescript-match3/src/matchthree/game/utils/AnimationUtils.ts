import { TimelineLite, TweenLite } from "gsap";

import { PieceData } from "./../models/PieceData";
import { Tile } from "./../models/Tile";

export class AnimationUtils {
    public static createMoveTween(piece: PieceData): TweenLite {
        return new TweenLite(piece.display, 0.1, { x: piece.col * Tile.TILE_WIDTH, y: piece.row * Tile.TILE_HEIGHT });
    }
    public static createRemoveTween(piece: PieceData, destroyDisplay: Function): TweenLite {
        return new TweenLite(piece.display, 0.25, {
            alpha: 0,
            onComplete: destroyDisplay,
            onCompleteParams: [piece.display],
            scaleX: 1.3,
            scaleY: 1.3
        });
    }
    public static applyAnimation(animationList: TweenLite[], complete: Function): void {
        const timeline: TimelineLite = new TimelineLite({ onComplete: complete });
        timeline.insertMultiple(animationList);
    }
}
