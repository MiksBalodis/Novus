const delta = 1/80;

function GameWorld(){

    this.balls = [
        [new Vector2(253,50),COLOR.black],
        [new Vector2(273,50),COLOR.black],
        [new Vector2(293,50),COLOR.black],
        [new Vector2(313,50),COLOR.black],
        [new Vector2(333,50),COLOR.black],
        [new Vector2(353,50),COLOR.black],
        [new Vector2(373,50),COLOR.black],
        [new Vector2(393,50),COLOR.black],

        [new Vector2(253,592),COLOR.red],
        [new Vector2(273,592),COLOR.red],
        [new Vector2(243,592),COLOR.red],//293
        [new Vector2(313,592),COLOR.red],
        [new Vector2(423,592),COLOR.red], //333
        [new Vector2(353,592),COLOR.red],
        [new Vector2(373,592),COLOR.red],
        [new Vector2(393,592),COLOR.red],

        [new Vector2(318,519),COLOR.big_black],

    ].map(params => new Ball (params[0], params[1]))

    this.main_ball = this.balls[this.balls.length - 1];

    this.stick = new Stick(new Vector2(318, 519), this.main_ball.shoot.bind(this.main_ball));

    this.table = {
        TopY: 29,
        RightX: 590,
        BottomY: 613, 
        LeftX: 40
    }
}

GameWorld.prototype.handleCollisions = function(){
    for(let i = 0; i < this.balls.length; i++){
        this.balls[i].collideWith(this.table);
        for(let j = i + 1; j < this.balls.length; j++){
            this.balls[j].collideWith(this.table);
            if(j!=this.balls.length-1)
                {
               const firstBall = this.balls[i];
               const secondBall = this.balls[j];
                firstBall.collideWith(secondBall);
                }
            else
            {
                const firstBall = this.balls[i];
               const secondBall = this.balls[j];
                firstBall.collideWithBig(secondBall);
            }    
            
        }
    }
}

GameWorld.prototype.update = function(){

    this.handleCollisions();

    for(let i = 0; i < this.balls.length; i++){
        this.balls[i].update(delta);
    }
        
    this.stick.update();

    if(!this.ballsMoving() && this.stick.shot){
        this.stick.reposition(this.main_ball.position)
    }
}

GameWorld.prototype.draw = function(){

    Canvas.drawImage(sprites.background, {x:0, y:0});
    
    this.stick.draw();
    for(let i = 0; i < this.balls.length; i++){
        this.balls[i].draw(delta);
    }
        

}

GameWorld.prototype.ballsMoving = function(){
    let ballsMoving = false;

    for(let i = 0; i < this.balls.length; i++){
        if(this.balls[i].moving){
            ballsMoving = true;
            break;
        }
    }
    return ballsMoving;
}