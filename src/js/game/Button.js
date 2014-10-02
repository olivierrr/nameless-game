
/*
 * Button class
 *
 * @constructor Button
 */
var Button = function (game, settings, cb) {

  this.btn = game.add.text(settings.x, settings.y, settings.text, { font: '40px Arial', fill: '#ffffff', align: 'center' } )

  this.btn.anchor.setTo(0.5, 0.5)
  this.btn.inputEnabled = true
  this.btn.events.onInputDown.add(function() { cb() })
}

module.exports = Button