import { assert } from "chai";
import { Sprite, Texture } from "pixi.js";

import { PieceData } from "../../../../src/matchthree/game/models/PieceData";
import { Tile } from "./../../../../src/matchthree/game/models/Tile";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";

describe("PieceData", () => {
    let piece: PieceData;

    beforeEach(() => {
        piece = new PieceData();
    });

    afterEach(() => {
        piece = undefined;
    });

    it("Constructor: Default values", () => {
        const col = 0;
        const row = 0;
        const type = PieceType.EMPTY;
        const pieceId = PieceIds.EMPTY;

        assert.equal(col, piece.col);
        assert.equal(row, piece.row);
        assert.equal(type, piece.pieceType);
        assert.equal(pieceId, piece.pieceId);
    });

    it("Constructor: Setting new values", () => {
        const col = 4;
        const row = 5;
        const type = PieceType.NORMAL;
        const pieceId = PieceIds.BLUE;
        piece = new PieceData(col, row, type, pieceId);

        assert.equal(col, piece.col);
        assert.equal(row, piece.row);
        assert.equal(type, piece.pieceType);
        assert.equal(pieceId, piece.pieceId);
    });

    it("SetPosition: Set the Piece in the position", () => {
        const col = 4;
        const row = 6;
        piece = new PieceData(col, row);
        piece.setPosition(col, row);
        assert.equal(col, piece.col);
        assert.equal(row, piece.row);
    });

    it("ToString:", () => {
        piece.row = 5;
        piece.col = 5;

        const str: String = piece.toString();
        assert.equal("piece_id_0_type_empty_col_5_row_5", str);
    });

    it("UpdateDisplayPosition: Empty", () => {
        piece = new PieceData(5, 6, PieceType.EMPTY, PieceIds.EMPTY);
        piece.updateDisplayPosition();
        assert.isTrue(piece.display === undefined);
    });

    it("UpdateDisplayPosition: Any", () => {
        const texture: Texture = Texture.fromImage("./assets/atlas/game/piece_normal_3.png");
        piece = new PieceData(5, 6, PieceType.NORMAL, PieceIds.ORANGE);
        piece.display = new Sprite(texture);
        piece.updateDisplayPosition();
        assert.equal(piece.display.x, Tile.TILE_WIDTH * piece.col);
        assert.equal(piece.display.y, Tile.TILE_WIDTH * piece.row);
    });

    it("UpdateDisplayPosition: Any in the first row", () => {
        const texture: Texture = Texture.fromImage("./assets/atlas/game/piece_normal_3.png");
        piece = new PieceData(5, 0, PieceType.NORMAL, PieceIds.ORANGE);
        piece.display = new Sprite(texture);
        piece.updateDisplayPosition();
        assert.equal(piece.display.x, Tile.TILE_WIDTH * piece.col);
        assert.equal(piece.display.y, -Tile.TILE_HEIGHT);
    });
});
