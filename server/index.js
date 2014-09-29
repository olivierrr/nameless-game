var app = require('http').createServer(handler)
var io = require('socket.io')(app)
var fs = require('fs')

app.listen(9000)

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500)
      return res.end('Error 500')
    }
    res.writeHead(200)
    res.end(data)
  })
}

var players = [], p1, p2, isGame = false, p1t, p2t

io.on('connection', function (socket) {

  socket.on('join-lobby', function () {

  	socket.broadcast.to(socket.id).emit('players-list', players)

  	socket.emit('player-list', players)
  	players.push(socket.id)

  	if(isGame === false && players.length >= 2) {
  		isGame = true
  		p1 = players[0]
			p2 = players[1]
			p1t = false
			p2t = false

			socket.emit('new-game', {p1: p1, p2: p2})

			socket.on('action', function(move) {

				if(socket.id === p1 || socket.id === p2) {

					if(socket.id === p1) p1t = move
					if(socket.id === p2) p2t = move

					if(p1t && p2t) {
						cosket.emit('turn', {p1: p1t, p2: p2t})
						p1t = false
						p2t = false
					}
				}
			})
  	}
  })

  socket.on('disconnect', function () {
  	socket.emit('player-list', players)
  	players.splice(players.indexOf(socket.id, 0))
  })

})