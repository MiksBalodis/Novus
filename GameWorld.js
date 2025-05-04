const delta = 1/80;
const HOLE_RADIUS = 60;
let turn = 1;

const POSITION_Y_1 = 220;
const POSITION_Y_2 = 1040;

function GameWorld() {
    this.playerOneBalls = [];
    this.playerTwoBalls = [];

    this.bigBallTouchedBorderFirst = false;
    //speletaju bumbas
    this.balls = [
        
        [new Vector2(495,90), COLOR.black, "black"],
        [new Vector2(535,90), COLOR.black, "black"],
        [new Vector2(575,90), COLOR.black, "black"],
        [new Vector2(615,90), COLOR.black, "black"],
        [new Vector2(655,90), COLOR.black, "black"],
        [new Vector2(695,90), COLOR.black, "black"],
        [new Vector2(735,90), COLOR.black, "black"],
        [new Vector2(775,90), COLOR.black, "black"],

        [new Vector2(495,1174), COLOR.red, "red"],
        [new Vector2(535,1174), COLOR.red, "red"],
        [new Vector2(575,1174), COLOR.red, "red"],
        [new Vector2(615,1174), COLOR.red, "red"],
        [new Vector2(655,1174), COLOR.red, "red"],
        [new Vector2(695,1174), COLOR.red, "red"],
        [new Vector2(735,1174), COLOR.red, "red"],
        [new Vector2(775,1174), COLOR.red, "red"],

        [new Vector2(635,1040), COLOR.big_red, "big"]
    ].map(params => {
        let ball = new Ball(params[0], params[1]);
        ball.type = params[2];
        return ball;
    });
    //nosaka kura ir galvena bumba (govs)
    this.main_ball = this.balls[this.balls.length - 1];

    this.playerOneBalls = this.balls.filter(ball => ball.type === "red");
    this.playerTwoBalls = this.balls.filter(ball => ball.type === "black");

    //izveidojat sticku
    this.stick = new Stick(new Vector2(635, 220), this.main_ball.shoot.bind(this.main_ball));

    //nosakam galda malas
    this.table = {
        TopY: 82,
        RightX: 1194,
        BottomY: 1194, 
        LeftX: 80
    };

    //caurumu pozicijas
    this.holes = [
        new Vector2(150, 148),
        new Vector2(1120, 148),
        new Vector2(148, 1118),
        new Vector2(1120, 1118)
    ];

    this.positioningBall = true;
    this.extraTurnEarned = false;
}


GameWorld.prototype.reset = function() {
    this.clearBalls(); //no sakuma visas bumbas izdes
    this.createBalls(); //tad izveido default vietaas

    this.stick = new Stick(new Vector2(635, 220), this.main_ball.shoot.bind(this.main_ball));

    this.positioningBall = true;
    this.extraTurnEarned = false;
    this.gameOver = false;
    this.winnerText = "";
};


//bumbu izveidosans funkcija ko izsauc resetGame funkcija
GameWorld.prototype.createBalls = function() {
    
    this.balls = [
        [new Vector2(495,90), COLOR.black, "black"],
        [new Vector2(535,90), COLOR.black, "black"],
        [new Vector2(575,90), COLOR.black, "black"],
        [new Vector2(615,90), COLOR.black, "black"],
        [new Vector2(655,90), COLOR.black, "black"],
        [new Vector2(695,90), COLOR.black, "black"],
        [new Vector2(735,90), COLOR.black, "black"],
        [new Vector2(775,90), COLOR.black, "black"],

        [new Vector2(495,1174), COLOR.red, "red"],
        [new Vector2(535,1174), COLOR.red, "red"],
        [new Vector2(575,1174), COLOR.red, "red"],
        [new Vector2(615,1174), COLOR.red, "red"],
        [new Vector2(655,1174), COLOR.red, "red"],
        [new Vector2(695,1174), COLOR.red, "red"],
        [new Vector2(735,1174), COLOR.red, "red"],
        [new Vector2(775,1174), COLOR.red, "red"],

        [new Vector2(635,1040), COLOR.big_red, "big"]
    ].map(params => {
        let ball = new Ball(params[0], params[1]);
        ball.type = params[2];
        return ball;
    });

    //izveido visu velreiz
    this.main_ball = this.balls[this.balls.length - 1];
    this.playerOneBalls = this.balls.filter(ball => ball.type === "red");
    this.playerTwoBalls = this.balls.filter(ball => ball.type === "black");
};

