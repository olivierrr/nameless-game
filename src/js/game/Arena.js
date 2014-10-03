
var Player = require('./Player')

/*
 * Arena class
 *
 * @constructor Arena
 */
var Arena = function (game) {

	/*
	 * @reference {Phaser.game} game
	 */
	this.game = game

	/*
	 * @references {Player}
	 */
	this.players = {}

	this.init()

	return this
}

/*
 * @method init
 */
Arena.prototype.init = function() {
	this.game.physics.startSystem(Phaser.Physics.P2JS)

  this.game.physics.p2.gravity.y = 800
  this.game.physics.p2.world.solver.iterations = 1000

  this.game.physics.wallMaterial = this.game.physics.p2.createMaterial('wallMaterial')
  this.game.physics.p2.setWorldMaterial(this.game.physics.wallMaterial, true, true, true, true)

  // Turn on impact events for the world, without this we get no collision callbacks
  this.game.physics.p2.setImpactEvents(true)

  // debug
  window.P2 = this.game.physics.p2
}

/*
 * @method
 */
Arena.prototype.createPlayers = function () {
	this.players['p1'] = new Player(this.game, 200, 200)
	this.players['p2'] = new Player(this.game, 600, 200)
}

/*
 * @method
 */
Arena.prototype.resetPlayers = function () {
	this.forEachPlayer(function (p) {
		p.reset()
	})
}

/*
 * @method
 */
Arena.prototype.setControllers = function (p1, p2) {
	this.players['p1'].setController(p1)
	this.players['p2'].setController(p2)
}

/*
 * multi purpose itterator
 *
 * @method
 */
Arena.prototype.forEachPlayer = function (cb) {
	var players = this.players
	Object.keys(players).forEach(function (p) { cb(players[p]) })
}

/*
 * @method
 */
Arena.prototype.newTurn = function () {
	this.forEachPlayer(function (p) {
		p.method1()
	})
}

/*
 * @method
 */
Arena.prototype.sameTurn = function () {
	this.forEachPlayer(function (p) {
		p.method2()
	})
}

/*
 * @method destroy
 */
Arena.prototype.destroy = function () {
	this.forEachPlayer(function (p) { 
		p.destroy() 
	})
	this.game.physics.destroy()
}

module.exports = Arena