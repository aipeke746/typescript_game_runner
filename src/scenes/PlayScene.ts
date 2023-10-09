import Phaser, { Scene } from 'phaser';

export default class PlayScene extends Phaser.Scene {
    private param: gameParameter = new gameParameter();
    private platforms!: Platform;
    private player!: Player;
    private obstacles!: Obstacle;

    constructor() {
        super('PlayScene');
    }

    preload() {
        this.load.image('platform', 'assets/platform.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('staticObstacle', 'assets/tree.png');
        this.load.image('movingObstacle', 'assets/enemy.png');
    }

    create() {
        // platforms
        this.platforms = new Platform(this, this.param);

        // player
        this.player = new Player(this, this.param);
        this.player.jump(this);

        // obstacles
        this.obstacles = new Obstacle(this, this.param);
        this.obstacles.generate(this, 'staticObstacle');
        this.obstacles.generate(this, 'movingObstacle');

        // collider
        this.physics.add.collider(this.player.get(), this.platforms.get());
        this.physics.add.collider(this.player.get(), this.obstacles.get(), () => {
            // game over
            this.physics.pause();
            this.player.get().setTint(0xff0000);
        }, undefined, this);
    }

    update() {
        this.param.speedUp();
        this.platforms.moving(this.param);
        this.obstacles.moving(this.param);
    }
}

class gameParameter {
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

class Platform {
    private main!: Phaser.Physics.Arcade.StaticGroup;
    private repeat: number = 20;
    private step: number = 500;

    get() { return this.main; }

    constructor(scene: Phaser.Scene, param: gameParameter) {
        const height = scene.sys.canvas.height - param.getHeight();
        this.main = scene.physics.add.staticGroup({
            key: 'platform',    
            repeat: this.repeat,
            setOrigin: { x: 0, y: 0 },
            setXY: { x: 0, y: height, stepX: this.step}
        })
    }

    moving(param: gameParameter) {
        this.main.children.iterate((child) => {
            const platform = child as Phaser.Physics.Arcade.Image;
            platform.x -= param.getSpeed();

            if (platform.x < -platform.displayWidth) {
                platform.x = platform.scene.sys.canvas.width + platform.displayWidth;
            }
        });
    }
}

class Player {
    private main!: Phaser.Physics.Arcade.Sprite;
    private initPosX: number = 100;
    private initPosY: number = 450;
    private jumpPower: number = 1500;
    private canAirJump: boolean = false;

    constructor(scene: Phaser.Scene, param: gameParameter) {
        this.main = scene.physics.add.sprite(this.initPosX, this.initPosY, 'player');
        this.main.setGravityY(param.getGravity());
    }

    get() { return this.main;}

    jump(scene: Phaser.Scene) {
        scene.input.on('pointerdown', () => {
            if (this.main.body.touching.down) {
                this.main.setVelocityY(-this.jumpPower);
                this.canAirJump = true;
            } else if (this.canAirJump) {
                this.main.setVelocityY(-this.jumpPower);
                this.canAirJump = false;
            }
        });
    }
}

class Obstacle {
    private main!: Phaser.Physics.Arcade.Group;
    private speed: number;
    private height: number;
    private minDelay: number = 3000;
    private maxDelay: number = 15000;

    constructor(scene: Phaser.Scene, param: gameParameter) {
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

    moving(param: gameParameter) {
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