import { GameParameter } from "./GameParameter";

export class Platform {
    private main!: Phaser.Physics.Arcade.StaticGroup;
    private repeat: number = 20;
    private step: number = 500;

    get() { return this.main; }

    constructor(scene: Phaser.Scene, param: GameParameter) {
        const height = scene.sys.canvas.height - param.getHeight();
        this.main = scene.physics.add.staticGroup({
            key: 'platform',    
            repeat: this.repeat,
            setOrigin: { x: 0, y: 0 },
            setXY: { x: 0, y: height, stepX: this.step}
        })
    }

    moving(param: GameParameter) {
        this.main.children.iterate((child) => {
            const platform = child as Phaser.Physics.Arcade.Image;
            platform.x -= param.getSpeed();

            if (platform.x < -platform.displayWidth) {
                platform.x = platform.scene.sys.canvas.width + platform.displayWidth;
            }
        });
    }
}