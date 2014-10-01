module.exports = function(game) {

  var gameState = {}

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true

    game.load.image('logo', 'images/phaser.png#grunt-cache-bust')
    game.load.image('redsquare', 'images/redsquare.png#grunt-cache-bust')
    game.load.image('bluesquare', 'images/bluesquare.jpg#grunt-cache-bust')
    game.load.image('whitesquare', 'images/whitesquare.png#grunt-cache-bust')
  }

  gameState.create = function () {
    game.state.start('mainmenu')
  }

  return gameState
}
