export class GameParameter {
    private speed: number = 5;
    private increaseSpeed: number = 0.002;
    private gravity: number = 3000;
    private height: number = 100;

    getSpeed() { return this.speed; }
    getGravity() { return this.gravity; }
    getHeight() { return this.height;}
    speedUp() { this.speed += this.increaseSpeed; }
}