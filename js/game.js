// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 774;
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
var heroWidth = 43;
var heroHeight = 80;
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

// Good Food images
var goodFoodImage = new Image();
    goodFoodImage.src = "images/goodfood"+Math.floor((Math.random()*12)+1)+".png";

function createFoodImage(){
    var goodFoodImage2 = new Image();
    goodFoodImage2.src = "images/goodfood"+Math.floor((Math.random()*12)+1)+".png";
    return goodFoodImage2;
}

// Cloud images
var cloudImage = new Image();
    cloudImage.src = "images/cloud"+Math.floor((Math.random()*4)+1)+".png";

function createCloudImage(){
    var cloudImage2 = new Image();
    cloudImage2.src = "images/cloud"+Math.floor((Math.random()*4)+1)+".png";
    return cloudImage2;
}

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var peanut = {};
var peanutsCaught = 0;

var cloud = {};

var goodFood = {};
var goodFoodCaught = 0;

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

var level = 3;

function levelManager(){
    if (totalScore % 10 == 0 && totalScore > 1){
        console.log(level);
        level += 1;
        onScreenCounter();
        onScreenGoodFoodCounter();
    }
}




// Start Peanut --------------------------------------------------------------------------------------->
var peanutCount = [];

// Reset the game when the player catches a peanut
var createPeanut = function () {
    peanut.x = 32 + (Math.random() * (canvas.width - 64));
    peanut.y = 0;

    peanutCount.push({'x':peanut.x,'y':peanut.y});

};


// this sets the motion of the peanut
var lostLimit = 1000;
var lostPeanutCount = 0;
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



// Start Clouds --------------------------------------------------------------------------------------->
var cloudCount = [];
var createCloud = function () {
    cloud.x = 32 + (Math.random() * (canvas.width - 64));
    cloud.y = -100;
    var image = createCloudImage();

    cloudCount.push({'x':cloud.x,'y':cloud.y,'img':image});
};

// this sets the motion of the cloud
function moveCloud(cloudIndex){
   if (cloudCount[cloudIndex].y < canvas.height -32) {
       cloudCount[cloudIndex].y += .5;
   }
   else { // if Good Food reaches the bottom of the board...
       cloudCount.splice(cloudIndex,1);
       createCloud();
   }
}
function onScreenCloudCounter(){
    var idealCloudCount = 4;
    if (cloudCount.length <= idealCloudCount){
        var diff = idealCloudCount - cloudCount.length;
//        for (var i=0; i<diff; i++){
//            createCloud();
//        }
        for (i = 0; i < 5; i++) {
            (function(i) {
                setTimeout(function () {
                    createCloud();
//                    console.log(i);
                }, Math.floor(Math.random() * 5000)); //Math.floor((Math.random()*12)+1);
            })(i);
        }
    }

}
// End Cloud --------------------------------------------------------------------------------------->



var flipH = false;

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if (hero.y >= 0 + (heroHeight/2)){
            hero.y -= hero.speed * modifier;
        }
	}
	if (40 in keysDown) { // Player holding down
        if (hero.y <= canvas.height - (heroHeight/2)){
		    hero.y += hero.speed * modifier;
        }
	}
	if (37 in keysDown) { // Player holding left
        if (hero.x >= 0 + (heroWidth/2)){
		    hero.x -= hero.speed * modifier;
            flipH = true;
        }
	}
	if (39 in keysDown) { // Player holding right
        if (hero.x <= canvas.width - (heroWidth/2)){
		    hero.x += hero.speed * modifier;
            flipH = false;
        }
	}

	// Is Hero touching a Peanut?
    for (var i=0; i<peanutCount.length; i++){
        if (
            hero.x - (heroWidth/2) <= (peanutCount[i].x + 32)
            && peanutCount[i].x <= (hero.x + (heroWidth/2))
            && hero.y - (heroHeight/2) <= (peanutCount[i].y + 32)
            && peanutCount[i].y <= (hero.y + (heroHeight/2))
        ) {
            ++peanutsCaught;
            peanutCount.splice(i,1);
            createPeanut();
        }
    }

    // is Hero touching a good Food?
    for (var i=0; i<goodFoodCount.length; i++){
        if (
            hero.x - (heroWidth/2) <= (goodFoodCount[i].x + 32)
            && goodFoodCount[i].x <= (hero.x + (heroWidth/2))
            && hero.y - (heroHeight/2) <= (goodFoodCount[i].y + 32)
            && goodFoodCount[i].y <= (hero.y + (heroHeight/2))
        ) {
            ++goodFoodCaught;
            goodFoodCount.splice(i,1);
            createGoodFood();
            levelManager();
        }
    }
};

var totalScore = 0;


// Draw everything ---------------------------------------------------------->
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

    for (var i=0; i<cloudCount.length; i++){
        if (peanutReady) {
            ctx.drawImage(cloudCount[i].img, cloudCount[i].x, cloudCount[i].y); // cloud Image
        }
    }
	if (heroReady) {
        if (flipH == true){
           var posX = (hero.x+(heroWidth/2)) * -1;
            ctx.save(); // Save the current state
            ctx.scale(-1, 1); // Set scale to flip the image
		    ctx.drawImage(heroImage, posX, hero.y-(heroHeight/2), heroWidth, heroHeight);
            ctx.restore(); // Restore the last saved state
        }
        else {
            ctx.drawImage(heroImage, hero.x-(heroWidth/2), hero.y-(heroHeight/2));
        }
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
};

var gameOverLimit = 3;

// The main game loop
var main = function () {
    if (peanutsCaught < gameOverLimit){
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        for (var i=0; i<peanutCount.length; i++){
            movePeanut(i);
        }
        for (var i=0; i<goodFoodCount.length; i++){
            moveGoodFood(i);
        }
        for (var i=0; i<cloudCount.length; i++){
            moveCloud(i);
        }
        then = now;
        onScreenCloudCounter()
    }
};

// Let's play this game!
onScreenGoodFoodCounter();
onScreenCounter();


var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
//setInterval(onScreenCloudCounter, .1); // Execute as fast as possible
