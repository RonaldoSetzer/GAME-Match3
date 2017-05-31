export class ScoreUtils {

    public static getNumStars(score: number, scoreStarts: number[]): number {
        let numStars = 0;
        for (let i = 0; i < scoreStarts.length; i++) {
            if (score >= scoreStarts[i]) {
                numStars++;
            }
        }
        return numStars;
    }
}
