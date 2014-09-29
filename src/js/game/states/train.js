var Ragdoll = require('../Ragdoll.js')

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
      p1.destroy(true)
    })

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 300

    p1 = Ragdoll(game, 100, 100)
    p1.newTurn()
    p1.savePosition()
    p1.shadow()

    // debug
    window.game = game
    window.o = p1
  }

  var frameCount = 0
  var newTurn = false

  gameState.update = function () {

    if(game.paused === false) {
      frameCount++
    }

    if(frameCount === 100) {
      frameCount = 0
      
      if(newTurn === false) {
        p1.loadPosition()
        p1.relaxAll()
        p1.executeMoves(p1.moveHistory[p1.moveHistory.length-1], 0.5)
      }

      if(newTurn === true) {
        p1.relaxAll()
        p1.newTurn()
        p1.savePosition()
        p1.shadow()
        newTurn = false
      }
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      console.log('spacebar')
      newTurn = true
    }
  }

  return gameState
}