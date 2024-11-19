const delta = 1/100;

function GameWorld(){

    this.main_ball = new Ball(new Vector2(413, 413), COLOR.big_black);
    this.stick = new Stick(new Vector2(413, 413), this.main_ball.shoot.bind(this.main_ball));
}

GameWorld.prototype.update = function(){

    this.main_ball.update(delta);
    this.stick.update();

    if(!this.ballsMoving() && this.stick.shot){
        this.stick.reposition(this.main_ball.position)
    }
}

GameWorld.prototype.draw = function(){

    Canvas.drawImage(sprites.background, {x:0, y:0});
    
    this.stick.draw();
    this.main_ball.draw();

}

GameWorld.prototype.ballsMoving = function(){
    return this.main_ball.moving;
}