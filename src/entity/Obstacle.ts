import { GameParameter } from "./GameParameter";

export class Obstacle {
    private main!: Phaser.Physics.Arcade.Group;
    private speed: number;
    private height: number;
    private minDelay: number = 3000;
    private maxDelay: number = 15000;

    constructor(scene: Phaser.Scene, param: GameParameter) {
        this.main = scene.physics.add.group();
        this.speed = param.getSpeed();
        this.height = param.getHeight();
    }

    get() { return this.main; }

    generate(scene: Phaser.Scene, type: string) {
        const randomDelay = Phaser.Math.Between(this.minDelay, this.maxDelay);
        scene.time.addEvent({
            delay: randomDelay,
            callback: () => {
                this.create(scene, type);
                this.generate(scene, type);
            }
        });
    }

    private create(scene: Phaser.Scene, type: string) {
        const obstacle = this.main.create(0, 0, type);
        obstacle.setX(scene.sys.canvas.width + obstacle.displayWidth / 2);
        obstacle.setY(scene.sys.canvas.height - this.height - obstacle.displayHeight / 2);
        return obstacle;
    }

    moving(param: GameParameter) {
        this.get().children.iterate((child) => {
            if (!child) return;
            const obstacle = child as Phaser.Physics.Arcade.Image;
            obstacle.x -= param.getSpeed();

            if (obstacle.x < -obstacle.displayWidth / 2) {
                obstacle.destroy();
            }
        });
    }
}