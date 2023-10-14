import Phaser, { Scene } from 'phaser';
import { GameParameter } from '../entity/GameParameter';
import { Platform } from '../entity/Platform';
import { Score } from '../entity/Score';
import { Player } from '../entity/Player';
import { Obstacle } from '../entity/Obstacle/Obstacle';
import { StandingObstacle } from '~/entity/Obstacle/StandingObstacle';
import { WalkingObstacle } from '~/entity/Obstacle/WalkingObstacle';
import { FlyingObstacle } from '~/entity/Obstacle/FlyingObstacle';
import { JumpingObstacle } from '~/entity/Obstacle/JumpingObstacle';

export default class PlayScene extends Phaser.Scene {
    private param: GameParameter = new GameParameter();
    private platforms!: Platform;
    private player!: Player;
    private obstacles!: Obstacle[];
    private score!: Score;

    constructor() {
        super('PlayScene');
    }

    preload() {
        this.load.image('platform', 'assets/platform.png');
        this.load.image('player', 'assets/player.png');
        // obstacle types
        this.load.image('sleep', 'assets/sleep.png');
        this.load.image('cry', 'assets/cry.png');
        this.load.image('so-so', 'assets/so-so.png');
        this.load.image('happy', 'assets/happy.png');
    }

    create() {
        // platforms
        this.platforms = new Platform(this, this.param);

        // player
        this.player = new Player(this, this.param);
        this.player.jump(this);

        // obstacles
        this.obstacles = [new StandingObstacle(this, 'sleep', this.param)];
        this.obstacles.push(new WalkingObstacle(this, 'cry', this.param));
        this.obstacles.push(new FlyingObstacle(this, 'so-so', this.param));
        this.obstacles.push(new JumpingObstacle(this, 'happy', this.param));

        // score
        this.score = new Score(this);
        this.score.get();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.param.speedUp();
                this.score.increase(this.param.getSpeed());
            },
            loop: true
        })

        // collider
        this.physics.add.collider(this.player.get(), this.platforms.get());
        this.obstacles.forEach(obstacle => {
            this.physics.add.collider(obstacle.get(), this.platforms.get());
            this.physics.add.collider(this.player.get(), obstacle.get(), () => {
                // game over
                this.physics.pause();
                this.player.get().setTint(0xff0000);
            }, undefined, this);
        });
    }

    update() {
        this.platforms.moving(this.param);
        this.obstacles.forEach(obstacle => {
            obstacle.moving(this.param);
        });
    }
}