var Player = require('../Player.js')

var socket

module.exports = function(game) {

  var gameState = {}

  var p1, p2, isP1, isP2

  var isPlaying = false

  var id

  gameState.create = function () {

    socket = window.socket = io('http://localhost:9000')

  	var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}
  	var mainMenuButton = game.add.text(100, 50, 'back', style)
    mainMenuButton.anchor.setTo(0.5, 0.5)
    mainMenuButton.inputEnabled = true
    mainMenuButton.events.onInputDown.add(function() {
      socket.emit('leave-lobby')
			game.state.start('multiplayermenu')

      if(p1&&p2) {
        p1.ragdoll.destroy()
        p2.ragdoll.destroy()
        p1 = null
        p2 = null
      }
    })

    socket.emit('join-lobby')
    socket.on('id', function(socketId) {
      console.log('id', socketId)
      id = id
    })

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 200

    socket.on('players-list', function (playerList) {
      console.log(playerList)
      playerList.forEach(function(player, i) {
        game.add.text(550, 20*(i+1), player, {fill: '#ffffff', font: '16px Arial'})
      })
    })

    socket.on('new-game', function (players) {

      isP1 = false
      isP2 = false

      if(p1 || p2) {
        p1.ragdoll.destroy()
        p1 = null
        p2.ragdoll.destroy()
        p2 = null
      }

      if(id === players.p1 || id === players.p2) {

        if(players.p1 === id) {
          isP1 = true
          p1 = new Player('me', game, 200, 200)
          p1.method0()
        } else {
          p1 = new Player('network', game, 200, 200)
        }

        if(players.p2 === id) {
          isP2 = true
          p2 = new Player('me', game, 600, 200)
          p2.method0()
        } else {
          p2 = new Player('network', game, 600, 200)
        }
      }

      console.log(players)
      var p1id = players.p1
      var p2id = players.p2

      socket.on('turn', function (turn) {
        p2.turnHistory.push(turn)
        console.log(turn)
      })
    })

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 200
    
    // debug
    window.game = game
    window.p1 = p1
    window.p2 = p2

  }

  var frameCount = 0
  var newTurn = false

  gameState.update = function () {

    if(p1 && p2) {

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

      if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        p1.isReady = true
        p2.isReady = true
      }
    }
  }

  return gameState
}