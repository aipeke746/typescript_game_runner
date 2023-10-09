import Phaser, { Scene } from 'phaser';
import { GameParameter } from '../entity/GameParameter';
import { Platform } from '../entity/Platform';
import { Player } from '../entity/Player';
import { Obstacle } from '../entity/Obstacle';

export default class PlayScene extends Phaser.Scene {
    private param: GameParameter = new GameParameter();
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