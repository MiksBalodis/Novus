const delta = 1/80;
const HOLE_RADIUS = 60;
let turn = 1;

const POSITION_Y_1 = 220;
const POSITION_Y_2 = 1040;

function GameWorld(){

    //ievietojam bumbas
    //vidus koordinātas ir (643,639)
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
        [new Vector2(790,1180),COLOR.red],

        [new Vector2(635,1040),COLOR.big_red],

    ].map(params => new Ball (params[0], params[1]))

    this.main_ball = this.balls[this.balls.length - 1];

    this.stick = new Stick(new Vector2(635, 220), this.main_ball.shoot.bind(this.main_ball));

    this.table = {
        TopY: 82,
        RightX: 1194,
        BottomY: 1194, 
        LeftX: 80
    }


    //caurumu pozīcijas
    this.holes = [
        new Vector2(150, 148), //top left
        new Vector2(1120, 148), //top right
        new Vector2(148, 1118), //bottom left
        new Vector2(1120, 1118) //bottom right
    ];
    
    this.positioningBall = true;
}

Ball.prototype.isInHole = function(holes) {
    for (let i = 0; i < holes.length; i++) {
        const hole = holes[i];
        const distance = this.position.subtract(hole).lenght(); //attālums līdz caurumam

        if (distance <= HOLE_RADIUS) {
            return true;
        }
    }
    return false;
};



GameWorld.prototype.handleCollisions = function() {
    const bigBall = this.balls[this.balls.length - 1]; //nosaka lielo bumbu no saraksta (pēdējā)

    for (let i = this.balls.length - 1; i >= 0; i--) {
        let ball = this.balls[i];

        //vai bumba iekrīt caurumā
        if (ball.isInHole(this.holes)) {
            if (ball === bigBall) {
                //ja lielā bumba iekrīt caurumā
                ball.position = new Vector2(635,1040); //ressetot "sitiena pozīcijā"
                ball.velocity = new Vector2(0, 0); //apstādināt
            } else {
                this.balls.splice(i, 1);
            }
            continue;
        }

        //bumbas pret sienām collisioni
        if (ball === bigBall) {
            ball.resolveTableCollision(this.table, BIG_BALL_RADIUS);
        } else {
            ball.resolveTableCollision(this.table, SMALL_BALL_RADIUS);
        }
        
        

        //bumbu pret bumbu collisioni
        for (let j = i + 1; j < this.balls.length; j++) {
            let firstBall = this.balls[i];
            let secondBall = this.balls[j];

            if (secondBall === bigBall) {
                firstBall.collideWithBig(secondBall);
            } else {
                firstBall.collideWith(secondBall);
            }
        }
    }
};

GameWorld.prototype.handleBallPositioning = function() {
    const horizontalLineY = (turn % 2 === 1) ? 1040 : 220;

    this.main_ball.position.x = Math.max(this.table.LeftX + 150, Math.min(Mouse.position.x, this.table.RightX - 155));
    
    this.main_ball.position.y = horizontalLineY;

    const oppositeSideY = (turn % 2 === 1) ? 220 : 1040;

    const angle = Math.atan2(oppositeSideY - this.main_ball.position.y, this.main_ball.position.x - Mouse.position.x);

    this.stick.position = this.main_ball.position.copy();
    this.stick.rotation = angle;

    if (Mouse.left.pressed) {
        this.positioningBall = false;
        this.stick.position = this.main_ball.position.copy();
    }
};






GameWorld.prototype.update = function() {
    if (this.positioningBall) {
        this.handleBallPositioning();
    }

    this.handleCollisions();

    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].update(delta);
    }

    if (!this.positioningBall) {
        this.stick.update();
    }

    if (!this.ballsMoving() && this.stick.shot) {
        if (turn % 2 === 1) {
            this.main_ball.position = new Vector2(635, 1040);
            this.main_ball.sprite = sprites.main_ball;
        } else {
            this.main_ball.position = new Vector2(635, 220);
            this.main_ball.sprite = sprites.main_ball_red;
        }

        turn++;

        this.stick.reposition(this.main_ball.position);

        this.positioningBall = true;
    }
};





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
