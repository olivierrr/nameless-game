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

console.log( 'port', (process.env.PORT||9000) )

var players = [], p1, p2, isGame = false, p1t, p2t

io.on('connection', function (socket) {

  socket.on('join-lobby', function () {

    console.log(socket.id, 'has joined lobby')

    io.to(socket.id).emit('id', socket.id)

    players.push(socket.id)
  	io.sockets.emit('players-list', players)

  	//if(isGame === true) socket.broadcast.to(socket.id).emit('new-game', {p1: p1, p2: p2})

  	if(isGame === false && players.length >= 2) {
      console.log('starting new game')

  		isGame = true
  		p1 = players[0]
			p2 = players[1]
			p1t = false
			p2t = false

			io.sockets.emit('new-game', {p1: p1, p2: p2})
  	}

    socket.on('action', function(move) {

      if(socket.id === p1) {
        p1t = move
      }
      if(socket.id === p2) {
        p2t = move
      }

      console.log(move)

      if(p1t && p2t) {
        io.sockets.emit('turn', {p1: p1t, p2: p2t})
        p1t = false
        p2t = false
      }
    })
  })

  socket.on('leave-lobby', function () {
    players.splice(players.indexOf(socket.id, 0))
    if(socket.id === p1 || socket.id === p2) isGame = false
    io.sockets.emit('players-list', players)
    console.log(socket.id, 'has left lobby')
    socket.disconnect()
  })

  socket.on('disconnect', function () {
  	players.splice(players.indexOf(socket.id, 0))
    if(socket.id === p1 || socket.id === p2) isGame = false
  	io.sockets.emit('players-list', players)
    console.log(socket.id, 'has left lobby')
  })

})