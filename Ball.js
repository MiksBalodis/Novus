const ball_origin = new Vector2(15, 15);
const BIG_BALL = 30;
const SMALL_BALL = 20;
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
    this.position.addTo(this.velocity.mult(delta));

    //berzes speeks
    this.velocity = this.velocity.mult(0.975); 

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

Ball.prototype.collideWithBall = function(ball){

    //normalvektors
    const n = this.position.subtract(ball.position);

    //distance
    const distance = n.lenght();

    if(distance > SMALL_BALL){
        return;
    }
    

    //mazakaa distance ko objekts var pakusteeties
    const mtd = n.mult((SMALL_BALL - distance)/distance);

    //bumbas kaut kas neliip kopaa
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
    v1nTag = unit.mult(v1nTag*0.96);
    const v1tTag = tangent.mult(v1t);
    v2nTag = unit.mult(v2nTag*0.96);
    const v2tTag = tangent.mult(v2t);

    //updatojam atrumus
    this.velocity = v1nTag.add(v1tTag);
    ball.velocity = v2nTag.add(v2tTag);
    this.moving = true;
    ball.moving = true;
   
}

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

    //bumbas kaut kas neliip kopaa
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
    this.velocity = v1nTag.mult(0.6);
    ball.velocity = v2nTag.mult(0.6);
    this.moving = true;
    ball.moving = true;
  
    
}

Ball.prototype.collideWithTable = function(table){
    if(!this.moving){
        return;
    }

    let collided = false;

    if(this.position.y-10 <= table.TopY + SMALL_BALL_RADIUS){
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if(this.position.x+10 >= table.RightX - SMALL_BALL_RADIUS){
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if(this.position.y+10 >= table.BottomY - SMALL_BALL_RADIUS){
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if(this.position.x-10 <= table.LeftX + SMALL_BALL_RADIUS){
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if(collided){
        this.velocity = this.velocity.mult(1);
    }
}


Ball.prototype.collideWithTableBig = function(table){
    if(!this.moving){
        return;
    }

    let collided = false;

    if(this.position.y-10 <= table.TopY + BIG_BALL_RADIUS){
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if(this.position.x+10 >= table.RightX - BIG_BALL_RADIUS){
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if(this.position.y+10 >= table.BottomY - BIG_BALL_RADIUS){
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if(this.position.x-10 <= table.LeftX + BIG_BALL_RADIUS){
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if(collided){
        this.velocity = this.velocity.mult(0.975);
    }
}

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
