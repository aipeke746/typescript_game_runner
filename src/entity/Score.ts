export class Score {
    private score: number;
    private hightScore: number;
    private scoreText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.score = 0;
        this.hightScore = 0;
        this.scoreText = scene.add.text(10, 10, 'Hight Score: ' + this.hightScore + ' / Score: ' + this.score);
    }

    get() { return this.scoreText; }

    increase(num: number) {
        this.score += Math.floor(num);
        this.scoreText.setText('Hight Score: ' + this.hightScore + ' / Score: ' + this.score);
    }

    setHiscore() {
        if (this.score > this.hightScore) {
            this.hightScore = this.score;
        }
    }
}