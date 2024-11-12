const delta = 1/100;

function GameWorld(){

    this.main_ball = new Ball(new Vector2(413, 413));
    this.stick = new Stick(new Vector2(413, 413), this.main_ball.shoot.bind(this.main_ball));
}

GameWorld.prototype.update = function(){

    this.main_ball.update(delta);
    this.stick.update();
}

GameWorld.prototype.draw = function(){

    Canvas.drawImage(sprites.background, {x:0, y:0});
    
    this.stick.draw();
    this.main_ball.draw();

}
