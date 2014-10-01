var Player = require('../Player.js')

module.exports = function(game) {

  var gameState = {}

  var p1, p2

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true
  }

  gameState.create = function () {

  	var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}
  	var mainMenuButton = game.add.text(100, 50, 'back', style)
    mainMenuButton.anchor.setTo(0.5, 0.5)
    mainMenuButton.inputEnabled = true
    mainMenuButton.events.onInputDown.add(function() {
			game.state.start('singleplayermenu')
    })

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 150

    game.physics.wallMaterial = game.physics.p2.createMaterial('wallMaterial')
    game.physics.p2.setWorldMaterial(game.physics.wallMaterial, true, true, true, true)

    p1 = new Player(game, 200, 200)
    p1.setController('me')
    p1.method0()

    p2 = new Player(game, 600, 200)
    p2.setController('dummy')
    p2.method0()
    
    // debug
    window.game = game
    window.p1 = p1
    window.p2 = p2
  }

  var frameCount = 0
  var newTurn = false

  gameState.update = function () {

    frameCount++

    if(p1.resetPlayback() || p2.resetPlayback()) {
      p1.method2()
      p2.method2()
      frameCount = 0
    }

    if(frameCount === 100) {
      frameCount = 0

      if(p1.ready() && p2.ready()) {
        p1.method1()
        p2.method1()
      } else {
        p1.method2()
        p2.method2()
      }
    }

    if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
      p1.isReady = true
      p2.isReady = true
    }
  }

  gameState.shutdown = function () {
    p1.ragdoll.destroy()
    p2.ragdoll.destroy()
    p1 = null
    p2 = null
  }

  return gameState
}