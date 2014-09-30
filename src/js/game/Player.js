var Ragdoll = require('./Ragdoll.js')

/*
 * Player class
 *
 * @extends Ragdoll
 * @constructor Player
 */
var Player = function (game, x, y) {

	/**
	 * @reference {Phaser.game} game
	 */
	this.game = game

	/**
 	 * @Object {Phaser.group} ragdoll
	 */
	this.ragdoll = Ragdoll(game, x, y)

	/**
	 * @property {Boolean} isReady
	 */
	this.isReady = false

	/** 
   * @property {Boolen} isAllowingInput
   */
  this.isAllowingInput = true

  /**
   * a turn is an Array of actions
   * an 'action' is a joint event - ex: {jointName:'neck', type:'relax'}
   *
   * @property {Array} turnHistory
   */
  this.turnHistory = []

  /**
   *
   *
   * @property {Array} currentPosition
   */
  this.currentPosition = []

  /**
   *
   * @property {Number} health
   */
  this.health = 100

}

/**
 * pushes an empty turn Object to turnHistory
 * ragdoll.newAction will push moves to newly pushed Object
 *
 * @method newTurn
 */
Player.prototype.newTurn = function () {
  this.turnHistory.push({})

  this.ragdoll.children.forEach(function (part) {
    part.loadTexture('whitesquare')
  })
}

/**
 * register a new move to latest turn on turnHistory
 *
 * @method newAction
 * @param {Object} move
 */
Player.prototype.newAction = function (move) {
  this.turnHistory[this.turnHistory.length-1][move.jointName] = move.type
}

/**
 * save current position and velocity
 * 
 * @method savePosition
*/
Player.prototype.savePosition = function () {

  this.currentPosition = this.ragdoll.children.map( function (part) {
    var data = part.body.data
    return {
      x: data.position[0], 
      y: data.position[1],
      vx: data.velocity[0],
      vy: data.velocity[1],
      angle: data.angle,
      angularVelocity: data.angularVelocity
    }
  })
}

/**
 * move ragdoll to last position on postision history
 * 
 * @method loadPosition
 */
Player.prototype.loadPosition = function () {

  var pos = this.currentPosition
  this.ragdoll.children.forEach(function(part, i) {
    var data = part.body.data
    data.position[0] = pos[i].x
    data.position[1] = pos[i].y
    data.angle = pos[i].angle,
    data.angularVelocity = pos[i].angularVelocity,
    data.velocity[0] = pos[i].vx,
    data.velocity[1] = pos[i].vy
  })
}

/**
 * create shallow copy of ragdoll with no physics
 *
 * @method clone
 * @return {Phaser.Group} a copy of ragdoll
*/
Player.prototype.clone = function () {
  var ragdollClone = this.game.add.group()

  var parts = this.ragdoll.children.forEach(function(part) {
    var clone = ragdollClone.create(part.position.x, part.position.y, part.key)
    clone.width = part.width
    clone.height = part.height
    clone.rotation = part.rotation
    clone.anchor.x = part.anchor.x
    clone.anchor.y = part.anchor.y
    clone.name = part.name
  })
  return ragdollClone
}

/**
 * singleton clone
 *
 * @method shadow
 */
Player.prototype.shadow = function () {

  if(this.shadowClone) this.shadowClone.destroy(true)

  this.shadowClone = this.clone()
  
  // TODO
  attachEvents(this.shadowClone, this)
}

/**
 * move ragdoll
 *
 * @method executeMove
 * @param {String} jointName
 * @param {String} type
 */
Player.prototype.executeMove = function (jointName, type) {
  switch (type) {
    case 'expand'  : this.ragdoll.flex(jointName)  ;break 
    case 'contract': this.ragdoll.flex(jointName)  ;break 
    case 'relax'   : this.ragdoll.relax(jointName) ;break 
    case 'tense'   : this.ragdoll.tense(jointName) ;break 
  }
}

/**
 * a turn is an array of moves
 *
 * @method executeMoves
 * @param {Array} turn
 */
Player.prototype.executeMoves = function (turn, alpha) {
  var _this = this

  _this.ragdoll.alpha = alpha || 1 

  Object.keys(turn).forEach(function (jointName) {
    _this.executeMove(jointName, turn[jointName])
  })
}

//// TODO ////

// TEMP - TODO
function attachEvents (ragdoll, ctx) {
	ragdoll.children.forEach(function(part){
    part.inputEnabled = true
    part.events.onInputDown.add(function(e) {
      muscleClick.call(ctx, e.name)
    })
  })
}

// TEMP - TODO
function muscleClick (muscleName) {

joint = {
  'head'         : 'neckJoint',
  'upperLeftArm' : 'leftShoulder',
  'lowerLeftArm' : 'leftElbowJoint',
  'upperRightArm': 'rightShoulder',
  'lowerRightArm': 'rightElbowJoint',
  'upperLeftLeg' : 'leftHipJoint',   
  'lowerLeftLeg' : 'leftKneeJoint',  
  'upperRightLeg': 'rightHipJoint', 
  'lowerRightLeg': 'rightKneeJoint', 
  'pelvis'       : 'spineJoint',     
  'upperBody'    : 'spineJoint'
}

  var jointName = joint[muscleName]

  this.newAction({
  	jointName: jointName, 
  	type: 'expand'
  })

  this.shadowClone.children.filter(function (part) {
    return part.name === muscleName
  })[0].loadTexture('bluesquare')
}

// -todo
Player.prototype.method0 = function () {
  this.newTurn()
  this.savePosition()
  this.shadow()
}
// -todo
Player.prototype.method1 = function () {
	this.ragdoll.relaxAll()
  this.newTurn()
  this.savePosition()
  this.shadow()
}
// -todo
Player.prototype.method2 = function () {
	this.loadPosition()
  this.ragdoll.relaxAll()
  this.executeMoves(this.turnHistory[this.turnHistory.length-1], 0.5)
}



module.exports = Player