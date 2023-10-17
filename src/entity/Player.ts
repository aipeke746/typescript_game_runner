import { GameParameter } from "./GameParameter";

export class Player {
    private main!: Phaser.Physics.Arcade.Sprite;
    private initPosX: number = 100;
    private initPosY: number = 100;
    private jumpPower: number = 1000;
    private canAirJump: boolean = false;

    private jumpSound!: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, param: GameParameter) {
        this.main = scene.physics.add.sprite(this.initPosX, this.initPosY, 'player');
        this.main.setGravityY(param.getGravity());
    }

    get() { return this.main;}

    setJumpSound(sound: Phaser.Sound.BaseSound) {
        this.jumpSound = sound;
    }

    jump(scene: Phaser.Scene) {
        scene.input.on('pointerdown', () => {
            if (this.main.body.touching.down) {
                this.main.setVelocityY(-this.jumpPower);
                this.canAirJump = true;
                this.jumpSound.play();
            } else if (this.canAirJump) {
                this.main.setVelocityY(-this.jumpPower);
                this.canAirJump = false;
                this.jumpSound.play();
            }
        });
    }
}