//funkcija lai izdzestu visas bumbas
GameWorld.prototype.clearBalls = function() {
    this.balls = [];
    this.playerOneBalls = [];
    this.playerTwoBalls = [];
    this.main_ball = null;
};

//funkcija kas pasaka ko darit kad spele ir beigusies
GameWorld.prototype.triggerGameOver = function(winnerText) {
    this.gameOver = true;
    this.winnerText = winnerText;
    Novus.showPopup(winnerText);
};

//checkot vai kads nav uzvareejis
GameWorld.prototype.checkWinCondition = function() {
    const redBallsRemaining = this.balls.some(ball => ball.type === "red");
    const blackBallsRemaining = this.balls.some(ball => ball.type === "black");

    if (!redBallsRemaining) {
        this.triggerGameOver("Black Player Won!!");
    } else if (!blackBallsRemaining) {
        this.triggerGameOver("Red Player Won!!");
    }
};


//ja bumba caurumaa to izdzeesh
Ball.prototype.isInHole = function(holes) {
    for (let hole of holes) {
        const distance = this.position.subtract(hole).lenght();
        if (distance <= HOLE_RADIUS) return true;
    }
    return false;
};

//ievietot jaunu bumbu, ja liela (govs) ir iekritusi caurumaa
GameWorld.prototype.placeNewSmallBallNearCenter = function() {
    const radius = SMALL_BALL_RADIUS;
    const step = 1;
    const bounds = this.table;

    //izskaita bumbu skaitu
    const redBallsCount = this.balls.filter(ball => ball.type === "red").length;
    const blackBallsCount = this.balls.filter(ball => ball.type === "black").length;

    //pacheko vai nav vairāk par 8 vienas krāsas bumbām
    if ((turn % 2 === 1 && blackBallsCount >= 8) || (turn % 2 === 0 && redBallsCount >= 8)) {
        return;
    }

    let center = (turn % 2 === 1)
        ? new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.TopY + radius)
        : new Vector2((this.table.LeftX + this.table.RightX) / 2, this.table.BottomY - radius + 7);

    
    for (let i = 0; i < center.x; i++) {
        let offsets = [i * step, -i * step];
        for (let offset of offsets) {
            let candidate = new Vector2(center.x + offset, center.y);

            let collision = this.balls.some(ball =>
                ball.position.subtract(candidate).lenght() < (2 * radius)
            );
            if (!collision) {
                let newBall = new Ball(candidate, turn % 2 === 1 ? COLOR.black : COLOR.red);
                newBall.type = turn % 2 === 1 ? "black" : "red";
                this.balls.unshift(newBall); //pievieno mazo bumbu lista sākumā
                return;
                
            }
        }
    }
};

//tiek galaa ar visam sadursmem
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
                const pocketedOpponentBall = (isPlayerOne && ball.type === "black") || (!isPlayerOne && ball.type === "red");

                if (pocketedOwnBall || pocketedOpponentBall) {
                    this.extraTurnEarned = true;
                }

                //izdzeesh bumbas kas ir caurumos
                this.balls.splice(i, 1);
            }            
            continue;
        }

        const radius = (ball === bigBall) ? BIG_BALL_RADIUS : SMALL_BALL_RADIUS;
        ball.resolveTableCollision(this.table, radius);

        for (let j = i + 1; j < this.balls.length; j++) {
            let first = this.balls[i];
            let second = this.balls[j];
        
            const centerPoint = new Vector2((this.table.LeftX + this.table.RightX) / 2, (this.table.TopY + this.table.BottomY) / 2);
            const centerRadius = 170; //radius centra aplim
            
            const isBigFirst = first === bigBall;
            const isBigSecond = second === bigBall;
            const oneIsBig = isBigFirst || isBigSecond;
            const small = isBigFirst ? second : first;
            
            //cheko vai ir notikusas saskriesanas
            const collisionDistance = BIG_BALL_RADIUS + SMALL_BALL_RADIUS;
            const actualDistance = first.position.subtract(second.position).lenght();
            
            if (oneIsBig && //checko vai "vidus bumbam" drikst uzsist
                (small.type === "red" || small.type === "black") &&
                actualDistance <= collisionDistance) {
            
                const distanceToCenter = small.position.subtract(centerPoint).lenght();
                if (distanceToCenter <= centerRadius) {
                    if (!this.bigBallTouchedBorderFirst) {
            
                        //atgriezt atpakal atrumus un vietas, ja sit bez galda atsitiena
                        small.position = small.previousPosition.copy();
                        small.velocity = new Vector2(0, 0);
            
                        bigBall.position = bigBall.previousPosition.copy();
                        bigBall.velocity = new Vector2(0, 0);
            
                        return;
                    } else {
                    }
                }
            }
               
            //veikt realas saskares
            if (second === bigBall) {
                first.collideWithBig(second);
            } else {
                first.collideWith(second);
            }
        }
        
    }
};

