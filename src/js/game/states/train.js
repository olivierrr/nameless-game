var Ragdoll = require('../Ragdoll.js')

module.exports = function(game) {

  var gameState = {}

  gameState.create = function () {

  	var style = { font: '40px Arial', fill: '#ffffff', align: 'center'}
  	var mainMenuButton = game.add.text(100, 50, 'back', style)
    mainMenuButton.anchor.setTo(0.5, 0.5)
    mainMenuButton.inputEnabled = true
    mainMenuButton.events.onInputDown.add(function() {
			game.state.start('singleplayermenu')
    })

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.gravity.y = 300

    var p1 = Ragdoll(game)

    p1.children.forEach(function(part){
      part.events.onInputDown.add(function(e) {
        switch (e.body.sprite.name) {
          case 'head'         : flex('neckJoint'); break
          case 'upperLeftArm' : flex('leftShoulder'); break
          case 'lowerLeftArm' : flex('leftElbowJoint'); break
          case 'upperRightArm': flex('rightShoulder'); break
          case 'lowerRightArm': flex('rightElbowJoint'); break
          case 'upperLeftLeg' : flex('leftHipJoint'); break
          case 'lowerLeftLeg' : flex('leftKneeJoint'); break
          case 'upperRightLeg': flex('rightHipJoint'); break
          case 'lowerRightLeg': flex('rightKneeJoint'); break
          case 'pelvis'       : flex('spineJoint'); break
        }
      })
    })

    function flex(jointName) {
      var joint = p1.joints[jointName]
      joint.enableMotor()
      if(joint.d === 1) {
        joint.setMotorSpeed(5)
        joint.d = 2
      }
      else {
        joint.setMotorSpeed(-5)
        joint.d = 1
      }
    }

    var ui = game.add.group()

    var healthbar = ui.create(50, 80, 'redsquare')
    healthbar.width = 200
    healthbar.height = 20


    window.game = game // debug
  }

  gameState.update = function () {

  }

  return gameState
}