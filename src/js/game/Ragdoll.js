module.exports = function(game) {

  var FORCE = 10000
  var M = 100 // scale

  var ragdoll = game.add.group()

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

  ragdoll.children.forEach(function(part){

    part.inputEnabled = true
    part.events.onInputDown.add(function(e) {
      switch (e.body.sprite.name) {
        case 'head'         : flex('neckJoint')      ;break
        case 'upperLeftArm' : flex('leftShoulder')   ;break
        case 'lowerLeftArm' : flex('leftElbowJoint') ;break
        case 'upperRightArm': flex('rightShoulder')  ;break
        case 'lowerRightArm': flex('rightElbowJoint');break
        case 'upperLeftLeg' : flex('leftHipJoint')   ;break
        case 'lowerLeftLeg' : flex('leftKneeJoint')  ;break
        case 'upperRightLeg': flex('rightHipJoint')  ;break
        case 'lowerRightLeg': flex('rightKneeJoint') ;break
        case 'pelvis'       : flex('spineJoint')     ;break
        case 'upperBody'    : flex('spineJoint')     ;break
      }
    })
  })

  // temp 

  function flex(jointName) {
    var joint = ragdoll.joints[jointName]
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

  function relax(jointName) {
    var joint = ragdoll.joints[jointName]
    joint.disableMotor()
  }

  ragdoll.relaxAll = function() {
    var joints = this.joints
    Object.keys(joints).forEach(function(joint) {
      relax(joint)
    })
  }

  return ragdoll

}