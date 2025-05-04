const SMALL_BALL_ORIGIN = new Vector2(20, 20);
const BIG_BALL_ORIGIN = new Vector2(30, 30);

const BIG_BALL = 60; // lielas bumbas diametrs
const SMALL_BALL = 40; // mazas bumbas diametrs
const BIG_BALL_RADIUS = BIG_BALL / 2;
const SMALL_BALL_RADIUS = SMALL_BALL / 2;
const SBballrad = SMALL_BALL_RADIUS + BIG_BALL_RADIUS;

//definejam bumbu masas
const BIG_BALL_MASS = 2;
const SMALL_BALL_MASS = 1;

function Ball(position, color, isBig) {
    this.position = position;
    this.previousPosition = position.copy();
    this.velocity = new Vector2();
    this.moving = false;
    this.sprite = getBallSpriteByColor(color);
    this.isBig = isBig;
    this.mass = isBig ? BIG_BALL_MASS : SMALL_BALL_MASS;
}

Ball.prototype.update = function (delta) {
    this.previousPosition = this.position.copy();

    this.position = this.position.add(this.velocity.mult(delta));

    // berze pret galda virsmu
    this.velocity = this.velocity.mult(0.98);

    //apstadinat bumbu, ja ta kustas par lenu
    if (this.velocity.lenght() < 4) {
        this.velocity = new Vector2(0, 0);
        this.moving = false;
    }
};

Ball.prototype.draw = function () {
    const origin = (this.sprite === sprites.main_ball || this.sprite === sprites.main_ball_red)
        ? BIG_BALL_ORIGIN
        : SMALL_BALL_ORIGIN;

    Canvas.drawImage(this.sprite, this.position, origin);
};

Ball.prototype.shoot = function (power, rotation) {
    if (this.moving) return;

    this.velocity = new Vector2(power * Math.cos(rotation), power * Math.sin(rotation)).mult(0.95);
    this.moving = true;
};

Ball.prototype.collideWithBall = function (ball) {
    const n = this.position.subtract(ball.position);
    const distance = n.lenght();
    const minDistance = SMALL_BALL;

    if (distance >= minDistance - 0.5) return;

    const overlap = minDistance - distance;
    const correction = n.mult(overlap / (2 * distance));
    this.position = this.position.add(correction);
    ball.position = ball.position.subtract(correction);

    const unit = n.mult(1 / distance);
    const tangent = new Vector2(-unit.y, unit.x);

    //projicet atrumus uz normalvektoru un tangento vektoru
    const v1n = unit.dot(this.velocity);
    const v1t = tangent.dot(this.velocity);
    const v2n = unit.dot(ball.velocity);
    const v2t = tangent.dot(ball.velocity);

    //iedot masas
    const m1 = this.mass;
    const m2 = ball.mass;

    //aprekinat jaunos normalatrumus ieskaitot masu
    const v1nTag = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
    const v2nTag = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);

    //iedod jaunos atrumus nemainot tangent vektorus
    this.velocity = unit.mult(v1nTag).add(tangent.mult(v1t));
    ball.velocity = unit.mult(v2nTag).add(tangent.mult(v2t));

    this.velocity = this.velocity.mult(0.98);
    ball.velocity = ball.velocity.mult(0.98);

    this.moving = true;
    ball.moving = true;
};

Ball.prototype.collideWithBallBig = function (ball) {
    const n = this.position.subtract(ball.position);
    const distance = n.lenght();

    if (distance > SBballrad - 0.5) return;

    const mtd = n.mult((SBballrad - distance) / distance);
    this.position = this.position.add(mtd.mult(0.5));
    ball.position = ball.position.subtract(mtd.mult(0.5));

    const unit = n.mult(1 / n.lenght());
    const tangent = new Vector2(-unit.y, unit.x);

    const v1n = unit.dot(this.velocity);
    const v1t = tangent.dot(this.velocity);
    const v2n = unit.dot(ball.velocity);
    const v2t = tangent.dot(ball.velocity);

    const m1 = this.mass;
    const m2 = ball.mass;

    const v1nTag = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
    const v2nTag = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);

    this.velocity = unit.mult(v1nTag).add(tangent.mult(v1t)).mult(0.9);
    ball.velocity = unit.mult(v2nTag).add(tangent.mult(v2t)).mult(0.9);

    this.moving = true;
    ball.moving = true;
};

Ball.prototype.resolveTableCollision = function (table, radius) {
    if (!this.moving) return;

    let collided = false;

    if (this.position.y < table.TopY + radius) {
        this.position.y = table.TopY + radius;
        this.velocity.y *= -0.8;
        collided = true;
    }

    if (this.position.x > table.RightX - radius) {
        this.position.x = table.RightX - radius;
        this.velocity.x *= -0.8;
        collided = true;
    }

    if (this.position.y > table.BottomY - radius) {
        this.position.y = table.BottomY - radius;
        this.velocity.y *= -0.8;
        collided = true;
    }

    if (this.position.x < table.LeftX + radius) {
        this.position.x = table.LeftX + radius;
        this.velocity.x *= -0.8;
        collided = true;
    }

    if (collided) {
        this.velocity = this.velocity.mult(0.98);
    }
};

Ball.prototype.collideWith = function (object) {
    if (object instanceof Ball) {
        this.collideWithBall(object);
    } else {
        this.collideWithTable(object);
    }
};

Ball.prototype.collideWithBig = function (object) {
    if (object instanceof Ball) {
        this.collideWithBallBig(object);
    } else {
        this.collideWithTableBig(object);
    }
};
