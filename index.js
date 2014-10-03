var app = require('http').createServer(handler)
var io = require('socket.io')(app)

var static = require('node-static')
var file = new static.Server('./build')

function handler (request, response) {
    request.addListener('end', function () {
        file.serve(request, response)
    }).resume()
}

app.listen( process.env.PORT || 9000 )

console.log( '***** live on port', (process.env.PORT||9000), '*****' )

// var players = {

//   list: [],
//   p1: {
//     name : null,
//     socket: null,
//     turns : []
//   },
//   p2: {
//     name : null,
//     socket: null,
//     turns : []
//   }

// }

var Player = function (socket, name) {}

var players = [], p1, p2, isGame = false, p1t, p2t

io.on('connection', function (socket) {

  socket.on('join-lobby', function () {
    console.log(socket.id, 'has joined lobby')

    socket.emit('id', socket.id)

    players.push(socket.id)
  	io.sockets.emit('players-list', players)

  	// if(isGame === true) socket.emit('new-game', {p1: p1, p2: p2})

  	if(isGame === false && players.length >= 2) {
      newGame(socket)
  	}

    socket.on('action', function(move) {

      if(socket.id === p1) p1t = move
      if(socket.id === p2) p2t = move

      console.log('p1', p1t)
      console.log('p2', p2t)

      if(p1t && p2t) {
        io.sockets.emit('turn', {p1: p1t, p2: p2t})
        p1t = {}
        p2t = {}
      }
    })
  })

  socket.on('win', function(winner) {

    //if both players agree on who won, that player wins, else, draw
    io.sockets.emit('game-end', 'todo')
  })

  socket.on('leave-lobby', function () {
    leaveLobby(socket)
  })

  socket.on('disconnect', function () {
    leaveLobby(socket)
  })

})

function leaveLobby(socket) {
  if(players.indexOf(socket.id) !== -1) {
    players.splice(players.indexOf(socket.id, 0))
    if(socket.id === p1 || socket.id === p2) gameOver(socket)
    io.sockets.emit('players-list', players)
    console.log(socket.id, 'has left lobby')
  }
}

var tick = 1

function newGame(socket) {
  console.log('starting new game')

  // setInterval(function () {
  //   console.log('tick')

  //   var t
  //   if(tick === 1) {
  //     t = {rightShoulder: 'expand', leftShoulder: 'contract' }
  //     tick = 0
  //   } else {
  //     t = {rightShoulder: 'contract', leftShoulder: 'expand' }
  //     tick = 1
  //   }

  //   io.sockets.emit('turn', {p1: t, p2: {}})
  // }, 10000)

  isGame = true
  p1 = players[0]
  p2 = players[1]
  p1t = {}
  p2t = {}

  io.sockets.emit('new-game', {p1: p1, p2: p2})
}

function gameOver(socket) {
  console.log('ending game')
  isGame = false
  io.sockets.emit('game-over')
}