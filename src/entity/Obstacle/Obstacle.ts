import { GameParameter } from "../GameParameter";

export abstract class Obstacle {
    main!: Phaser.Physics.Arcade.Group;
    minDelay: number = 1000;
    maxDelay: number = 10000;
    notGravity: boolean = false;

    abstract height: number;
    abstract speed: number;
    abstract jump: number;

    constructor(scene: Phaser.Scene, image: string, param: GameParameter) {
        this.main = scene.physics.add.group();
        this.generate(scene, image, param);
    }

    get() { return this.main; }

    private generate(scene: Phaser.Scene, image: string, param: GameParameter) {
        const randomDelay = Phaser.Math.Between(this.minDelay, this.maxDelay);
        scene.time.addEvent({
            delay: randomDelay,
            callback: () => {
                this.create(scene, image, param);
                this.generate(scene, image, param);
            }
        });
    }

    private create(scene: Phaser.Scene, image: string, param: GameParameter) {
        const obstacle = this.main.create(0, 0, image);
        const pos_x = scene.sys.canvas.width + obstacle.displayWidth / 2;
        const pos_y = scene.sys.canvas.height - param.getHeight() - obstacle.displayHeight / 2 - this.height;
        obstacle.setPosition(pos_x, pos_y);
        if (!this.notGravity) {
            obstacle.setGravityY(param.getGravity());
        }
    }

    moving(param: GameParameter) {
        this.get().children.iterate((child) => {
            if (!child) return;
            const obstacle = child as Phaser.Physics.Arcade.Image;
            obstacle.x -= param.getSpeed();
            this.move(obstacle);

            if (obstacle.x < -obstacle.displayWidth / 2) {
                obstacle.destroy();
            }
        });
    }

    abstract move(obstacle: Phaser.Physics.Arcade.Image): void;
}