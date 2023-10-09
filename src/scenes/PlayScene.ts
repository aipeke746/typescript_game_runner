import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private playerX: number = 100;
    private jump: number = 1500;
    private canAirJump: boolean = false;

    private speed: number = 2;
    private speedUp: number = 0.001;
    private gravity: number = 5000;
    private height: number = 100;

    private platforms!: Phaser.Physics.Arcade.StaticGroup;

    private staticObstacles!: Phaser.Physics.Arcade.Group;
    private movingObstacles!: Phaser.Physics.Arcade.Group;


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
        const platformHeight = this.sys.canvas.height - this.height;
        this.platforms = this.physics.add.staticGroup({
            key: 'platform',    
            repeat: 20,
            setOrigin: { x: 0, y: 0 },
            setXY: { x: 0, y: platformHeight, stepX: 500}
        })

        // player
        this.player = this.physics.add.sprite(this.playerX, 450, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(this.gravity);
        this.playerJump();

        // static obstacles
        this.staticObstacles = this.physics.add.group();
        this.generateRandomStaticObstacle();

        // moving obstacles
        this.movingObstacles = this.physics.add.group();
        this.generateRandomMovingObstacle();

        // collider
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.staticObstacles, () => {
            // game over
            this.physics.pause();
            this.player.setTint(0xff0000);
        }, undefined, this);
        this.physics.add.collider(this.player, this.movingObstacles, () => {
            // game over
            this.physics.pause();
            this.player.setTint(0xff0000);
        })
    }

    playerJump() {
        this.input.on('pointerdown', () => {
            if (this.player.body.touching.down) {
                this.player.setVelocityY(-this.jump);
                this.canAirJump = true;
            } else if (this.canAirJump) {
                this.player.setVelocityY(-this.jump);
                this.canAirJump = false;
            }
        });
    }

    generateRandomStaticObstacle() {
        const minDelay = 3000;
        const maxDelay = 15000;
        const randomDelay = Phaser.Math.Between(minDelay, maxDelay);

        this.time.addEvent({
            delay: randomDelay,
            callback: () => {
                this.createStaticObstacle();
                this.generateRandomStaticObstacle();
            }
        });
    }

    createStaticObstacle() {
        const obstacle = this.staticObstacles.create(0, 0, 'staticObstacle');
        obstacle.setX(this.sys.canvas.width + obstacle.displayWidth / 2);
        obstacle.setY(this.sys.canvas.height - this.height - obstacle.displayHeight / 2);
        return obstacle;
    }

    generateRandomMovingObstacle() {
        const minDelay = 3000;
        const maxDelay = 15000;
        const randomDelay = Phaser.Math.Between(minDelay, maxDelay);

        this.time.addEvent({
            delay: randomDelay,
            callback: () => {
                this.createMovingObstacle();
                this.generateRandomMovingObstacle();
            }
        });
    }

    createMovingObstacle() {
        const obstacle = this.movingObstacles.create(0, 0, 'movingObstacle');
        obstacle.setX(this.sys.canvas.width + obstacle.displayWidth / 2);
        obstacle.setY(this.sys.canvas.height - this.height - obstacle.displayHeight / 2);
        obstacle.setVelocityX(-this.speed * 60);
        return obstacle;
    }

    update() {
        this.speed += this.speedUp;

        this.platforms.children.iterate((child) => {
            const platform = child as Phaser.Physics.Arcade.Image;
            platform.x -= this.speed;

            if (platform.x < -platform.displayWidth) {
                platform.x = platform.scene.sys.canvas.width + platform.displayWidth;
            }
        })

        this.staticObstacles.children.iterate((child) => {
            if (!child) return;
            const obstacle = child as Phaser.Physics.Arcade.Image;
            obstacle.x -= this.speed;

            if (obstacle.x < -obstacle.displayWidth / 2) {
                obstacle.destroy();
            }
        })
    }
}