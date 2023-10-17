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
        this.load.image('platform', 'assets/image/platform.png');
        this.load.image('player', 'assets/image/player.png');
        // image: obstacle type
        this.load.image('sleep', 'assets/image/sleep.png');
        this.load.image('cry', 'assets/image/cry.png');
        this.load.image('so-so', 'assets/image/so-so.png');
        this.load.image('happy', 'assets/image/happy.png');
        // sound
        this.load.audio('jump', 'assets/sound/jump.mp3');
        this.load.audio('damage', 'assets/sound/damage.mp3');
        this.load.audio('die', 'assets/sound/die.mp3');
    }

    create() {
        // sound
        const jumpSound = this.sound.add('jump');
        const dieSound = this.sound.add('die');

        // platforms
        this.platforms = new Platform(this, this.param);

        // player
        this.player = new Player(this, this.param);
        this.player.setJumpSound(jumpSound);
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
                dieSound.play();
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