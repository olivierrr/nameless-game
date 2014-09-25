module.exports = function(game) {

  var gameState = {}

  gameState.create = function () {

    var logo = game.add.sprite(game.world.centerX, 200, 'logo')
    logo.anchor.setTo(0.5, 0.5)

    var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}

    var singlePlayerButton = game.add.text(game.world.centerX, 450, 'single player', style)
    singlePlayerButton.anchor.setTo(0.5, 0.5)
    singlePlayerButton.inputEnabled = true
    singlePlayerButton.events.onInputDown.add(function() {
			game.state.start('singleplayermenu')
    })

    var multiPlayerButton = game.add.text(game.world.centerX, 500, 'multi player', style)
    multiPlayerButton.anchor.setTo(0.5, 0.5)
    multiPlayerButton.inputEnabled = true
    singlePlayerButton.events.onInputDown.add(function() {
			game.state.start('multiplayermenu')
    })

    var settingsButton = game.add.text(game.world.centerX, 550, 'settings', style)
    settingsButton.anchor.setTo(0.5, 0.5)
    settingsButton.inputEnabled = true
    settingsButton.events.onInputDown.add(function() {
    	game.state.start('settingsmenu')
    })

  }

  gameState.update = function() {
  	
  }

  return gameState
}
