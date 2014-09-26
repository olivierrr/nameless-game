module.exports = function(game) {

    var ragdoll = game.add.group()

    var shouldersDistance = 0.5,
        upperArmLength = 0.4,
        lowerArmLength = 0.4,
        upperArmSize = 0.2,
        lowerArmSize = 0.2,
        neckLength = 0.1,
        headRadius = 0.25,
        upperBodyLength = 0.6,
        pelvisLength = 0.4,
        upperLegLength = 0.5,
        upperLegSize = 0.2,
        lowerLegSize = 0.2,
        lowerLegLength = 0.5;

    var M = 100

    var bodyParts = {}

    // Lower legs
    bodyParts.lowerLeftLeg = {
        x: -shouldersDistance / 2,
        y: lowerLegLength / 2,
        w: lowerLegSize * M,
        h: lowerLegLength * M
    }
    bodyParts.lowerRightLeg = {
        x: shouldersDistance / 2,
        y: lowerLegLength / 2,
        w: lowerLegSize * M,
        h: lowerLegLength * M
    }
    // Upper legs
    bodyParts.upperLeftLeg = {
        x: -shouldersDistance / 2,
        y: bodyParts.lowerLeftLeg.y + lowerLegLength / 2 + upperLegLength / 2,
        w: upperLegSize * M,
        h: upperLegLength * M
    }
    bodyParts.upperRightLeg = {
        x: shouldersDistance / 2,
        y: bodyParts.lowerRightLeg.y + lowerLegLength / 2 + upperLegLength / 2,
        w: upperLegSize * M,
        h: upperLegLength * M
    }
    // Pelvis
    bodyParts.pelvis = {
        x: 0,
        y: bodyParts.upperLeftLeg.y + upperLegLength / 2 + pelvisLength / 2,
        w: shouldersDistance * M,
        h: pelvisLength * M
    }
    // Upper body
    bodyParts.upperBody = {
        x: 0,
        y: bodyParts.pelvis.y + pelvisLength / 2 + upperBodyLength / 2,
        w: shouldersDistance * M,
        h: upperBodyLength * M
    }
    // Head
    bodyParts.head = {
        x: 0,
        y: bodyParts.upperBody.y + upperBodyLength / 2 + headRadius + neckLength,
        w: (headRadius * 2) * M,
        h: (headRadius * 2) * M
    }
    // Upper arms
    bodyParts.upperLeftArm = {
        x: -shouldersDistance / 2 - upperArmLength / 2,
        y: bodyParts.upperBody.y + upperBodyLength / 2,
        w: upperArmLength * M,
        h: upperArmSize * M
    }
    bodyParts.upperRightArm = {
        x: shouldersDistance / 2 + upperArmLength / 2,
        y: bodyParts.upperBody.y + upperBodyLength / 2,
        w: upperArmLength * M,
        h: upperArmSize * M
    }
    // lower arms
    bodyParts.lowerLeftArm = {
        x: bodyParts.upperLeftArm.x - lowerArmLength / 2 - upperArmLength / 2,
        y: bodyParts.upperLeftArm.y,
        w: lowerArmLength * M,
        h: lowerArmSize * M
    }
    bodyParts.lowerRightArm = {
        x: bodyParts.upperRightArm.x + lowerArmLength / 2 + upperArmLength / 2,
        y: bodyParts.upperRightArm.y,
        w: lowerArmLength * M,
        h: lowerArmSize * M
    }

    var bodySprites = {}

    Object.keys(bodyParts).forEach(function(key) {
        var part = ragdoll.create(bodyParts[key].x, bodyParts[key].y, 'redsquare')
        part.width = bodyParts[key].h
        part.height = bodyParts[key].w
        game.physics.p2.enable(part)
        bodySprites[key] = part
    })

    var bodyJoints = {}

        // Neck joint
    bodyJoints.neckJoint = {
        a: 'head',
        b: 'upperBody',
        pivot_a: [0, -headRadius - neckLength / 2],
        pivot_b: [0, upperBodyLength / 2]
    }
    // Knee joints
    bodyJoints.leftKneeJoint = {
        a: 'lowerLeftLeg',
        b: 'upperLeftLeg',
        pivot_a: [0, lowerLegLength / 2],
        pivot_b: [0, -upperLegLength / 2]
    }
    bodyJoints.rightKneeJoint = {
        a: 'lowerRightLeg',
        b: 'upperRightLeg',
        pivot_a: [0, lowerLegLength / 2],
        pivot_b: [0, -upperLegLength / 2]
    }
    // Hip joints
    bodyJoints.leftHipJoint = {
        a: 'upperLeftLeg',
        b: 'pelvis',
        pivot_a: [0, upperLegLength / 2],
        pivot_b: [-shouldersDistance / 2, -pelvisLength / 2]
    }
    bodyJoints.rightHipJoint = {
        a: 'upperRightLeg',
        b: 'pelvis',
        pivot_a: [0, upperLegLength / 2],
        pivot_b: [shouldersDistance / 2, -pelvisLength / 2]
    }
    // Spine
    bodyJoints.spineJoint = {
        a: 'pelvis',
        b: 'upperBody',
        pivot_a: [0, pelvisLength / 2],
        pivot_b: [0, -upperBodyLength / 2]
    }
    // Shoulders
    bodyJoints.leftShoulder = {
        a: 'upperBody',
        b: 'upperLeftArm',
        pivot_a: [-shouldersDistance / 2, upperBodyLength / 2],
        pivot_b: [upperArmLength / 2, 0]
    }
    bodyJoints.rightShoulder = {
        a: 'upperBody',
        b: 'upperRightArm',
        pivot_a: [shouldersDistance / 2, upperBodyLength / 2],
        pivot_b: [-upperArmLength / 2, 0]
    }
    // Elbow joint
    bodyJoints.leftElbowJoint = {
        a: 'lowerLeftArm',
        b: 'upperLeftArm',
        pivot_a: [lowerArmLength / 2, 0],
        pivot_b: [-upperArmLength / 2, 0]
    }
    bodyJoints.rightElbowJoint = {
        a: 'lowerRightArm',
        b: 'upperRightArm',
        pivot_a: [-lowerArmLength / 2, 0],
        pivot_b: [upperArmLength / 2, 0]
    }

    Object.keys(bodyJoints).forEach(function(key) {
        var joint = bodyJoints[key]
        game.physics.p2.createRevoluteConstraint(bodySprites[joint.a], joint.pivot_a, bodySprites[joint.b], joint.pivot_b, 500)
    })

    return ragdoll

}