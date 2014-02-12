// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var level = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//starts the hero in the middle of the board
hero.x = canvas.width / 2;
hero.y = canvas.height / 2;

function gameOver(){
    console.log("You Lose!");
}
var monsterCount = [];
// Reset the game when the player catches a monster

var reset = function () {
    for (var i=0; i<3; i++){
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 0; //32 + (Math.random() * (canvas.height - 64));

    monsterCount.push({'x':monster.x,'y':monster.y});
    console.log(monsterCount);
    }
};

// this sets the motion of the monster
var lostLimit = 1000;
var lostMonsterCount = 0;
function moveMonster(monsterIndex){
   if (monsterCount[monsterIndex].y < canvas.height -32) {
        monsterCount[monsterIndex].y += .5;
   }
   else { // if monster reaches the bottom of the board...

       lostMonsterCount += 1;
       console.log(lostMonsterCount);
       if (lostMonsterCount == lostLimit){
           gameOver();
       }
       else {
            monsterCount.splice(monsterIndex,1);
       }
   }

}


// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if (hero.y >= 0){
            hero.y -= hero.speed * modifier;
        }
	}
	if (40 in keysDown) { // Player holding down
        if (hero.y <= canvas.height - 32){
		    hero.y += hero.speed * modifier;
        }
	}
	if (37 in keysDown) { // Player holding left
        if (hero.x >= 0){
		    hero.x -= hero.speed * modifier;
        }
	}
	if (39 in keysDown) { // Player holding right
        if (hero.x <= canvas.width - 32){
		    hero.x += hero.speed * modifier;
        }
	}

	// Are they touching?
    for (var i=0; i<monsterCount.length; i++){
        if (
            hero.x <= (monsterCount[i].x + 32)
            && monsterCount[i].x <= (hero.x + 32)
            && hero.y <= (monsterCount[i].y + 32)
            && monsterCount[i].y <= (hero.y + 32)
        ) {
            ++monstersCaught;
            monsterCount.splice(i,1);
            reset();
        }
    }
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

    for (var i=0; i<monsterCount.length; i++){
        if (monsterReady) {
            ctx.drawImage(monsterImage, monsterCount[i].x, monsterCount[i].y);
        }
    }

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

    for (var i=0; i<monsterCount.length; i++){
        moveMonster(i);
    }



	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
