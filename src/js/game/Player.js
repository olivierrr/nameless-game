var Ragdoll = require('./Ragdoll.js')

/*
 * Player class
 *
 * @extends Ragdoll
 * @constructor Player
 */
var Player = function (controller, game, x, y) {

  /**
   * available controllers: 
   *  'me'      - controlled by users input
   *  'dummy'   - no conroller
   *  'network' - controller over network
   *
   * @property {String} controller
   * @default 'dummy'
   */
  this.controller = controller || 'dummy'

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
   * @property {Array} currentPosition
   */
  this.currentPosition = []

  /**
   * @property {Number} health
   */
  this.health = 100

  //TEST
  this.isResetingPlayback = false

  if(controller === 'dummy') {
    this.isAllowingInput = false
    this.isReady = true
  }
  if(controller === 'network') {
    this.isAllowingInput = false
  }
  if(controller === 'me') {

  }
}

/**
 * pushes an empty turn Object to turnHistory
 * ragdoll.newAction will push moves to newly pushed Object
 *
 * @method newTurn
 */
Player.prototype.newTurn = function () {
  this.turnHistory.push({})

  // this shouldn't be here
  this.ragdoll.children.forEach(function (part) {
    part.loadTexture('whitesquare')
  })

  this.isReady = false
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
  if(this.isAllowingInput) attachEvents(this.shadowClone, this)
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
    case 'expand'  : this.ragdoll.flex(jointName)     ;break 
    case 'contract': this.ragdoll.contract(jointName) ;break 
    case 'relax'   : this.ragdoll.relax(jointName)    ;break 
    case 'tense'   : this.ragdoll.tense(jointName)    ;break 
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

/**
 * -todo
 */
Player.prototype.replayLastMove = function (turn) {

  this.shadowClone.destroy()

  this.executeMove(turn, 1)
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
  var jointState = this.turnHistory[this.turnHistory.length-1][jointName]
  var action

  if(jointState === 'expand') action = 'contract'
  else if(jointState === 'contract') action = 'relax'
  else if(jointState === 'relax') action = 'expand'
  else action = 'expand'

  console.log(action, jointName)

  this.newAction({
  	jointName: jointName, 
  	type: action
  })

  textures = {
    'expand'  : 'redsquare',
    'contract': 'bluesquare',
    'relax'   : 'whitesquare'
  }

  this.shadowClone.children.filter(function (part) {
    return part.name === muscleName
  })[0].loadTexture(textures[action])

  this.isResetingPlayback = true
}

Player.prototype.resetPlayback = function () {
  if(this.isResetingPlayback === true) {
    this.isResetingPlayback = false
    return true
  }
  else return false
}

Player.prototype.ready = function(first_argument) {
  if(this.isReady === true) {
    this.isReady = false
    return true
  }
  else return false
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