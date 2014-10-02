var Button = require('../Button.js')

module.exports = function(game) {

  var gameState = {}

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true
  }

  gameState.create = function () {
    var backButton = new Button(game, { x: 100, y: 50, text: 'back' },
    function () {
      game.state.start('mainmenu')
    })
  }

  return gameState
}