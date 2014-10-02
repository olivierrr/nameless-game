
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

	game.physics.startSystem(Phaser.Physics.P2JS)

  game.physics.p2.gravity.y = 800
  game.physics.p2.world.solver.iterations = 100

  game.physics.wallMaterial = game.physics.p2.createMaterial('wallMaterial')
  game.physics.p2.setWorldMaterial(game.physics.wallMaterial, true, true, true, true)

  // Turn on impact events for the world, without this we get no collision callbacks
  game.physics.p2.setImpactEvents(true)

  // debug
  window.P2 = game.physics.p2
}

/*
 * @todo
 *
 * @method destroy
 */
Arena.prototype.destroy = function () {

}

module.exports = Arena