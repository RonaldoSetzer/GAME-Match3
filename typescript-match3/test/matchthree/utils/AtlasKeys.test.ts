import { assert } from "chai";
import { Texture } from "pixi.js";

import { AtlasKeys } from "./../../../src/matchthree/utils/AtlasKeys";

describe("AtlasKeys", () => {
    it("GetTexture", () => {
        const key = "./assets/atlas/game/piece_normal_3.png";
        const texture: Texture = Texture.fromImage(key);
        const textureCache: any = { "./assets/atlas/game/piece_normal_3.png": texture };
        AtlasKeys.update(textureCache);
        assert.equal(texture, AtlasKeys.getTexture(key));
    });
});
