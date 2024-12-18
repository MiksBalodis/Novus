const ball_origin = new Vector2(15, 15);
const BIG_BALL_R = 30;
const SMALL_BALL_R = 10;

function Ball(position, color){
    this.position = position;
    this.velocity = new Vector2();
    this.moving = false;
    this.sprite = getBallSpriteByColor(color);
}

Ball.prototype.update = function(delta){ 
    this.position.addTo(this.velocity.mult(delta));

    this.velocity = this.velocity.mult(0.98); 

    if(this.velocity.lenght() < 10){
        this.velocity = new Vector2();
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

Ball.prototype.collideWith = function(ball){

    //normalvektors
    const n = this.position.subtract(ball.position);

    //distance
    const distance = n.lenght();

    if(distance > SMALL_BALL_R){
        return;
    }

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

    this.moving = true;
    ball.moving = true;
}
