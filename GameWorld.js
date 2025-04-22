const delta = 1/80;
const HOLE_RADIUS = 60;
let turn = 1;

const POSITION_Y_1 = 220;
const POSITION_Y_2 = 1040;

function GameWorld() {
    this.playerOneBalls = [];
    this.playerTwoBalls = [];

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

        [new Vector2(635,1040), COLOR.big_red, "big"]
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

    this.holes = [
        new Vector2(150, 148),
        new Vector2(1120, 148),
        new Vector2(148, 1118),
        new Vector2(1120, 1118)
    ];

    this.positioningBall = true;
    this.extraTurnEarned = false;
}

Ball.prototype.isInHole = function(holes) {
    for (let hole of holes) {
        const distance = this.position.subtract(hole).lenght();
        if (distance <= HOLE_RADIUS) return true;
    }
    return false;
};

GameWorld.prototype.placeNewSmallBallNearCenter = function() {
    const radius = SMALL_BALL_RADIUS;
    const step = 1;
    const bounds = this.table;

    let center = (turn % 2 === 1)
        ? new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.TopY + radius)
        : new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.BottomY - radius);

    for (let i = 0; i < center.x; i++) {
        let offsets = [i * step, -i * step];
        for (let offset of offsets) {
            let candidate = new Vector2(center.x + offset, center.y);

            if (
                candidate.x < bounds.LeftX + radius || candidate.x > bounds.RightX - radius ||
                candidate.y < bounds.TopY + radius || candidate.y > bounds.BottomY - radius
            ) continue;

            let collision = this.balls.some(ball =>
                ball.position.subtract(candidate).lenght() < (2 * radius)
            );
            if (!collision) {
                let newBall = new Ball(candidate, turn % 2 === 1 ? COLOR.red : COLOR.black);
                newBall.type = turn % 2 === 1 ? "red" : "black";
                this.balls.push(newBall);
                return;
            }
        }
    }
};

GameWorld.prototype.handleCollisions = function() {
    const bigBall = this.main_ball;

    for (let i = this.balls.length - 1; i >= 0; i--) {
        let ball = this.balls[i];

        if (ball.isInHole(this.holes)) {
            if (ball === bigBall) {
                ball.position = new Vector2(635, (turn % 2 === 1) ? 1040 : 220);
                ball.velocity = new Vector2(0, 0);
                this.placeNewSmallBallNearCenter();
            } else {
                const isPlayerOne = turn % 2 === 1;
                const pocketedOwnBall = (isPlayerOne && ball.type === "red") || (!isPlayerOne && ball.type === "black");

                if (pocketedOwnBall) {
                    this.extraTurnEarned = true;
                }

                this.balls.splice(i, 1);
            }
            continue;
        }

        const radius = (ball === bigBall) ? BIG_BALL_RADIUS : SMALL_BALL_RADIUS;
        ball.resolveTableCollision(this.table, radius);

        for (let j = i + 1; j < this.balls.length; j++) {
            let first = this.balls[i];
            let second = this.balls[j];

            if (second === bigBall) {
                first.collideWithBig(second);
            } else {
                first.collideWith(second);
            }
        }
    }
};

GameWorld.prototype.handleBallPositioning = function() {
    const y = (turn % 2 === 1) ? 1040 : 220;
    this.main_ball.position.x = Math.max(this.table.LeftX + 150, Math.min(Mouse.position.x, this.table.RightX - 155));
    this.main_ball.position.y = y;

    const aimY = (turn % 2 === 1) ? 220 : 1040;
    const angle = Math.atan2(aimY - this.main_ball.position.y, this.main_ball.position.x - Mouse.position.x);

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
    this.balls.forEach(ball => ball.update(delta));

    if (!this.positioningBall) {
        this.stick.update();
    }

    if (!this.ballsMoving() && this.stick.shot) {
        if (this.extraTurnEarned) {
            this.extraTurnEarned = false;
            // Player keeps the turn
        } else {
            turn++;
        }

        let resetPos = turn % 2 === 1 ? new Vector2(635, 1040) : new Vector2(635, 220);
        this.main_ball.position = resetPos;
        this.main_ball.velocity = new Vector2(0, 0);
        this.main_ball.sprite = turn % 2 === 1 ? sprites.main_ball_red : sprites.main_ball;

        this.stick.reposition(this.main_ball.position);
        this.positioningBall = true;
        this.stick.shot = false;
    }
};

GameWorld.prototype.draw = function() {
    Canvas.drawImage(sprites.background, {x: 0, y: 0});
    this.stick.draw();
    this.balls.forEach(ball => ball.draw(delta));
};

GameWorld.prototype.ballsMoving = function() {
    return this.balls.some(ball =>
        Math.abs(ball.velocity.x) > 0.1 || Math.abs(ball.velocity.y) > 0.1
    );
};
