import { GameParameter } from "../GameParameter";
import { Obstacle } from "./Obstacle";

export class JumpingObstacle extends Obstacle {
    height: number = 0;
    speed: number = 3;
    jump: number = 800;

    constructor(scene: Phaser.Scene, image: string, param: GameParameter) {
        super(scene, image, param);
    }

    move(obstacle: Phaser.Physics.Arcade.Image) {
        obstacle.x -= this.speed;
        if (obstacle.body.touching.down) {
            obstacle.setVelocityY(-this.jump);
        }
    }
}