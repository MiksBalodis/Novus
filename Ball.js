const ball_origin = new Vector2(30, 30);
const BIG_BALL = 60;
const SMALL_BALL = 40;
const BIG_BALL_RADIUS = BIG_BALL/2;
const SMALL_BALL_RADIUS = SMALL_BALL/2;
const SBballrad = SMALL_BALL_RADIUS+BIG_BALL_RADIUS;

function Ball(position, color){
    this.position = position;
    this.velocity = new Vector2();
    this.moving = false;
    this.sprite = getBallSpriteByColor(color);
}

Ball.prototype.update = function(delta){ 
    this.position = this.position.add(this.velocity.mult(delta));

    //berzes speeks
    this.velocity = this.velocity.mult(0.975); 

    if(this.velocity.lenght() < 5){ //bumba apstāsies kad ātrums būs mazāks par ...
        this.velocity.lenght = 0;
        this.moving = false;
    }
    
}

Ball.prototype.draw = function(){
    Canvas.drawImage(this.sprite, this.position, ball_origin);

}

Ball.prototype.shoot = function(power, rotation){
    this.velocity = new Vector2(power * Math.cos(rotation), power * Math.sin(rotation));
    this.moving = true;
}

Ball.prototype.collideWithBall = function(ball) {
    // normalvektors
    const n = this.position.subtract(ball.position);
    
    // attālums starp bumbām
    const distance = n.lenght();

    // mazākais atlautais attālums, lai "nesaliptu"
    const minDistance = SMALL_BALL;

    if (distance >= minDistance) return;

    // "overlaps"
    const overlap = minDistance - distance;

    // kad "overlaps" atgrūzt bumbas vienādi
    const correction = n.mult(overlap / (2 * distance)); 
    this.position = this.position.add(correction);
    ball.position = ball.position.subtract(correction);

    // "normalizēt" normālvektorus un tan vektorus
    const unit = n.mult(1 / distance);
    const tangent = new Vector2(-unit.y, unit.x);

    // projicē vektorus
    const v1n = unit.dot(this.velocity);
    const v1t = tangent.dot(this.velocity);
    const v2n = unit.dot(ball.velocity);
    const v2t = tangent.dot(ball.velocity);

    // apgriež vektoru komponentes
    let v1nTag = v2n;
    let v2nTag = v1n;

    // neliels enerģijas zudums
    v1nTag = unit.mult(v1nTag * 0.96);
    v2nTag = unit.mult(v2nTag * 0.96);

    // atpakal uz parastajiem vektoriem
    const v1tTag = tangent.mult(v1t);
    const v2tTag = tangent.mult(v2t);

    // updatot ātrumus
    this.velocity = v1nTag.add(v1tTag);
    ball.velocity = v2nTag.add(v2tTag);
    this.moving = true;
    ball.moving = true;
};


Ball.prototype.collideWithBallBig = function(ball){

    //normalvektors
    const n = this.position.subtract(ball.position);

    //distance
    const distance = n.lenght();

    if(distance > SBballrad){
        return;
    }
    

    //mazakaa distance ko objekts var pakusteeties
    const mtd = n.mult((SBballrad - distance)/distance);

    //bumbas neliip kopaa
    this.position = this.position.add(mtd.mult(1/2));
    ball.position = ball.position.subtract(mtd.mult(1/2));

    //unit normal vektors
    const unit = n.mult(1/n.lenght());

    //unit tangent vektors
    const tangent = new Vector2(-unit.y, unit.x);

    //projicee atrumus uz unit normalvektoriem un unit tangent vektoriem
    const v1n = unit.dot(this.velocity);
    const v1t = tangent.dot(this.velocity);
    const v2n = unit.dot(ball.velocity);
    const v2t = tangent.dot(ball.velocity);

    //jaunie normal atrumi
    let v1nTag = v2n;
    let v2nTag = v1n;
    
    //skalarie (normal un tangengt) atrumi ==> vektoriem
    v1nTag = unit.mult(v1nTag);
    const v1tTag = tangent.mult(v1t);
    v2nTag = unit.mult(v2nTag);
    const v2tTag = tangent.mult(v2t);

    //updatojam atrumus
    
    this.velocity = v1nTag.add(v1tTag);
    ball.velocity = v2nTag.add(v2tTag);
    this.velocity = v1nTag.mult(0.9);
    ball.velocity = v2nTag.mult(0.9);
    this.moving = true;
    ball.moving = true;
     
}

Ball.prototype.resolveTableCollision = function(table, radius) {
    if (!this.moving) return;

    let collided = false;

    if (this.position.y < table.TopY + radius) {
        this.position.y = table.TopY + radius;
        this.velocity.y *= -0.9; // nedaudz zaudē enerģiju
        collided = true;
    }

    if (this.position.x > table.RightX - radius) {
        this.position.x = table.RightX - radius;
        this.velocity.x *= -0.9;
        collided = true;
    }

    if (this.position.y > table.BottomY - radius) {
        this.position.y = table.BottomY - radius;
        this.velocity.y *= -0.9;
        collided = true;
    }

    if (this.position.x < table.LeftX + radius) {
        this.position.x = table.LeftX + radius;
        this.velocity.x *= -0.9;
        collided = true;
    }

    //berze
    if (collided) {
        this.velocity = this.velocity.mult(0.98);
    }
};


Ball.prototype.collideWith = function(object){

    if(object instanceof Ball){
        this.collideWithBall(object);
    }
    else{
        this.collideWithTable(object);
    }

}

Ball.prototype.collideWithBig = function(object){

    if(object instanceof Ball){
        this.collideWithBallBig(object);
    }
    else{
        this.collideWithTableBig(object);
    }

}
