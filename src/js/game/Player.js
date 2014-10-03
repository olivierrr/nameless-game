var Ragdoll = require('./Ragdoll.js')

/*
 * Player class
 *
 * @extends Ragdoll
 * @constructor Player
 */
var Player = function (game, x, y) {

  /**
   * available controllers: 
   *  'me'      - controlled by users input
   *  'dummy'   - no conroller
   *  'network' - controller over network
   *
   * @property {String} controller
   * @default 'dummy'
   */
  this.controller = 'dummy'

	/**
	 * @reference {Phaser.game} game
	 */
	this.game = game

	/**
 	 * @Object {Phaser.group} ragdoll
	 */
	this.ragdoll = Ragdoll(game, x, y)

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
   * @property {Array} currentPosition
   */
  this.initialPosition = []

  /**
   * @property {Number} health
   */
  this.health = 100

  /**
   * request an animation playback
   *
   * @property {Boolean} isResetingPlayback
   */
  this.isResetingPlayback = false

  this.savePosition()
  this.initialPosition = this.currentPosition 
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
      angularVelocity: data.angularVelocity,
      wlambda: data.wlambda,
      vlambdax : data.vlambda[0],
      vlambday : data.vlambda[1]
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
    data.velocity[1] = pos[i].vy,
    data.wlambda = pos[i].wlambda,
    data.vlambda[0] = pos[i].vlambdax,
    data.vlambda[1] = pos[i].vlambday
  })
}

/**
 * create shallow copy of ragdolls position
 *
 * @method clone
 * @return {Phaser.Group}
*/
Player.prototype.clone = function () {
  var ragdollClone = this.game.add.group()

  this.ragdoll.children.forEach(function(part) {
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

/*
 * @method setLastTurn
 */
Player.prototype.setLastTurn = function (turn) {
  this.turnHistory[this.turnHistory.length-1] = turn
}

/**
 * @method getLastTurn
 */
Player.prototype.getLastTurn = function () {
  return this.turnHistory[this.turnHistory.length-1]
}

/**
 * singleton clone
 *
 * todo - could be forcing position on previously made clone instead of destroying and creating new instance 
 *
 * @method shadow
 */
Player.prototype.shadow = function () {

  this.destroyShadow()

  this.shadowClone = this.clone()
  
  // TODO
  attachEvents(this.shadowClone, this)
}

/**
 * @method destroyShadow
 */
Player.prototype.destroyShadow = function() {
  if(this.shadowClone) this.shadowClone.destroy()
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
 * @method cinematicExecuteMoves
 */
Player.prototype.cinematicExecuteMoves = function () {
  this.destroyShadow()
  this.executeMoves(this.getLastTurn(), 1)
}

/**
 * works like nodes EventEmitter.once for @property isResetingPlayback
 *
 * @method resetPlayback
 */
Player.prototype.resetPlayback = function () {
  if(this.isResetingPlayback === true) {
    this.isResetingPlayback = false
    return true
  }
  else return false
}

/**
 * shim p2.onBeginContact to work on Phaser.group @ragdoll
 *
 * @method onCollision
 */
Player.prototype.onCollision = function (cb) {
  this.ragdoll.children.forEach(function (part) {
    part.body.onBeginContact.add(function (a, b, c, d) {
      cb(a, b, c, d)
    })
  })
}

/**
 * reset back to initial instance position
 *
 * @method reset
 */
Player.prototype.reset = function() {
  this.turnHistory = []
  this.currentPosition = this.initialPosition
  this.loadPosition()
  this.destroyShadow()
}

/**
 * @method destroy
 */
Player.prototype.destroy = function() {
  if(this.shadowClone) this.shadowClone.destroy()
  this.ragdoll.destroy()
  this.turnHistory = null
  this.currentPosition = null
  this.initialPosition = null
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

  if(this.isAllowingInput === false) return

  //if(muscleName === 'upperBody') return
  //if(muscleName === 'pelvis') return

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
  var jointState = this.getLastTurn()[jointName]
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

Player.prototype.setController = function(controller) {
  this.controller = controller

  if(controller === 'dummy') {
    this.isAllowingInput = false
  }
  if(controller === 'network') {
    this.isAllowingInput = false
  }
  if(controller === 'me') {

  }
}

// -todo
Player.prototype.method1 = function () {
  this.ragdoll.alpha = 0.5
	this.ragdoll.relaxAll()
  this.newTurn()
  this.savePosition()
  this.shadow()
}
// -todo
Player.prototype.method2 = function () {
  
	this.loadPosition()
  this.ragdoll.relaxAll()
  
  this.executeMoves(this.getLastTurn(), 0.5)
}

module.exports = Player