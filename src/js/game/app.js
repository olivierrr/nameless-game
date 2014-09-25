var Phaser = require('Phaser')
  , properties = require('./properties')

var states = { 
		boot: require('./states/boot.js'),
		preloader: require('./states/preloader.js'),
		mainmenu: require('./states/mainmenu.js'),
		singleplayermenu: require('./states/singleplayermenu.js'),
		multiplayermenu: require('./states/multiplayermenu.js'),
		settingsmenu: require('./states/settingsmenu.js'),
		train: require('./states/train.js')
  }

var game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game')

game.state.add('boot', states.boot(game))
game.state.add('preloader', states.preloader(game))
game.state.add('mainmenu', states.mainmenu(game))
game.state.add('singleplayermenu', states.singleplayermenu(game))
game.state.add('multiplayermenu', states.multiplayermenu(game))
game.state.add('settingsmenu', states.settingsmenu(game))
game.state.add('train', states.train(game))

game.state.start('boot')
