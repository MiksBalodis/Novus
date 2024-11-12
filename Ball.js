const ball_origin = new Vector2(15, 15);

function Ball(position){
    this.position = position;
    this.velocity = new Vector2();
}

Ball.prototype.update = function(delta){ //varbut delta ir problema
    this.position.addTo(this.velocity.mult(delta));

    this.velocity = this.velocity.mult(0.98); //drag force
}

Ball.prototype.draw = function(){
    Canvas.drawImage(sprites.main_ball, this.position, ball_origin);

}

Ball.prototype.shoot = function(power, rotation){
    this.velocity = new Vector2(power * Math.cos(rotation), power * Math.sin(rotation));
}