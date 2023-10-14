import { GameParameter } from "../GameParameter";
import { Obstacle } from "./Obstacle";

export class WalkingObstacle extends Obstacle {
    height: number = 0;
    speed: number = 5;
    jump: number = 0;

    constructor(scene: Phaser.Scene, image: string, param: GameParameter) {
        super(scene, image, param);
    }

    move(obstacle: Phaser.Physics.Arcade.Image) {
        obstacle.x -= this.speed;
    }
}