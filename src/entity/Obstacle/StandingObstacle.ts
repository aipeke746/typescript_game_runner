import { GameParameter } from "../GameParameter";
import { Obstacle } from "./Obstacle";

export class StandingObstacle extends Obstacle {
    height: number = 0;
    speed: number = 0;
    jump: number = 0;

    constructor(scene: Phaser.Scene, image: string, param: GameParameter) {
        super(scene, image, param);
    }

    move(obstacle: Phaser.Physics.Arcade.Image) {}
}