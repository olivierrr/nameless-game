var Player = require('../Player.js')
var Arena = require('../Arena.js')
var Button = require('../Button.js')

var socket

module.exports = function(game) {

  var gameState = {}

  var p1, p2, isP1, isP2

  var id

  var players = []

  var frameCount = 0
  var newTurn = false
  var hasPlayedBack = false
  var isSpacebarLocked = false

  var currentWarning

  gameState.preload = function () {
    game.stage.disableVisibilityChange = true
  }

  gameState.create = function () {

    socket = io('http://localhost:9000')

    var arena = new Arena(game)

    var backButton = new Button(game, { x: 100, y: 50, text: 'back' },
    function () {
      game.state.start('multiplayermenu')
    })

    function warning (message) {
      if(!currentWarning) {
        currentWarning = game.add.text(game.world.centerX, 150, message, { font: '30px Arial', fill: '#ffffff', align: 'center' } )
        currentWarning.anchor.setTo(0.5, 0.5)
      }
      currentWarning._text = message
      window.setTimeout(function () { 
        game.add.tween(currentWarning).to( {alpha: 0}, 1000, Phaser.Easing.Linear.None, true)
      }, 1000)
    }

    p1 = new Player(game, 200, 200)
    p1.method0()
    p2 = new Player(game, 600, 200)
    p2.method0()

    socket.emit('join-lobby')

    socket.on('id', function(socketId) {
      console.log('id', socketId)
      id = socketId
      warning('you are ' + id)
    })

    // could recycle text objects
    socket.on('players-list', function (playerList) {
      players.forEach(function (p) { p.destroy() })
      players = playerList.map(function(player, i) {
        return game.add.text(550, 20*(i+1), player, {fill: '#ffffff', font: '16px Arial'})
      })
    })

    socket.on('new-game', function (players) {
      warning('game starting...')
      console.log('new-game', players)

      if(players.p1 === id) {
        isP1 = true
        p1.setController('me')
        warning('you are p1')
      } else {
        isP2 = false
        p1.setController('network')
      }

      if(players.p2 === id) {
        isP2 = true
        p2.setController('me')
        warning('you are p2')
      } else {
        isP2 = false
        p2.setController('network')
      }

      p1.reset()
      p2.reset()
      p1.method0()
      p2.method0()

      socket.on('turn', function (turn) {
        frameCount = 0
        p1.setLastTurn(turn.p1)
        p2.setLastTurn(turn.p2)
        p1.loadPosition()
        p2.loadPosition()
        newTurn = true
        isSpacebarLocked = false
      })
    })

    socket.on('game-over', function () {
      warning('game over')
      p1.reset()
      p2.reset()
      p1.method0()
      p2.method0()
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
        p1.destroyShadow()
        p2.destroyShadow()
        p1.executeMoves(p1.getLastTurn(), 1)
        p2.executeMoves(p2.getLastTurn(), 1)
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
          console.log(p1.ragdoll.joints)
        }
      }

      if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
        if(isP1 || isP2) {
          if(!isSpacebarLocked) {
            var p = isP1 ? p1 : p2
            socket.emit('action', p.getLastTurn())
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