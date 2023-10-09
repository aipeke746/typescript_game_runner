import Phaser from 'phaser'

import PlayScene from './scenes/PlayScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	// width: 800,
	// height: 500,
	physics: {
		default: 'arcade',
		arcade: {
			// gravity: { y: 2000 },
			debug: true
		}
	},
	scale: {
		parent: 'game',
		mode: Phaser.Scale.RESIZE,
	},
	scene: [PlayScene]
}

export default new Phaser.Game(config)
