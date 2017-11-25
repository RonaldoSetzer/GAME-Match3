export class ScoreUtils {
    public static getNumStars(score: number, scoreStars: number[]): number {
        let numStars = 0;
        for (const scoreStar of scoreStars) {
            if (score >= scoreStar) {
                numStars++;
            }
        }
        return numStars;
    }
}
