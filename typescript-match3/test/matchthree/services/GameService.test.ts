import sinon = require("sinon");
import { assert } from "chai";
import { EventDispatcher } from "@robotlegsjs/core";

import { TouchPhase } from "../../../src/matchthree/game/models/TouchPhase";
import { GameEvent } from "./../../../src/matchthree/events/GameEvent";
import { GameStatus } from "./../../../src/matchthree/game/models/GameStatus";
import { GameService } from "./../../../src/matchthree/services/GameService";

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
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        const type = "TestDispatchEventWith";
        gameService.dispatchEventWith(type);
        const event = dispatcherSpy.firstCall.args[0];

        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, type);
    });

    it("RetryCommand", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.retryCommand();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.RETRY_GAME_COMMAND);
    });

    it("SwapPiecesConfirmCommand", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.swapPiecesConfirmCommand();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.SWAP_PIECES_CONFIRM_COMMAND);
    });

    it("GameOverCommand", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.gameOverCommand();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.GAME_OVER_COMMAND);
    });

    it("UpdateHUDData", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.updateHUDData();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.UPDATE_HUD_DATA);
    });

    it("ClearGridField", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.clearGridField();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.CLEAR_GRID);
    });

    it("UpdateGridField", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.updateGridField();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event, GameEvent.UPDATE_GRID);
    });

    it("Pause", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.pause();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.isTrue(gameService.gameStatus.isPaused);
        assert.equal(event, GameEvent.PAUSE);
    });

    it("resume", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEventWith");
        gameService.resume();
        const event = dispatcherSpy.firstCall.args[0];
        assert.isTrue(dispatcherSpy.calledOnce);
        assert.isFalse(gameService.gameStatus.isPaused);
        assert.equal(event, GameEvent.RESUME);
    });

    it("Start", () => {
        gameService.start();
        assert.isFalse(gameService.gameStatus.isGameOver);
    });

    it("GameOver", () => {
        gameService.gameOver();
        assert.isTrue(gameService.gameStatus.isGameOver);
    });

    it("SwapPiecesCommand", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEvent");
        gameService.swapPiecesCommand(TouchPhase.BEGAN, 1, 2);
        const event: GameEvent = <GameEvent>dispatcherSpy.firstCall.args[0];

        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event.type, GameEvent.SWAP_PIECES_COMMAND, "type");
        assert.equal(event.extra.col, 1, "col");
        assert.equal(event.extra.row, 2, "row");
        assert.equal(event.extra.phase, TouchPhase.BEGAN, "phase");
    });

    it("CreateLevelCommand", () => {
        const dispatcherSpy = sinon.spy(gameService.eventDispatcher, "dispatchEvent");
        const leveId = 1;
        gameService.createLevel(leveId);
        const event: GameEvent = <GameEvent>dispatcherSpy.firstCall.args[0];

        assert.isTrue(dispatcherSpy.calledOnce);
        assert.equal(event.type, GameEvent.CREATE_LEVEL_COMMAND, "type");
        assert.equal(event.extra.levelId, leveId, "levelId");
    });
});
