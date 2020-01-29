var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    if(xindex < 6 || xindex === 9) {
        ctx.drawImage(this.spriteSheet,
            xindex * this.frameWidth, 7 * this.frameHeight,  // source from sheet
            this.frameWidth, this.frameHeight,
            x, y,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale);
    } else if(xindex === 6) {
        ctx.drawImage(this.spriteSheet,
            xindex * this.frameWidth, 7 * this.frameHeight,  // source from sheet
            this.frameWidth, this.frameHeight,
            x, y - 40,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale);
    } else if(xindex === 7) {
        ctx.drawImage(this.spriteSheet,
            xindex * this.frameWidth, 7 * this.frameHeight,  // source from sheet
            this.frameWidth, this.frameHeight,
            x, y - 60,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale);
    } else {
        ctx.drawImage(this.spriteSheet,
            xindex * this.frameWidth, 7 * this.frameHeight,  // source from sheet
            this.frameWidth, this.frameHeight,
            x, y - 40,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale);
    } 

}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = -150;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Character(game, spritesheet) {
    this.animation = new Animation(spritesheet, 120, 130, 10, 0.15, 10, true, 0.7);
    this.speed = 150;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 321);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 750) this.x = -120;
    Entity.prototype.update.call(this);
}

Character.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/character.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Character(gameEngine, AM.getAsset("./img/character.png")));

    console.log("All Done!");
});