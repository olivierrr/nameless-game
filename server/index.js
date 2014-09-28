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

var lobbies = {}

io.on('connection', function (socket) {


	/**
	 * @emit list of online lobbies
	 */
  socket.on('get-lobbies', function () {
    socket.emit('lobbies', { success: lobbies })
  })

  /**
   * @emit lobby info
   */
  socket.on('join-lobby', function (lobbyName) {
  	if (lobbies[lobbyName]) {
  		socket.join('lobbyName')
  		socket.emit('lobby', { success: lobbies[lobbyName] })
  	} else {
  		socket.emit('lobby', { error: 'lobby does not exist' })
  	}
  })

  /**
   * @emit
   */
  socket.on('leave-lobby', function (lobbyName) {
  	if (lobbies[lobbyName]) {
  		socket.leave(lobbyName)
  		socket.emit('lobby', { success: 'you have left ' + lobbyName })
  	} else {
  		socket.emit('lobby', { error: 'lobby does not exist' })
  	}
  })

  /**
   * @emit
   */
  socket.on('leave-lobby', function (lobbyName) {

  })

  /**
   * @emit
   */
  socket.on('leave-lobby', function (lobbyName) {

  })

  socket.on('disconnect', function () {

  })

})

/*
	lobby events/constructor?
*/
function Lobby (lobbyName) {
	var lobby = io.sockets.in(lobbyName)

	lobby.on('join', function (socket) {

		lobby.broadcast('user-joins', {})
	})

	Lobby.on('leave', function (socket) {

		lobby.broadcast('user-leaves', {})
	})
}