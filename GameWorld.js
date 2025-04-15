const delta = 1/80;
const HOLE_RADIUS = 60;
let turn = 1;

const POSITION_Y_1 = 220;
const POSITION_Y_2 = 1040;

function GameWorld() {
    this.playerOneBalls = [];  //Player 1 (red)
    this.playerTwoBalls = [];  //Player 2 (black)

    this.balls = [
        [new Vector2(510,104), COLOR.black, "black"],
        [new Vector2(550,104), COLOR.black, "black"],
        [new Vector2(590,104), COLOR.black, "black"],
        [new Vector2(630,104), COLOR.black, "black"],
        [new Vector2(660,104), COLOR.black, "black"],
        [new Vector2(700,104), COLOR.black, "black"],
        [new Vector2(740,104), COLOR.black, "black"],
        [new Vector2(780,104), COLOR.black, "black"],

        [new Vector2(510,1180), COLOR.red, "red"],
        [new Vector2(550,1180), COLOR.red, "red"],
        [new Vector2(590,1180), COLOR.red, "red"],
        [new Vector2(630,1180), COLOR.red, "red"],
        [new Vector2(670,1180), COLOR.red, "red"],
        [new Vector2(710,1180), COLOR.red, "red"],
        [new Vector2(750,1180), COLOR.red, "red"],
        [new Vector2(790,1180), COLOR.red, "red"],

        [new Vector2(635,1040), COLOR.big_red, "big"], // Mainball
    ].map(params => {
        let ball = new Ball(params[0], params[1]);
        ball.type = params[2];
        return ball;
    });

    this.main_ball = this.balls[this.balls.length - 1];

    this.playerOneBalls = this.balls.filter(ball => ball.type === "red");
    this.playerTwoBalls = this.balls.filter(ball => ball.type === "black");

    this.stick = new Stick(new Vector2(635, 220), this.main_ball.shoot.bind(this.main_ball));

    this.table = {
        TopY: 82,
        RightX: 1194,
        BottomY: 1194, 
        LeftX: 80
    };
    let centerTop = new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.TopY+SMALL_BALL_RADIUS);
    let centerBott = new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.BottomY-SMALL_BALL_RADIUS);

    this.holes = [
        new Vector2(150, 148), // Top left
        new Vector2(1120, 148), // Top right
        new Vector2(148, 1118), // Bottom left
        new Vector2(1120, 1118) // Bottom right
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

GameWorld.prototype.placeNewSmallBallNearCenter = function() {
    const radius = SMALL_BALL_RADIUS;
    const spacing = 0; // Minimum distance from other balls
    const step = 1;   // Scanning resolution
    const bounds = this.table;

    let centerTop = new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.TopY+SMALL_BALL_RADIUS);
    let centerBott = new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.BottomY-SMALL_BALL_RADIUS);

    // Generate candidate positions in a spiral-like pattern around center
    let maxDistance = Math.max(bounds.RightX - bounds.LeftX, bounds.BottomY - bounds.TopY);
    if(turn % 2 === 1)
        {
            for (let i = 0; i < centerBott.x; i++) {
                let offsets = [i * step, -i * step];
                for (let offset of offsets) {
                    let candidate = new Vector2(centerTop.x + offset, centerTop.y);
        
                    // Check if candidate is within table bounds
                    if (
                        candidate.x < bounds.LeftX + radius || candidate.x > bounds.RightX - radius ||
                        candidate.y < bounds.TopY + radius || candidate.y > bounds.BottomY - radius
                    ) continue;
        
                    // Check for collision with existing balls
                    let collision = false;
                    for (let ball of this.balls) {
                        if (ball.position.subtract(candidate).lenght() < (2 * radius + spacing)) {
                            collision = true;
                            break;
                        }
                    }
        
                    if (!collision) {
                        let newBall = new Ball(candidate, COLOR.black); // Or whatever color
                        newBall.type = "red";
                        this.balls.push(newBall);
                        console.log("Placed small ball at:", candidate);
                        return;
                    }
                }
            }
        }
        else
        {
            for (let i = 0; i < centerTop.x; i++) {
                let offsets = [i * step, -i * step];
                for (let offset of offsets) {
                    let candidate = new Vector2(centerBott.x + offset, centerBott.y);
        
                    // Check if candidate is within table bounds
                    if (
                        candidate.x < bounds.LeftX + radius || candidate.x > bounds.RightX - radius ||
                        candidate.y < bounds.TopY + radius || candidate.y > bounds.BottomY - radius
                    ) continue;
        
                    // Check for collision with existing balls
                    let collision = false;
                    for (let ball of this.balls) {
                        if (ball.position.subtract(candidate).lenght() < (2 * radius)) {
                            collision = true;
                            break;
                        }
                    }
        
                    if (!collision) {
                        let newBall = new Ball(candidate, COLOR.red); // Or whatever color
                        newBall.type = "red";
                        this.balls.push(newBall);
                        console.log("Placed small ball at:", candidate);
                        return;
                    }
                }
            }
        }

    console.warn("No valid position found near the center to place a small ball.");
};



GameWorld.prototype.handleCollisions = function() {
    const bigBall = this.main_ball;
    let extraTurn = false;

    for (let i = this.balls.length - 1; i >= 0; i--) {
        let ball = this.balls[i];

        if (ball.isInHole(this.holes)) {
            console.log(`Ball ${i} went into a hole!`);

            if (ball === bigBall) {
                ball.position = new Vector2(635, (turn % 2 === 1) ? 1040 : 220);
                ball.velocity = new Vector2(0, 0);
                this.placeNewSmallBallNearCenter();
            } else {
                let isPlayerOneTurn = turn % 2 === 1;
                let isOpponentBall = (isPlayerOneTurn && ball.type === "black") || (!isPlayerOneTurn && ball.type === "red");

                if (isOpponentBall) {
                    extraTurn = true;
                    console.log("Extra turn awarded!");
                }

                this.balls.splice(i, 1);
            }
            continue;
        }

        if (ball === bigBall) {
            ball.resolveTableCollision(this.table, BIG_BALL_RADIUS);
        } else {
            ball.resolveTableCollision(this.table, SMALL_BALL_RADIUS);
        }

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

    this.extraTurn = extraTurn;
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
        if (this.extraTurn) {
            console.log("Player gets an extra turn!");
            this.extraTurn = false;
        } else {
            turn++;
        }

        let newBallPosition = turn % 2 === 1 ? new Vector2(635, 1040) : new Vector2(635, 220);

        this.main_ball.position = newBallPosition;
        this.main_ball.velocity = new Vector2(0, 0);
        this.main_ball.sprite = turn % 2 === 1 ? sprites.main_ball_red : sprites.main_ball;

        this.stick.reposition(this.main_ball.position);
        this.positioningBall = true;
        this.stick.shot = false;
    }
};





GameWorld.prototype.draw = function(){

    Canvas.drawImage(sprites.background, {x:0, y:0});
    
    this.stick.draw();
    for(let i = 0; i < this.balls.length; i++){
        this.balls[i].draw(delta);
    }
        

}

GameWorld.prototype.ballsMoving = function() {
    let ballsMoving = false;

    for (let i = 0; i < this.balls.length; i++) {
        //console.log(`Ball ${i} velocity: x: ${this.balls[i].velocity.x}, y: ${this.balls[i].velocity.y}`);

        if (Math.abs(this.balls[i].velocity.x) > 0.1 || Math.abs(this.balls[i].velocity.y) > 0.1) {
            ballsMoving = true;
            break;
        }
    }

    return ballsMoving;
};

