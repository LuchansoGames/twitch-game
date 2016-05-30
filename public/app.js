var game = new Phaser.Game(800, 600, Phaser.AUTO);

var test = {
  players: [],
  pnames: [],

  preload: function() {
    this.game.stage.backgroundColor = 0x000000;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.game.load.image('cude', 'square.png');
    this.game.load.spritesheet('kaboom', 'explosion.png', 128, 128);
    this.game.load.json('userData', 'getUserData');

    this.game.load.onLoadComplete.add(this.updateUsers, this);
  },

  create: function() {
    this.explosions = game.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    this.explosions.forEach(this.setupInvader, this);

    this.timer = this.game.time.create(false);
    this.timer.loop(30 * 1000, this.updateUsers, this);
    this.timer.start();
  },

  boom: function(x, y) {
    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(x, y);
    explosion.play('kaboom', 30, false, true);
  },

  setupInvader: function(invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
  },

  update: function() {
    this.game.physics.arcade.collide(this.players, this.players, function(obj1, obj2) {
      var pt = Phaser.Point.centroid([new Phaser.Point(obj1.x, obj2.y), new Phaser.Point(obj1.x, obj2.y)]);
      this.boom(pt.x, pt.y);
    }, null, this);
  },

  updateUsers: function() {
    this.game.load.json('userData', 'getUserData', true);

    var summary = this.game.cache.getJSON('userData').chatters.viewers;
    summary = summary.concat(this.game.cache.getJSON('userData').chatters.moderators);

    this.pnames = this.pnames.filter(function(pname) {
      if (summary.indexOf(pname) === -1) {
        return;
      } else {
        return pname;
      }
    }, this);

    summary = summary.filter(function(pname) {
      if (this.pnames.indexOf(pname) === -1) {
        return pname;
      } else {
        return;
      }
    }, this);

    this.pnames = this.pnames.concat(summary);

    var newPlayers = summary.map(function(pname) {
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

      var text = this.game.add.text(sprite.width / 2, sprite.height + 5, pname, style);
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

      result.pname = pname;

      return result;
    }, this);

    this.players = newPlayers.concat(this.players);

    this.players.filter(function(pl) {
      if (this.pnames.indexOf(pl.pname) === -1) {
        pl.destroy();
        return;
      } else {
        return pl;
      }
    }, this);
  }
}

game.state.add('game', test);
game.state.start('game');