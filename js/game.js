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

// set monster speed
monster.speed = Math.random();
monster.direction = Math.random() * Math.PI * 2;
monster.turnSpeed = 0;

monster.direction += monster.turnSpeed * 0.01;
monster.x += Math.sin(monster.direction) * monster.speed;
monster.y += Math.cos(monster.direction) * monster.speed;

var monstersCount = 0;
// Reset the game when the player catches a monster
var reset = function () {
//    if (monstersCount = 5){
//        // Throw the monster somewhere on the screen randomly
//        monster.x = 32 + (Math.random() * (canvas.width - 64));
//        monster.y = 0; //32 + (Math.random() * (canvas.height - 64));
//    }
//    else {
        // Throw the monster somewhere on the screen randomly
        monster.x = 32 + (Math.random() * (canvas.width - 64));
        monster.y = 0; //32 + (Math.random() * (canvas.height - 64));

        // this sets the motion of the monster
        function moveMonster(){
           if (monster.y < canvas.height -32) {
                monster.y += 1;
                setTimeout(moveMonster, 50);
            }
        }
        moveMonster();
        monstersCount +=1;
//    }
};




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
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
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

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
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

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