//kaa novietot lielo ripu uz linijas
GameWorld.prototype.handleBallPositioning = function() {
    const horizontalLineY = (turn % 2 === 1) ? 1040 : 220;

    //min un max, lai nevaretu aizbraukt par talu
    const newX = Math.max(this.table.LeftX + 150, Math.min(Mouse.position.x, this.table.RightX - 155));
    const newY = horizontalLineY;
    
    const desiredPosition = new Vector2(newX, newY);

    //vai peles pozīcija sakrīt ar bumbas pozīciju
    let validPosition = true;

    for (let i = 0; i < this.balls.length - 1; i++) { //...izņemot lielo bumbu
        const otherBall = this.balls[i];
        const distance = desiredPosition.subtract(otherBall.position).lenght();

        if (distance < SMALL_BALL_RADIUS + BIG_BALL_RADIUS) {
            validPosition = false;
            break;
        }
    }
    //ja atlauta pozicija tad shaut no tas
    if (validPosition) {
        this.main_ball.position.x = newX;
        this.main_ball.position.y = newY;
    }

    //kuram gajiens uz tas horizontales tiek novietots
    const oppositeSideY = (turn % 2 === 1) ? 220 : 1040;

    const angle = Math.atan2(oppositeSideY - this.main_ball.position.y, this.main_ball.position.x - Mouse.position.x);

    //sticka pozicija seko bumbas pozicijai
    this.stick.position = this.main_ball.position.copy();
    this.stick.rotation = angle;

    if (Mouse.left.pressed && validPosition) {
        this.positioningBall = false;
        this.stick.position = this.main_ball.position.copy();
    }
};

//funkcija kas vislaik updato visu ko redz
GameWorld.prototype.update = function() {

    //saglaba ieprieksejo poziciju nelegaliem gajieniem
    this.balls.forEach(ball => {
        ball.previousPosition = ball.position.copy();
    });
    
    if (this.positioningBall) {
        this.handleBallPositioning();
    }

    //izdara visas ieprieks definetas funkcijas
    this.handleCollisions();
    this.balls.forEach(ball => ball.update(delta));

    const bigBall = this.main_ball; //define lielo bumbu
    const bigBallPositionY = bigBall.position.y;

    //sarkanajam otra mala ir augsa
    if (turn % 2 === 1) {
        if (bigBallPositionY <= this.table.TopY + 30) {
            this.bigBallTouchedBorderFirst = true;
        }
    }
    //melnajam otra mala ir leja
    else {
        if (bigBallPositionY >= this.table.BottomY - 30) {
            this.bigBallTouchedBorderFirst = true;
        }
    }


    //checkot vai maza bumba ir iekseja rinkii
    const centerPoint = new Vector2((this.table.LeftX + this.table.RightX) / 2, (this.table.TopY + this.table.BottomY) / 2);
    const centerRadius = 170;

    for (let ball of this.balls) {
        if (ball.type === "red" || ball.type === "black") {
            const distanceToCenter = ball.position.subtract(centerPoint).lenght();
            if (distanceToCenter <= centerRadius) {
            }
        }
    }


    if (!this.positioningBall) {
        this.stick.update();
    }

    this.checkWinCondition();
    
    if (!this.ballsMoving() && this.stick.shot) {
        if (this.extraTurnEarned) {
            this.extraTurnEarned = false;
            //spēlētājs dabū vēl vienu gājienu
        } else {
            turn++;
            this.bigBallTouchedOppositeWall = false;
            this.bigBallTouchedBorderFirst = false;

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

//parada to visu uz ekrana
GameWorld.prototype.draw = function() {
    Canvas.drawImage(sprites.background, {x: 0, y: 0});
    this.stick.draw();
    this.balls.forEach(ball => ball.draw(delta));
};

//pasaka ka bumbas kustas ja to atrums ir lielaks par ...
GameWorld.prototype.ballsMoving = function() {
    return this.balls.some(ball =>
        Math.abs(ball.velocity.x) > 0.1 || Math.abs(ball.velocity.y) > 0.1
    );
};
