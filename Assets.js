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
    sprites.background = loadSprite('novus_galds-jauns.png');
    sprites.stick = loadSprite("stick-jauns.png");
    sprites.main_ball = loadSprite('govs-jauns.png');
    sprites.main_ball_red = loadSprite('govs-sarkana-jauns.png')
    sprites.small_red = loadSprite('small_red-jauns.png');
    sprites.small_black = loadSprite('small_black-jauns.png');

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
