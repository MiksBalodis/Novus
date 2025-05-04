function Game() {
    this.gameWorld = new GameWorld();
    this.popup = null;
}

Game.prototype.init = function () {
    this.gameWorld = new GameWorld();

    if (!this.popup) {
        this.createPopup();
    }
};


Game.prototype.createPopup = function() {
    this.popup = document.createElement('div');
    this.popup.style.position = 'absolute';
    this.popup.style.top = '50%';
    this.popup.style.left = '50%';
    this.popup.style.transform = 'translate(-50%, -50%)';
    this.popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.popup.style.padding = '20px';
    this.popup.style.borderRadius = '10px';
    this.popup.style.display = 'none';

    this.popupText = document.createElement('p');
    this.popupText.style.color = 'white';
    this.popupText.style.fontSize = '20px';

    this.resetButton = document.createElement('button');
    this.resetButton.textContent = 'Restart Game';
    this.resetButton.style.marginTop = '10px';

    this.popup.appendChild(this.popupText);
    this.popup.appendChild(this.resetButton);

    document.body.appendChild(this.popup);
    this.resetButton.addEventListener('click', () => {
        this.resetGame();
    });
}

Game.prototype.showPopup = function(winnerText) {
    this.popupText.textContent = winnerText;
    this.popup.style.display = 'block';

}

//reset funkcija, lai saktu speli no sakuma
Game.prototype.resetGame = function () {
    turn = 1;
    this.gameOver = false;
    this.winnerText = "";
    this.gameWorld.reset();
    
    if (this.popup) {
        this.popup.style.display = 'none';
    }

    Mouse.reset();
};


Game.prototype.start = function() {
    Novus.init();
    Novus.mainLoop();
}

Game.prototype.mainLoop = function() {
    Canvas.clear();
    Novus.gameWorld.update();
    Novus.gameWorld.draw();
    Mouse.reset();

    requestAnimationFrame(Novus.mainLoop);
}

let Novus = new Game();
