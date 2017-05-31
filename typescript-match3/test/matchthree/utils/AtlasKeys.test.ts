import { AtlasKeys } from "./../../../src/matchthree/utils/AtlasKeys";
import { assert } from "chai";
import { Texture } from "pixi.js";

describe("AtlasKeys", () => {

    it("GetTexture", () => {
        let key = "./assets/atlas/game/piece_normal_3.png";
        let texture: Texture = Texture.fromImage(key);
        let textureCache: any = { "./assets/atlas/game/piece_normal_3.png": texture };
        AtlasKeys.update(textureCache);
        assert.equal(texture, AtlasKeys.getTexture(key));
    });
});
