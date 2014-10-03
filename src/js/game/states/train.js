var Player = require('../Player.js')
var Arena = require('../Arena.js')
var Button = require('../Button.js')

module.exports = function(game) {

  var gameState = {}

  var arena

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true
  }

  gameState.create = function () {

    // back button
    var backButton = new Button(game, { x: 100, y: 50, text: 'back' },
    function () {
      game.state.start('singleplayermenu')
    })

    arena = new Arena(game)
    arena.createPlayers()
    arena.setControllers('me', 'dummy')
    arena.newTurn()
  }

  var frameCount = 0
  var newTurn = false
  var hasPlayedBack = false

  gameState.update = function () {

    frameCount++

    if(arena.players['p1'].resetPlayback() || arena.players['p2'].resetPlayback()) {
      frameCount = 0
      arena.sameTurn()
    }

    if(frameCount === 1 && newTurn === true) {
      arena.cinematicPlayback()
      hasPlayedBack = true
    }

    if(frameCount === 100) {
      frameCount = 0

      if(newTurn === true && hasPlayedBack === true) {
        arena.newTurn()
        newTurn = false
        hasPlayedBack = false
      } else {
        arena.sameTurn()
      }
    }

    if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
      newTurn = true
    }
  }

  gameState.shutdown = function () {
    arena.destroy()
  }

  return gameState
}