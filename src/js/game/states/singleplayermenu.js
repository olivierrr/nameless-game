module.exports = function(game) {

  var gameState = {}

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true
  }

  gameState.create = function () {

  	var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}
  	var mainMenuButton = game.add.text(100, 50, 'back', style)
    mainMenuButton.anchor.setTo(0.5, 0.5)
    mainMenuButton.inputEnabled = true
    mainMenuButton.events.onInputDown.add(function() {
			game.state.start('mainmenu')
    })

  	var train = game.add.text(game.world.centerX, 300, 'train', style)
    train.anchor.setTo(0.5, 0.5)
    train.inputEnabled = true
    train.events.onInputDown.add(function() {
			game.state.start('train')
    })
  }

  return gameState
}
