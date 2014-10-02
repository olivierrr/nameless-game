var Button = require('../Button.js')

module.exports = function(game) {

  var gameState = {}

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true
  }

  gameState.create = function () {

    var logo = game.add.sprite(game.world.centerX, 200, 'logo')
    logo.anchor.setTo(0.5, 0.5)

    var a = new Button(game, { x: game.world.centerX, y: 450, text: 'single player' },
    function () {
      game.state.start('singleplayermenu')
    })

    var b = new Button(game, { x: game.world.centerX, y: 500, text: 'multi player' },
    function () {
      game.state.start('multiplayermenu')
    })

    var c = new Button(game, { x: game.world.centerX, y: 550, text: 'settings' },
    function () {
      game.state.start('settingsmenu')
    })
  }

  gameState.update = function() {
  	
  }

  return gameState
}
