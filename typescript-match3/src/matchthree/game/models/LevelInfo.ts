export class LevelInfo {

    public static MOVE_TYPE = "moveType";
    public static TIMER_TYPE = "timerType";

    public hiScore: number;

    private _maxCols: number;
    private _maxRows: number;
    private _levelType: string;

    private _scoreStarts: Array<number>;
    private _numMoves: number;
    private _time: number;
    private _levelId: number;

    constructor(levelId: number, maxCols: number, maxRows: number, levelType: string, scoreStarts: number[], moves = 16, time = 0) {
        this._levelId = levelId;
        this._numMoves = moves;
        this._time = time;
        this._maxCols = maxCols;
        this._maxRows = maxRows;
        this._levelType = levelType;
        this._scoreStarts = scoreStarts;
    }

    public getNumStars(): number {
        let numStars = 0;
        for (let i = 0; i < this.scoreStarts.length; i++) {
            if (this.hiScore >= this.scoreStarts[i]) {
                numStars++;
            }
        }
        return numStars;
    }

    public get scoreStarts(): Array<number> {
        return this._scoreStarts;
    }

    public get levelType(): String {
        return this._levelType;
    }

    public get maxRows(): number {
        return this._maxRows;
    }

    public get maxCols(): number {
        return this._maxCols;
    }

    public get numMoves(): number {
        return this._numMoves;
    }

    public get time(): number {
        return this._time;
    }

    public get levelId(): number {
        return this._levelId;
    }
}
