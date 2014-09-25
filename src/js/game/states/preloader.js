module.exports = function(game) {

  var preloader = {}

  preloader.preload = function () {
    game.load.image('logo', 'images/phaser.png#grunt-cache-bust')
    game.load.image('backbutton', 'images/backbutton.png#grunt-cache-bust')
  }

  preloader.create = function () {
    game.state.start('mainmenu')
  }

  return preloader
}