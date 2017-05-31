import sinon = require("sinon");
import { GameEvent } from "./../../../src/matchthree/events/GameEvent";
import { GameStatus } from "./../../../src/matchthree/game/models/GameStatus";
import { TouchPhase } from "../../../src/matchthree/game/models/TouchPhase";
import { GameService } from "./../../../src/matchthree/services/GameService";
import { assert } from "chai";
import { EventDispatcher } from "robotlegs";

describe("GameService", () => {
    let gameService: GameService;

    beforeEach(() => {
        gameService = new GameService();
        gameService.eventDispatcher = new EventDispatcher();
        gameService.gameStatus = new GameStatus();
    });

    afterEach(() => {
        gameService = undefined;
    });

    it("DispatchEventWith", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        let type = "TestDispatchEventWith";
        gameService.dispatchEventWith(type);
        let event = dispatcherSpy.firstCall.args[0];

        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, type);
    });

    it("RetryCommand", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.retryCommand();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.RETRY_GAME_COMMAND);
    });

    it("SwapPiecesConfirmCommand", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.swapPiecesConfirmCommand();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.SWAP_PIECES_CONFIRM_COMMAND);
    });

    it("GameOverCommand", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.gameOverCommand();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.GAME_OVER_COMMAND);
    });

    it("UpdateHUDData", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.updateHUDData();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.UPDATE_HUD_DATA);
    });

    it("ClearGridField", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.clearGridField();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.CLEAR_GRID);
    });

    it("UpdateGridField", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.updateGridField();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.UPDATE_GRID);
    });

    it("Pause", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.pause();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.isTrue(gameService.gameStatus.isPaused);
        assert.equal(event, GameEvent.PAUSE);
    });

    it("resume", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.resume();
        let event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.isFalse(gameService.gameStatus.isPaused);
        assert.equal(event, GameEvent.RESUME);
    });

    it("Start", () => {
        gameService.start();
        assert.isFalse(gameService.gameStatus.isGameOver);
    });

    it("GameOver", () => {
        gameService.gameOver()
        assert.isTrue(gameService.gameStatus.isGameOver);
    });

    it("SwapPiecesCommand", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEvent");
        gameService.swapPiecesCommand(TouchPhase.BEGAN, 1, 2);
        let event: GameEvent = <GameEvent>(dispatcherSpy.firstCall.args[0]);

        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event.type, GameEvent.SWAP_PIECES_COMMAND, "type");
        assert.equal(event.extra.col, 1, "col");
        assert.equal(event.extra.row, 2, "row");
        assert.equal(event.extra.phase, TouchPhase.BEGAN, "phase");
    });

    it("CreateLevelCommand", () => {
        let dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEvent");
        let leveId = 1;
        gameService.createLevel(leveId);
        let event: GameEvent = <GameEvent>(dispatcherSpy.firstCall.args[0]);

        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event.type, GameEvent.CREATE_LEVEL_COMMAND, "type");
        assert.equal(event.extra.levelId, leveId, "levelId");
    });
});
