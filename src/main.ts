import Phaser from 'phaser'

import PlayScene from './scenes/PlayScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}
	},
	scale: {
		parent: 'game',
		mode: Phaser.Scale.FIT,
	},
	scene: [PlayScene]
}

export default new Phaser.Game(config)
