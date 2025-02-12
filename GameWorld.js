const delta = 1/80;

function GameWorld(){

    this.balls = [
        [new Vector2(510,104),COLOR.black],
        [new Vector2(550,104),COLOR.black],
        [new Vector2(590,104),COLOR.black],
        [new Vector2(630,104),COLOR.black],
        [new Vector2(660,104),COLOR.black],
        [new Vector2(700,104),COLOR.black],
        [new Vector2(740,104),COLOR.black],
        [new Vector2(780,104),COLOR.black],

        [new Vector2(510,1180),COLOR.red],
        [new Vector2(550,1180),COLOR.red],
        [new Vector2(590,1180),COLOR.red],
        [new Vector2(630,1180),COLOR.red],
        [new Vector2(670,1180),COLOR.red],
        [new Vector2(710,1180),COLOR.red],
        [new Vector2(750,1180),COLOR.red],
        [new Vector2(790,500),COLOR.red],

        [new Vector2(635,1040),COLOR.big_black],

    ].map(params => new Ball (params[0], params[1]))

    this.main_ball = this.balls[this.balls.length - 1];

    this.stick = new Stick(new Vector2(635, 1040), this.main_ball.shoot.bind(this.main_ball));

    this.table = {
        TopY: 82,
        RightX: 1182,
        BottomY: 1188, 
        LeftX: 80
    }
}

GameWorld.prototype.handleCollisions = function() {
    const bigBall = this.balls[this.balls.length - 1]; // pasaka kura ir lielā bumba listā

    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].collideWith(this.table);

        for (let j = i + 1; j < this.balls.length; j++) {
            const firstBall = this.balls[i];
            const secondBall = this.balls[j];

            // ja lielā bumba satriecas, izmantot bigball funkciju
            if (secondBall === bigBall) {
                firstBall.collideWithBig(secondBall);
            } else {
                firstBall.collideWith(secondBall);
            }
        }
    }
};

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
