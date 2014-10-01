var Player = require('../Player.js')
var Arena = require('../Arena.js')

var socket

module.exports = function(game) {

  var gameState = {}

  var p1, p2, isP1, isP2

  var id

  var players

  var frameCount = 0
  var newTurn = false
  var hasPlayedBack = false
  var isSpacebarLocked = false

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true
  }

  gameState.create = function () {

    socket = io('http://localhost:9000')

    var arena = new Arena(game)

  	var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}
  	var mainMenuButton = game.add.text(100, 50, 'back', style)
    mainMenuButton.anchor.setTo(0.5, 0.5)
    mainMenuButton.inputEnabled = true
    mainMenuButton.events.onInputDown.add(function() {
			game.state.start('multiplayermenu')
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
      players = playerList.map(function(player, i) {
        return game.add.text(550, 20*(i+1), player, {fill: '#ffffff', font: '16px Arial'})
      })
    })

    socket.on('new-game', function (players) {

      console.log('new-game', players)

      if(players.p1 === id) {
        isP1 = true
        p1.setController('me')
        console.log('you are p1')
      } else {
        isP2 = false
        p1.setController('network')
      }

      if(players.p2 === id) {
        isP2 = true
        p2.setController('me')
        console.log('you are p2')
      } else {
        isP2 = false
        p2.setController('network')
      }

      p1.reset()
      p1.method0()
      p2.reset()
      p2.method0()

      socket.on('turn', function (turn) {
        p1.setLastTurn(turn.p1)
        p2.setLastTurn(turn.p2)
        newTurn = true
        isSpacebarLocked = false
      })
    })

    // debug
    window.socket = socket
    window.game = game
    window.p1 = p1
    window.p2 = p2

  }

  gameState.update = function () {

    if(p1 && p2) {

      frameCount++

      if(p1.resetPlayback() || p2.resetPlayback()) {
        p1.method2()
        p2.method2()
        frameCount = 0
      }

      if(frameCount === 1 && newTurn === true) {
        p1.executeMoves(p1.getLastTurn(), 0.5)
        p2.executeMoves(p2.getLastTurn(), 0.5)
        hasPlayedBack = true
      } 

      if(frameCount === 100) {

        if(newTurn && hasPlayedBack) {
          p1.method1()
          p2.method1()
          newTurn = false
          hasPlayedBack = false
          frameCount = 0
          console.log('method1')
        } else {
          console.log('method2')
          frameCount = 0
          p1.method2()
          p2.method2()
        }
      }

      if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
        if(isP1 || isP2) {
          if(!isSpacebarLocked) {
            var p = isP1 ? p1 : p2
            socket.emit('action', p.turnHistory[p.turnHistory.length-1])
            isSpacebarLocked = true
          }
        }
      }
    }
  }

  gameState.shutdown = function () {
    socket.emit('leave-lobby')
    p1.destroy()
    p2.destroy()
    game.physics.destroy()
  }

  return gameState
}