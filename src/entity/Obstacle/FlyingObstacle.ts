import { GameParameter } from "../GameParameter";
import { Obstacle } from "./Obstacle";

export class FlyingObstacle extends Obstacle {
    notGravity: boolean = true;
    height: number = 130;
    speed: number = 0;
    jump: number = 0;

    constructor(scene: Phaser.Scene, image: string, param: GameParameter) {
        super(scene, image, param);
    }

    move(obstacle: Phaser.Physics.Arcade.Image) {}
}