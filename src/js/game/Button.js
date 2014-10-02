
/*
 * Button class
 *
 * @constructor Button
 */
var Button = function (game, settings, cb) {

	var x = settings.x 					|| 100
	var y = settings.y 					|| 100
	var text = settings.text 		|| 'button'
	var font = settings.font 		|| '40px Arial'
	var fill = settings.fill 		|| '#ffffff'
	var align = settings.align	|| 'center'

	if(settings.sprite) {
		console.log('todo')
		//	todo - sprite background
	}

  this.btn = game.add.text(x, y, text, { font: font, fill: fill, align: align } )

  this.btn.anchor.setTo(0.5, 0.5)
  this.btn.inputEnabled = true

  this.btn.events.onInputDown.add(function() { cb() })
}

module.exports = Button