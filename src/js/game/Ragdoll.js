module.exports = function(game, offsetX, offsetY) {

  var FORCE = 10000
  var M = 100 // scale

  var bodySprites = {}
  var bodyJoints = {}
  var bodyParts = {}

  // normalized scales
  var sizes = {}
  sizes.shouldersDistance = 0.4
  sizes.upperArmLength = 0.5
  sizes.lowerArmLength = 0.5
  sizes.upperArmSize = 0.2
  sizes.lowerArmSize = 0.2
  sizes.neckLength = 0.1
  sizes.headRadius = 0.15
  sizes.upperBodyLength = 0.6
  sizes.pelvisLength = 0.4
  sizes.upperLegLength = 0.6
  sizes.upperLegSize = 0.2
  sizes.lowerLegSize = 0.2
  sizes.lowerLegLength = 0.5

  // apply scale multiplier
  Object.keys(sizes).forEach(function(key) {
    sizes[key] *= M
  })

  // Lower legs
  bodyParts.lowerLeftLeg = {
    x: -sizes.shouldersDistance / 2,
    y: sizes.lowerLegLength / 2,
    w: sizes.lowerLegSize,
    h: sizes.lowerLegLength,
    mass: 0.2
  }
  bodyParts.lowerRightLeg = {
    x: sizes.shouldersDistance / 2,
    y: sizes.lowerLegLength / 2,
    w: sizes.lowerLegSize,
    h: sizes.lowerLegLength,
    mass: 0.2
  }
  // Upper legs
  bodyParts.upperLeftLeg = {
    x: -sizes.shouldersDistance / 2,
    y: bodyParts.lowerLeftLeg.y + sizes.lowerLegLength / 2 + sizes.upperLegLength / 2,
    w: sizes.upperLegSize,
    h: sizes.upperLegLength,
    mass: 1
  }
  bodyParts.upperRightLeg = {
    x: sizes.shouldersDistance / 2,
    y: bodyParts.lowerRightLeg.y + sizes.lowerLegLength / 2 + sizes.upperLegLength / 2,
    w: sizes.upperLegSize,
    h: sizes.upperLegLength,
    mass: 1
  }
  // Pelvis
  bodyParts.pelvis = {
    x: 0,
    y: bodyParts.upperLeftLeg.y + sizes.upperLegLength / 2 + sizes.pelvisLength / 2,
    w: sizes.shouldersDistance,
    h: sizes.pelvisLength,
    mass: 1
  }
  // Upper body
  bodyParts.upperBody = {
    x: 0,
    y: bodyParts.pelvis.y + sizes.pelvisLength / 2 + sizes.upperBodyLength / 2,
    w: sizes.shouldersDistance,
    h: sizes.upperBodyLength,
    mass: 1
  }
  // Head
  bodyParts.head = {
    x: 0,
    y: bodyParts.upperBody.y + sizes.upperBodyLength / 2 + sizes.headRadius + sizes.neckLength,
    w: sizes.headRadius * 2,
    h: sizes.headRadius * 2,
    mass: 1
  }
  // Upper arms
  bodyParts.upperLeftArm = {
    x: -sizes.shouldersDistance / 2 - sizes.upperArmLength / 2,
    y: bodyParts.upperBody.y + sizes.upperBodyLength / 2,
    w: sizes.upperArmLength,
    h: sizes.upperArmSize,
    mass: 1
  }
  bodyParts.upperRightArm = {
    x: sizes.shouldersDistance / 2 + sizes.upperArmLength / 2,
    y: bodyParts.upperBody.y + sizes.upperBodyLength / 2,
    w: sizes.upperArmLength,
    h: sizes.upperArmSize,
    mass: 1
  }
  // lower arms
  bodyParts.lowerLeftArm = {
    x: bodyParts.upperLeftArm.x - sizes.lowerArmLength / 2 - sizes.upperArmLength / 2,
    y: bodyParts.upperLeftArm.y,
    w: sizes.lowerArmLength,
    h: sizes.lowerArmSize,
    mass: 1
  }
  bodyParts.lowerRightArm = {
    x: bodyParts.upperRightArm.x + sizes.lowerArmLength / 2 + sizes.upperArmLength / 2,
    y: bodyParts.upperRightArm.y,
    w: sizes.lowerArmLength,
    h: sizes.lowerArmSize,
    mass: 1
  }
  // Neck
  bodyJoints.neckJoint = {
    a: 'head',
    b: 'upperBody',
    pivot_a: [0, -sizes.headRadius - sizes.neckLength / 2],
    pivot_b: [0, sizes.upperBodyLength / 2],
    limits: [-Math.PI/12, Math.PI/12]
  }
  // Knees
  bodyJoints.leftKneeJoint = {
    a: 'lowerLeftLeg',
    b: 'upperLeftLeg',
    pivot_a: [0, sizes.lowerLegLength / 2],
    pivot_b: [0, -sizes.upperLegLength / 2],
    limits: [-Math.PI/5, Math.PI/5]
  }
  bodyJoints.rightKneeJoint = {
    a: 'lowerRightLeg',
    b: 'upperRightLeg',
    pivot_a: [0, sizes.lowerLegLength / 2],
    pivot_b: [0, -sizes.upperLegLength / 2],
    limits: [-Math.PI/5, Math.PI/5]
  }
  // Hips
  bodyJoints.leftHipJoint = {
    a: 'upperLeftLeg',
    b: 'pelvis',
    pivot_a: [0, sizes.upperLegLength / 2],
    pivot_b: [-sizes.shouldersDistance / 2, -sizes.pelvisLength / 2],
    limits: [-Math.PI/6, Math.PI/4]
  }
  bodyJoints.rightHipJoint = {
    a: 'upperRightLeg',
    b: 'pelvis',
    pivot_a: [0, sizes.upperLegLength / 2],
    pivot_b: [sizes.shouldersDistance / 2, -sizes.pelvisLength / 2],
    limits: [-Math.PI/4, Math.PI/6]
  }
    // Spine
  bodyJoints.spineJoint = {
    a: 'pelvis',
    b: 'upperBody',
    pivot_a: [0, sizes.pelvisLength / 2],
    pivot_b: [0, -sizes.upperBodyLength / 2],
    limits: [-Math.PI/5, Math.PI/5]
  }
    // Shoulders
  bodyJoints.leftShoulder = {
    a: 'upperBody',
    b: 'upperLeftArm',
    pivot_a: [-sizes.shouldersDistance / 2, sizes.upperBodyLength / 2],
    pivot_b: [sizes.upperArmLength / 2, 0],
    limits: [-Math.PI/2, Math.PI/2]
  }
  bodyJoints.rightShoulder = {
    a: 'upperBody',
    b: 'upperRightArm',
    pivot_a: [sizes.shouldersDistance / 2, sizes.upperBodyLength / 2],
    pivot_b: [-sizes.upperArmLength / 2, 0],
    limits: [-Math.PI/2, Math.PI/2]
  }
    // Elbows
  bodyJoints.leftElbowJoint = {
    a: 'lowerLeftArm',
    b: 'upperLeftArm',
    pivot_a: [sizes.lowerArmLength / 2, 0],
    pivot_b: [-sizes.upperArmLength / 2, 0],
    limits: [-Math.PI/4, Math.PI/4]
  }
  bodyJoints.rightElbowJoint = {
    a: 'lowerRightArm',
    b: 'upperRightArm',
    pivot_a: [-sizes.lowerArmLength / 2, 0],
    pivot_b: [sizes.upperArmLength / 2, 0],
    limits: [-Math.PI/4, Math.PI/4]
  }

  //

  var ragdoll = game.add.group(null, null, 'ragdoll')

  /**
   * create muscles
   */
  Object.keys(bodyParts).forEach(function(key) {

    var x = bodyParts[key].x + offsetX
    var y = bodyParts[key].y + offsetY
    var w = bodyParts[key].w
    var h = bodyParts[key].h

    var part = ragdoll.create(x, y, 'whitesquare')

    part.width = w
    part.height = h

    part.name = key

    game.physics.p2.enable(part)

    bodySprites[key] = part
  })

  /**
   * create joints
   */
  Object.keys(bodyJoints).forEach(function(key) {

    var joint = bodyJoints[key]
    
    var constraint = game.physics.p2.createRevoluteConstraint
      (
        bodySprites[joint.a], 
        joint.pivot_a, 
        bodySprites[joint.b], 
        joint.pivot_b, 
        FORCE
      )

    constraint.setLimits(joint.limits[0], joint.limits[1])
    constraint.c = 0 // test!

    if(!ragdoll.joints) ragdoll.joints = {}
    ragdoll.joints[key] = constraint
  })

  /**
   * attach click events
   */
  function clickEvents (sprites) {
    sprites.children.forEach(function(part){
      part.inputEnabled = true
      part.events.onInputDown.add(function(e) {
        muscleClick(e.name)
      })
    })
  }

  function muscleClick(muscleName) {

    ragdoll.shadowClone.children.filter(function (part) {
      return part.name === muscleName
    })[0].loadTexture('bluesquare')
  }

  function cycle (current) {
    return current<4 ? current++ : 0
  }

  /**
   * @property {Array} moveHistory
   */
  ragdoll.moveHistory = []

  /**
   * @property {Array} positionHistory
   */
  ragdoll.positionHistory = []

  /**
   * enable joint motor
   * 
   * @method flex
   * @param {String} jointName
   */
  ragdoll.flex = function(jointName) {
    var _this = this

    var joint = _this.joints[jointName]
    joint.enableMotor()
    joint.setMotorSpeed(3)
  }

  /**
   * disabling motor on all joints
   *
   * @method relaxAll
   */
  ragdoll.relaxAll = function() {
    var _this = this
    Object.keys(_this.joints).forEach(function(joint) {
      _this.relax(joint)
    })
  }

  /**
   * disable joint motor
   *
   * @method relax
   * @param {String} jointName
   */
  ragdoll.relax = function(jointName) {
    var joint = ragdoll.joints[jointName]
    joint.disableMotor()
  }

  /**
   * create partial clone of ragdoll with no physics
   *
   * @method clone
   * @return {PhaserGroup} a copy of ragdoll
   */
  ragdoll.clone = function () {
    var ragdollClone = game.add.group()
    var parts = this.children.forEach(function(part) {
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
   * register a new move to latest turn (moveHistory)
   *
   * @method newMove
   * @param {Object} move
   */
  ragdoll.newMove = function (move) {
    var _this = this

    _this.moveHistory[_this.moveHistory.length-1][move.jointName] = move.type
  }

  /**
   * move ragdoll
   *
   * @method executeMove
   * @param {String} jointName
   * @param {String} type
   */
  ragdoll.executeMove = function (jointName, type) {
    var _this = this

    switch (type) {
      case 'expand'  : _this.flex(jointName)  ;break 
      case 'contract': _this.flex(jointName)  ;break 
      case 'relax'   : _this.relax(jointName) ;break 
      case 'tense'   : _this.tense(jointName) ;break 
    }
  }

  /**
   * a turn is an array of moves
   *
   * @method executeMoves
   * @param {Array} turn
   */
  ragdoll.executeMoves = function (turn, alpha) {
    var _this = this

    _this.alpha = alpha || 1 

    Object.keys(turn).forEach(function (jointName) {
      _this.executeMove(jointName, turn[jointName])
    })

  }

  /**
   * pushes an empty Object to moveHistory
   * ragdoll.newMove will push moves to newly pushed Object
   *
   * @method newTurn
   */
  ragdoll.newTurn = function () {
    var _this = this

    _this.moveHistory.push({})

    Object.keys(bodySprites).forEach(function (part) {
      bodySprites[part].loadTexture('whitesquare')
    })
  }

  /**
   * singleton clone
   *
   * @method shadow
   */
  ragdoll.shadow = function () {
    var _this = this

    if(_this.shadowClone) _this.shadowClone.destroy(true)

    _this.shadowClone = _this.clone()

    clickEvents( _this.shadowClone )
  }

  /**
   * save current position and velocity
   * 
   * @method savePosition
   */
  ragdoll.savePosition = function () {
    var _this = this

    var pos = _this.children.map(function(part) {
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
    _this.positionHistory.push(pos)
  }

  /**
   * move ragdoll to last position on postision history
   * 
   * @method loadPosition
   */
  ragdoll.loadPosition = function () {
    var _this = this

    var pos = _this.positionHistory[_this.positionHistory.length-1]
    _this.children.forEach(function(part, i) {
      var data = part.body.data
      data.position[0] = pos[i].x
      data.position[1] = pos[i].y
      data.angle = pos[i].angle,
      data.angularVelocity = pos[i].angularVelocity,
      data.velocity[0] = pos[i].vx,
      data.velocity[1] = pos[i].vy
    })
  }

  return ragdoll
}