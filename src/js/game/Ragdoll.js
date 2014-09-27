module.exports = function(game) {

    var ragdoll = game.add.group()

    var bodySprites = {}
    var bodyJoints = {}
    var bodyParts = {}

    // normalized scales
    var sizes = {}
    sizes.shouldersDistance = 0.5
    sizes.upperArmLength = 0.4
    sizes.lowerArmLength = 0.4
    sizes.upperArmSize = 0.2
    sizes.lowerArmSize = 0.2
    sizes.neckLength = 0.1
    sizes.headRadius = 0.25
    sizes.upperBodyLength = 0.6
    sizes.pelvisLength = 0.4
    sizes.upperLegLength = 0.5
    sizes.upperLegSize = 0.2
    sizes.lowerLegSize = 0.2
    sizes.lowerLegLength = 0.5

    // scale multiplier
    var M = 100

    // apply scale multiplier
    Object.keys(sizes).forEach(function(key) {
        sizes[key] *= M
    })

    // Lower legs
    bodyParts.lowerLeftLeg = {
        x: -sizes.shouldersDistance / 2,
        y: sizes.lowerLegLength / 2,
        w: sizes.lowerLegSize,
        h: sizes.lowerLegLength
    }
    bodyParts.lowerRightLeg = {
        x: sizes.shouldersDistance / 2,
        y: sizes.lowerLegLength / 2,
        w: sizes.lowerLegSize,
        h: sizes.lowerLegLength
    }
    // Upper legs
    bodyParts.upperLeftLeg = {
        x: -sizes.shouldersDistance / 2,
        y: bodyParts.lowerLeftLeg.y + sizes.lowerLegLength / 2 + sizes.upperLegLength / 2,
        w: sizes.upperLegSize,
        h: sizes.upperLegLength
    }
    bodyParts.upperRightLeg = {
        x: sizes.shouldersDistance / 2,
        y: bodyParts.lowerRightLeg.y + sizes.lowerLegLength / 2 + sizes.upperLegLength / 2,
        w: sizes.upperLegSize,
        h: sizes.upperLegLength
    }
    // Pelvis
    bodyParts.pelvis = {
        x: 0,
        y: bodyParts.upperLeftLeg.y + sizes.upperLegLength / 2 + sizes.pelvisLength / 2,
        w: sizes.shouldersDistance,
        h: sizes.pelvisLength
    }
    // Upper body
    bodyParts.upperBody = {
        x: 0,
        y: bodyParts.pelvis.y + sizes.pelvisLength / 2 + sizes.upperBodyLength / 2,
        w: sizes.shouldersDistance,
        h: sizes.upperBodyLength
    }
    // Head
    bodyParts.head = {
        x: 0,
        y: bodyParts.upperBody.y + sizes.upperBodyLength / 2 + sizes.headRadius + sizes.neckLength,
        w: sizes.headRadius * 2,
        h: sizes.headRadius * 2
    }
    // Upper arms
    bodyParts.upperLeftArm = {
        x: -sizes.shouldersDistance / 2 - sizes.upperArmLength / 2,
        y: bodyParts.upperBody.y + sizes.upperBodyLength / 2,
        w: sizes.upperArmLength,
        h: sizes.upperArmSize
    }
    bodyParts.upperRightArm = {
        x: sizes.shouldersDistance / 2 + sizes.upperArmLength / 2,
        y: bodyParts.upperBody.y + sizes.upperBodyLength / 2,
        w: sizes.upperArmLength,
        h: sizes.upperArmSize
    }
    // lower arms
    bodyParts.lowerLeftArm = {
        x: bodyParts.upperLeftArm.x - sizes.lowerArmLength / 2 - sizes.upperArmLength / 2,
        y: bodyParts.upperLeftArm.y,
        w: sizes.lowerArmLength,
        h: sizes.lowerArmSize
    }
    bodyParts.lowerRightArm = {
        x: bodyParts.upperRightArm.x + sizes.lowerArmLength / 2 + sizes.upperArmLength / 2,
        y: bodyParts.upperRightArm.y,
        w: sizes.lowerArmLength,
        h: sizes.lowerArmSize
    }
    // Neck joint
    bodyJoints.neckJoint = {
        a: 'head',
        b: 'upperBody',
        pivot_a: [0, -sizes.headRadius - sizes.neckLength / 2],
        pivot_b: [0, sizes.upperBodyLength / 2]
    }
    // Knee joints
    bodyJoints.leftKneeJoint = {
        a: 'lowerLeftLeg',
        b: 'upperLeftLeg',
        pivot_a: [0, sizes.lowerLegLength / 2],
        pivot_b: [0, -sizes.upperLegLength / 2]
    }
    bodyJoints.rightKneeJoint = {
        a: 'lowerRightLeg',
        b: 'upperRightLeg',
        pivot_a: [0, sizes.lowerLegLength / 2],
        pivot_b: [0, -sizes.upperLegLength / 2]
    }
    // Hip joints
    bodyJoints.leftHipJoint = {
        a: 'upperLeftLeg',
        b: 'pelvis',
        pivot_a: [0, sizes.upperLegLength / 2],
        pivot_b: [-sizes.shouldersDistance / 2, -sizes.pelvisLength / 2]
    }
    bodyJoints.rightHipJoint = {
        a: 'upperRightLeg',
        b: 'pelvis',
        pivot_a: [0, sizes.upperLegLength / 2],
        pivot_b: [sizes.shouldersDistance / 2, -sizes.pelvisLength / 2]
    }
    // Spine
    bodyJoints.spineJoint = {
        a: 'pelvis',
        b: 'upperBody',
        pivot_a: [0, sizes.pelvisLength / 2],
        pivot_b: [0, -sizes.upperBodyLength / 2]
    }
    // Shoulders
    bodyJoints.leftShoulder = {
        a: 'upperBody',
        b: 'upperLeftArm',
        pivot_a: [-sizes.shouldersDistance / 2, sizes.upperBodyLength / 2],
        pivot_b: [sizes.upperArmLength / 2, 0]
    }
    bodyJoints.rightShoulder = {
        a: 'upperBody',
        b: 'upperRightArm',
        pivot_a: [sizes.shouldersDistance / 2, sizes.upperBodyLength / 2],
        pivot_b: [-sizes.upperArmLength / 2, 0]
    }
    // Elbow joint
    bodyJoints.leftElbowJoint = {
        a: 'lowerLeftArm',
        b: 'upperLeftArm',
        pivot_a: [sizes.lowerArmLength / 2, 0],
        pivot_b: [-sizes.upperArmLength / 2, 0]
    }
    bodyJoints.rightElbowJoint = {
        a: 'lowerRightArm',
        b: 'upperRightArm',
        pivot_a: [-sizes.lowerArmLength / 2, 0],
        pivot_b: [sizes.upperArmLength / 2, 0]
    }

    Object.keys(bodyParts).forEach(function(key) {

        var x = bodyParts[key].x
        var y = bodyParts[key].y
        var w = bodyParts[key].w
        var h = bodyParts[key].h

        var part = ragdoll.create(x, y, 'redsquare')
        part.width = w
        part.height = h

        part.inputEnabled = true
        part.name = key

        game.physics.p2.enable(part)
        bodySprites[key] = part
    })


    Object.keys(bodyJoints).forEach(function(key) {

        var joint = bodyJoints[key]
        joint = game.physics.p2.createRevoluteConstraint
            (
                bodySprites[joint.a], 
                joint.pivot_a, 
                bodySprites[joint.b], 
                joint.pivot_b, 
                800
            )

        joint.setLimits(-Math.PI/5, Math.PI/5)

        if(!ragdoll.joints) ragdoll.joints = {}

        ragdoll.joints[key] = joint
    })

    ragdoll.health = 100

    return ragdoll

}