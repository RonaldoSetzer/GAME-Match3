import { Tile } from "./../../../../src/matchthree/game/models/Tile";
import { PieceIds } from "./../../../../src/matchthree/game/utils/PieceIds";
import { PieceType } from "./../../../../src/matchthree/game/utils/PieceType";
import { PieceData } from "../../../../src/matchthree/game/models/PieceData";
import { GridData } from "./../../../../src/matchthree/game/models/GridData";
import { assert } from "chai";
import { Texture, Sprite } from "pixi.js";

describe("PieceData", () => {

    let piece: PieceData;

    beforeEach(() => {
        piece = new PieceData();
    });

    afterEach(() => {
        piece = undefined;
    });

    it("Constructor: Default values", () => {
        let col = 0;
        let row = 0;
        let type = PieceType.EMPTY;
        let pieceId = PieceIds.EMPTY;

        assert.equal(col, piece.col);
        assert.equal(row, piece.row);
        assert.equal(type, piece.pieceType);
        assert.equal(pieceId, piece.pieceId);
    });

    it("Constructor: Setting new values", () => {
        let col = 4;
        let row = 5;
        let type = PieceType.NORMAL;
        let pieceId = PieceIds.BLUE;
        piece = new PieceData(col, row, type, pieceId);

        assert.equal(col, piece.col);
        assert.equal(row, piece.row);
        assert.equal(type, piece.pieceType);
        assert.equal(pieceId, piece.pieceId);
    });

    it("SetPosition: Set the Piece in the position", () => {
        let col = 4;
        let row = 6;
        piece = new PieceData(col, row);
        piece.setPosition(col, row);
        assert.equal(col, piece.col);
        assert.equal(row, piece.row);
    });

    it("ToString:", () => {
        piece.row = 5;
        piece.col = 5;

        let str: String = piece.toString();
        assert.equal("piece_id_0_type_empty_col_5_row_5", str);
    });

    it("UpdateDisplayPosition: Empty", () => {
        piece = new PieceData(5, 6, PieceType.EMPTY, PieceIds.EMPTY);
        piece.updateDisplayPosition();
        assert.isTrue(piece.display === undefined);
    });

    it("UpdateDisplayPosition: Any", () => {
        let texture: Texture = Texture.fromImage("./assets/atlas/game/piece_normal_3.png");
        piece = new PieceData(5, 6, PieceType.NORMAL, PieceIds.ORANGE);
        piece.display = new Sprite(texture);
        piece.updateDisplayPosition();
        assert.equal(piece.display.x, Tile.TILE_WIDTH * piece.col);
        assert.equal(piece.display.y, Tile.TILE_WIDTH * piece.row);
    });

    it("UpdateDisplayPosition: Any in the first row", () => {
        let texture: Texture = Texture.fromImage("./assets/atlas/game/piece_normal_3.png");
        piece = new PieceData(5, 0, PieceType.NORMAL, PieceIds.ORANGE);
        piece.display = new Sprite(texture);
        piece.updateDisplayPosition();
        assert.equal(piece.display.x, Tile.TILE_WIDTH * piece.col);
        assert.equal(piece.display.y, -Tile.TILE_HEIGHT);
    });
});
