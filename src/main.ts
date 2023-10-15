import Phaser from 'phaser'

import PlayScene from './scenes/PlayScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
    },
    scene: [PlayScene]
}

export default new Phaser.Game(config)
