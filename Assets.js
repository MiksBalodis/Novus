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

    assetsLoadingLoop(callback);

}
