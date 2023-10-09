export class GameParameter {
    private speed: number = 10;
    private increaseSpeed: number = 0.001;
    private gravity: number = 5000;
    private height: number = 200;

    constructor() {}

    getSpeed() { return this.speed; }
    getGravity() { return this.gravity; }
    getHeight() { return this.height;}

    speedUp() {
        this.speed += this.increaseSpeed;
    }
}