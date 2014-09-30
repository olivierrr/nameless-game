var Player = require('../Player.js')

var socket

module.exports = function(game) {

  var gameState = {}

  var p1, p2, isP1, isP2

  var isPlaying = false

  var id

  var game = game

  gameState.create = function () {

    socket = window.socket = io('http://localhost:9000')

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 200

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

    p1 = new Player(game, 200, 200)
    p1.method0()
    p2 = new Player(game, 600, 200)
    p2.method0()

    socket.emit('join-lobby')

    socket.on('id', function(socketId) {
      console.log('id', socketId)
      id = socketId
    })

    socket.on('players-list', function (playerList) {
      console.log(playerList)
      playerList.forEach(function(player, i) {
        game.add.text(550, 20*(i+1), player, {fill: '#ffffff', font: '16px Arial'})
      })
    })

    socket.on('new-game', function (players) {

      console.log(players)

      isP1 = false
      isP2 = false

      if(players.p1 === id) {
        isP1 = true
        p1.setController('me')
        p1.reset()
        p1.method0()
        console.log('you are p1')
      } else {
        isP2 = false
        p1.setController('dummy')
        p1.reset()
        p1.method0()
      }

      if(players.p2 === id) {
        isP2 = true
        p2.setController('me')
        p2.reset()
        p2.method0()
        console.log('you are p2')
      } else {
        isP2 = false
        p2.setController('dummy')
        p2.reset()
        p2.method0()
      }

      var p1id = players.p1
      var p2id = players.p2

      socket.on('turn', function (turn) {
        if(isP2) {
          p1.turnHistory.push(turn.p1)
        } 
        else if(isP1) {
          p2.turnHistory.push(turn.p2)
        }
        else {
          p1.turnHistory.push(turn.p1)
          p2.turnHistory.push(turn.p2)
        }

        p1.method1()
        p2.method1()

        console.log(turn)
      })
    })
    
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
        p1.method2()
        p2.method2()
      }

      if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
        if(isP1 || isP2) {
          socket.emit('action', id)
        }
      }
    }

  }

  return gameState
}