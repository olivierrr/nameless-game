module.exports = function(game) {

  var gameState = {}

  gameState.create = function () {
  	
  	var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}
  	var mainMenuButton = game.add.text(100, 50, 'back', style)
    mainMenuButton.anchor.setTo(0.5, 0.5)
    mainMenuButton.inputEnabled = true
    mainMenuButton.events.onInputDown.add(function() {
			game.state.start('singleplayermenu')
    })

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1200;

  }

  return gameState
}