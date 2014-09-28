module.exports = function(game) {

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
    limits: [-Math.PI/6, Math.PI/3]
  }
  bodyJoints.rightHipJoint = {
    a: 'upperRightLeg',
    b: 'pelvis',
    pivot_a: [0, sizes.upperLegLength / 2],
    pivot_b: [sizes.shouldersDistance / 2, -sizes.pelvisLength / 2],
    limits: [-Math.PI/3, Math.PI/6]
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

  var ragdoll = game.add.group()

  /**
   * create muscles
   */
  Object.keys(bodyParts).forEach(function(key) {

    var x = bodyParts[key].x
    var y = bodyParts[key].y
    var w = bodyParts[key].w
    var h = bodyParts[key].h

    var part = ragdoll.create(x, y, 'redsquare')

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

    if(!ragdoll.joints) ragdoll.joints = {}
    ragdoll.joints[key] = constraint
  })

  /**
   * attach click events
   */
  ragdoll.children.forEach(function(part){
    part.inputEnabled = true
    part.events.onInputDown.add(function(e) {
      switch (e.body.sprite.name) {
        case 'head'         : ragdoll.flex('neckJoint')      ;break
        case 'upperLeftArm' : ragdoll.flex('leftShoulder')   ;break
        case 'lowerLeftArm' : ragdoll.flex('leftElbowJoint') ;break
        case 'upperRightArm': ragdoll.flex('rightShoulder')  ;break
        case 'lowerRightArm': ragdoll.flex('rightElbowJoint');break
        case 'upperLeftLeg' : ragdoll.flex('leftHipJoint')   ;break
        case 'lowerLeftLeg' : ragdoll.flex('leftKneeJoint')  ;break
        case 'upperRightLeg': ragdoll.flex('rightHipJoint')  ;break
        case 'lowerRightLeg': ragdoll.flex('rightKneeJoint') ;break
        case 'pelvis'       : ragdoll.flex('spineJoint')     ;break
        case 'upperBody'    : ragdoll.flex('spineJoint')     ;break
      }
    })
  })

  /**
   * @property {Array} moveHistory
   */
  ragdoll.moveHistory = []

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
    if(joint.d === 1) {
      joint.setMotorSpeed(3)
      joint.d = 2
    }
    else {
      joint.setMotorSpeed(-3)
      joint.d = 1
    }
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
  ragdoll.clone = function() {
    var ragdollClone = game.add.group()
    var parts = this.children.forEach(function(part) {
      var clone = ragdollClone.create(part.position.x, part.position.y, part.key)
      clone.width = part.width
      clone.height = part.height
      clone.rotation = part.rotation
      clone.anchor.x = part.anchor.x
      clone.anchor.y = part.anchor.y
    })
    return ragdollClone
  }

  /**
   * move the ragdoll
   *
   * @method executeMove
   * @param {Object} move
   */
  ragdoll.executeMove = function (move) {
    var _this = this
    _this.moveHistory.push(move)

    switch (move.type) {
      case 'expand'  : _this.flex(move.jointName) ;break 
      case 'contract': _this.flex(move.jointName) ;break 
      case 'relax'   : _this.relax(move.jointName) ;break 
      case 'tense'   : _this.tense(move.jointName) ;break 
    }
  }

  return ragdoll
}