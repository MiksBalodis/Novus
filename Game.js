function Game(){

}

Game.prototype.init = function(){

    this.gameWorld = new GameWorld();
}

Game.prototype.start = function(){

    Novus.init();

    Novus.mainLoop();

}

Game.prototype.mainLoop = function(){

    Canvas.clear();
    Novus.gameWorld.update();
    Novus.gameWorld.draw();
    Mouse.reset();

    requestAnimationFrame(Novus.mainLoop);

}

let Novus = new Game();
