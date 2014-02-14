// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
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

// Peanut image
var peanutReady = false;
var peanutImage = new Image();
peanutImage.onload = function () {
	peanutReady = true;
};
peanutImage.src = "images/peanut.png";

// Good Food image
var goodFoodImage = new Image();
    goodFoodImage.src = "images/goodfood"+Math.floor((Math.random()*11)+1)+".png";

function createFoodImage(){
    var goodFoodImage2 = new Image();
    goodFoodImage2.src = "images/goodfood"+Math.floor((Math.random()*11)+1)+".png";
    return goodFoodImage2;
}

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};

    var peanut = {};
    var peanutsCaught = 0;

    var goodFood = {};
    var goodFoodCaught = 0;

    var peanutCount = [];

    var lostPeanutCount = 0;
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

var id = 0;

var startGame = function () {

    clearInterval(id);

    peanut = {};
    peanutsCaught = 0;

    goodFood = {};
    goodFoodCaught = 0;

//starts the hero in the middle of the board
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    peanutCount = [];

    lostPeanutCount = 0;

    id = setInterval(main, 1); // Execute as fast as possible

}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



var level = 3;

function levelManager(){
    if (totalScore % 10 == 0 && totalScore > 1){
        console.log(level);
        level += 1;
        onScreenCounter();
        onScreenGoodFoodCounter();
    }
}



// Reset the game when the player catches a peanut
var createPeanut = function () {
    peanut.x = 32 + (Math.random() * (canvas.width - 64));
    peanut.y = 0;

    peanutCount.push({'x':peanut.x,'y':peanut.y});

};


// this sets the motion of the peanut
var lostLimit = 1000;

function movePeanut(peanutIndex){
   if (peanutCount[peanutIndex].y < canvas.height -32) {
        peanutCount[peanutIndex].y += .5;
   }
   else { // if peanut reaches the bottom of the board...
        peanutCount.splice(peanutIndex,1);
       createPeanut();
   }
}
function onScreenCounter(){
    if (peanutCount.length <= level){
        var diff = level - peanutCount.length;
        for (var i=0; i<diff; i++){
            createPeanut();
        }
    }
}
// End Peanut --------------------------------------------------------------------------------------->


// Start Good Food --------------------------------------------------------------------------------------->
var goodFoodCount = [];
var createGoodFood = function () {
    goodFood.x = 32 + (Math.random() * (canvas.width - 64));
    goodFood.y = 0;
    var image = createFoodImage();

    goodFoodCount.push({'x':goodFood.x,'y':goodFood.y,'img':image});
    console.log(goodFoodCount);
};

// this sets the motion of the goodFood
var lostGoodFoodLimit = 1000;
var lostGoodFoodCount = 0;
function moveGoodFood(goodFoodIndex){
   if (goodFoodCount[goodFoodIndex].y < canvas.height -32) {
       goodFoodCount[goodFoodIndex].y += .5;
   }
   else { // if Good Food reaches the bottom of the board...
       goodFoodCount.splice(goodFoodIndex,1);
       createGoodFood();
   }
}
function onScreenGoodFoodCounter(){

    if (goodFoodCount.length <= level){
        var diff = level - goodFoodCount.length;
        for (var i=0; i<diff; i++){
            createGoodFood();
        }
    }
}
// End Good Food --------------------------------------------------------------------------------------->




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

	// Is Hero touching a Peanut?
    for (var i=0; i<peanutCount.length; i++){
        if (
            hero.x <= (peanutCount[i].x + 32)
            && peanutCount[i].x <= (hero.x + 32)
            && hero.y <= (peanutCount[i].y + 32)
            && peanutCount[i].y <= (hero.y + 32)
        ) {
            ++peanutsCaught;
            peanutCount.splice(i,1);
            createPeanut();
        }
    }

    // is Hero touching a good Food?
    for (var i=0; i<goodFoodCount.length; i++){
        if (
            hero.x <= (goodFoodCount[i].x + 32)
            && goodFoodCount[i].x <= (hero.x + 32)
            && hero.y <= (goodFoodCount[i].y + 32)
            && goodFoodCount[i].y <= (hero.y + 32)
        ) {
            ++goodFoodCaught;
            goodFoodCount.splice(i,1);
            createGoodFood();
            levelManager();
        }
    }
};

var totalScore = 0;
// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

    for (var i=0; i<peanutCount.length; i++){
        if (peanutReady) {
            ctx.drawImage(peanutImage, peanutCount[i].x, peanutCount[i].y);
        }
    }
    for (var i=0; i<goodFoodCount.length; i++){
        if (peanutReady) {
            ctx.drawImage(goodFoodCount[i].img, goodFoodCount[i].x, goodFoodCount[i].y); //goodFoodImage
        }
    }

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

    totalScore = goodFoodCaught - peanutsCaught;
	ctx.fillText("Score: " + totalScore, 32, 32);
	ctx.fillText("Bad Food: " + peanutsCaught, 32, 64);
};

var gameOverLimit = 3;

// The main game loop
var main = function () {
    if (peanutsCaught < gameOverLimit){
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();
//        onScreenGoodFoodCounter();
//        onScreenCounter();
//        levelManager();
    //    onScreenCounter();

        for (var i=0; i<peanutCount.length; i++){
            movePeanut(i);
        }
        for (var i=0; i<goodFoodCount.length; i++){
            moveGoodFood(i);
        }

        then = now;
    }

};

// Let's play this game!
onScreenGoodFoodCounter();
onScreenCounter();

var then = Date.now();

startGame();





