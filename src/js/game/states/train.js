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

    var backButton = new Button(game, { x: 100, y: 50, text: 'back' },
    function () {
      game.state.start('singleplayermenu')
    })

    arena = new Arena(game)
    arena.createPlayers()

    arena.players['p1'].setController('me')
    arena.players['p1'].method0()

    arena.players['p2'].setController('dummy')
    arena.players['p2'].method0()

    // p1.ragdoll.children.forEach(function (part) {
    //   part.body.onBeginContact.add(function (a, b, c, d, e) {
    //     console.log(b)
    //   })
    // })

    // debug
    window.game = game
  }

  var frameCount = 0
  var newTurn = false

  gameState.update = function () {

    frameCount++

    if(arena.players['p1'].resetPlayback() || arena.players['p2'].resetPlayback()) {
      arena.sameTurn()
      frameCount = 0
    }

    if(frameCount === 100) {
      frameCount = 0

      if(newTurn === true) {
        arena.newTurn()
        newTurn = false
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
    game.physics.destroy()
  }

  return gameState
}