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
    })

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 300

    p1 = Ragdoll(game)

    // debug
    window.game = game 
    window.o = p1
  }

  var frameCount = 0 //

  gameState.update = function () {

    if(game.paused === false) frameCount++

    if(frameCount === 100) {
      frameCount = 0
      p1.relaxAll()
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      console.log('spacebar')
    }
  }

  return gameState
}