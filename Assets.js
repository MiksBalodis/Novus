let sprites = {};
let assetsStillLoading = 0;

function assetsLoadingLoop(callback){
    if(assetsStillLoading){
        requestAnimationFrame(assetsLoadingLoop.bind(this,callback));
    }
    else{
        callback();
    }
}

function loadAssets(callback) {
    function loadSprite(fileName){
        assetsStillLoading++;

        let spriteImage = new Image();
        spriteImage.src = "./assets/" + fileName;

        spriteImage.onload = function(){
            assetsStillLoading--;

        }

        return spriteImage;
    }
    sprites.background = loadSprite('novus_galds.png');
    sprites.stick = loadSprite("stick.png");
    sprites.main_ball = loadSprite('govs.png');
    sprites.main_ball_red = loadSprite('govs-sarkana.png')
    sprites.small_red = loadSprite('small_red.png');
    sprites.small_black = loadSprite('small_black.png');

    assetsLoadingLoop(callback);

}

function getBallSpriteByColor(color){
    switch(color){

        case COLOR.red:
            return sprites.small_red;
        case COLOR.black:
            return sprites.small_black;
        case COLOR.big_black:
            return sprites.main_ball;
        case COLOR.big_red:
            return sprites.main_ball_red;
    }
}