var game = new Phaser.Game(1900, 1060, Phaser.AUTO);

var test = {
  players: [],

  preload: function() {
    this.game.stage.backgroundColor = 0x000000 /*0x65A2EE*/ ;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.game.load.image('cude', 'square.png');
    this.game.load.json('userData', 'getUserData');

    this.game.load.onLoadComplete.add(this.updateUsers, this);
  },

  create: function() {
    this.timer = this.game.time.create(false);
    this.timer.loop(60 * 1000, this.updateUsers, this);
    this.timer.start();

    this.checkUsers();
  },

  update: function() {
    this.game.physics.arcade.collide(this.players, this.players);
  },

  checkUsers: function() {

  },

  updateUsers: function() {
    this.game.load.json('userData', 'getUserData', true);

    this.players.forEach(function(pl) {
      pl.destroy();
    });

    this.players = this.game.cache.getJSON('userData').chatters.viewers.map(function(p) {
      var sprite = this.game.add.sprite(0, 0, 'cude');
      sprite.width = 25;
      sprite.height = 25;
      sprite.tint = this.game.rnd.pick([0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF8A00, 0x00FFF6, 0x6000FF, 0xFF00D8]);

      var x = this.game.rnd.between(5, this.game.world.width - sprite.width - 5);
      var y = this.game.rnd.between(5, this.game.world.height - sprite.height - 5);

      var result = game.add.sprite(x, y);

      style = {
        font: "18px Arial",
        fill: "#fff"
      }

      var text = this.game.add.text(sprite.width / 2, sprite.height + 5, p, style);
      text.anchor.set(0.5, 0);      

      result.addChild(sprite);
      result.addChild(text);
      result.alpha = 0.85;

      this.game.physics.arcade.enable([result]);

      result.body.velocity.x = this.game.rnd.between(-200, 200);
      result.body.velocity.y = this.game.rnd.between(-200, 200);

      result.body.collideWorldBounds = true;

      result.body.bounce.x = 1;
      result.body.bounce.y = 1;

      result.body.width = sprite.width;
      result.body.height = sprite.height;

      return result;
    }, this);
  }
}

game.state.add('game', test);
game.state.start('game');