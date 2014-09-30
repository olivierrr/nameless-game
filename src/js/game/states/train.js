var Player = require('../Player.js')

module.exports = function(game) {

  var gameState = {}

  var p1

  gameState.create = function () {

  	var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}
  	var mainMenuButton = game.add.text(100, 50, 'back', style)
    mainMenuButton.anchor.setTo(0.5, 0.5)
    mainMenuButton.inputEnabled = true
    mainMenuButton.events.onInputDown.add(function() {
			game.state.start('singleplayermenu')
      p1.ragdoll.destroy(true)
    })

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 300

    p1 = new Player(game, 100, 100)
    p1.method0()
    
    // debug
    window.game = game
    window.o = p1
  }

  var frameCount = 0
  var newTurn = false

  gameState.update = function () {

    frameCount++

    if(frameCount === 100) {
      frameCount = 0
      
      if(newTurn === false) {
        p1.method2()
      }

      if(newTurn === true) {
        p1.method1()
        newTurn = false
      }
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      newTurn = true
    }
  }

  return gameState
}