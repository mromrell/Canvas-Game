// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
    bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";
bgImage.width = canvas.width;
bgImage.height = canvas.height;

// Hero image
var heroReady = false;
var heroImage = new Image();
var heroWidth = 43;
var heroHeight = 100;
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Jetpack Flame
var flameImage = new Image();
flameImage.src = "images/flame.png";

//// Joystick
//var joystickImage = new Image();
//joystickImage.src = "images/joystick2.png";
//
//var joystickCenterImage = new Image();
//joystickCenterImage.src = "images/joystickCenter2.png";
//var joystickWidth = 150;
//var joystickHeight = 150;

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
    onScreenCounter();
    onScreenGoodFoodCounter();

    id = setInterval(main, 1); // Execute as fast as possible

}

var cloud = {};

var goodFood = {};
var goodFoodCaught = 0;


var gameOverLimit = 500; //change this back to 5 for production
var level = 3;

function levelManager(){
    if (totalScore % 10 == 0 && totalScore > 1){
        level += 1;
        gameOverLimit += 1;
        onScreenCounter();
        onScreenGoodFoodCounter();
    }
}



// Start Peanut --------------------------------------------------------------------------------------->
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
    cloud.x = -132 + (Math.random() * (canvas.width +100));
    cloud.y = -100;
    var image = createCloudImage();

    cloudCount.push({'x':cloud.x,'y':cloud.y,'img':image});
};

// this sets the motion of the cloud
function moveCloud(cloudIndex){
   if (cloudCount[cloudIndex].y < canvas.height + 132) {
       cloudCount[cloudIndex].y += .1;
   }
   else { // if Good Food reaches the bottom of the board...
       cloudCount.splice(cloudIndex,1);
       createCloud();
   }
}
var timerCount = 0;
function onScreenCloudCounter(){
    var idealCloudCount = 24;
    timerCount += 1;
    if (timerCount == 300) {
        if (cloudCount.length <= idealCloudCount){
            createCloud();
            timerCount = 0;
        }
    }

}
// End Cloud --------------------------------------------------------------------------------------->

var momentum = 0;
var momentumDown = 0;
var momentumRight = 0;
var momentumLeft = 0;
var momentumSpeedUp = .008;
var momentumSpeed = .003;
var momentumSpeedHor = .00007;

// this sets the momentum of the hero
function moveHero(){

    // Start Vertical Momentum ---------------------------------------->
    if (!joystick.up() && momentum > 0) { // if the up button is NOT being pressed then this makes the momentum drop
        momentum -= momentumSpeed;
        if (hero.y < heroHeight/2) { // if Hero reaches the bottom of the board...
            momentum = 0;
        }
    }
    if (hero.y < canvas.height - (heroHeight / 2) && !joystick.up()) { // release the up key
        if (momentum > 0 && hero.y > (heroHeight / 2)) { // this will carry the hero up just a little higher
            hero.y -= momentum;
            momentum -= momentumSpeed;
        }
        if (momentum <= 0) { // once his momentum is gone, this will make him fall
            if (momentumDown < 4) {
                momentumDown += momentumSpeed;
            }
            hero.y += .4 * momentumDown;
        }
    }
    if (hero.y == canvas.height - (heroHeight / 2)) { // if Hero reaches the bottom of the board...
        momentumDown = 0
    }
    // End Vertical Momentum ---------------------------------------->


    // Start Right Momentum ---------------------------------------->
    if (hero.x >= canvas.width - (heroWidth)) { // if Hero reaches the far right of the board...
        momentumRight = 0;
        hero.x = canvas.width - (heroWidth);
    }
    if (!joystick.right() && momentumRight > 0 && hero.x < canvas.width - (heroWidth / 2)) { // if the right button is NOT being pressed then this makes the momentumRight drop
        momentumRight -= momentumSpeedHor;
        hero.x += momentumRight;
    }
    // End Right Momentum ---------------------------------------->


    // Start Left Momentum ---------------------------------------->
    if (!joystick.left() && momentumLeft > 0 && hero.x > (heroWidth / 2)) { // if the left button is NOT being pressed then this makes the momentumLeft drop
        momentumLeft -= momentumSpeedHor;
        hero.x -= momentumLeft;
    }

    if (hero.x < (heroWidth / 2)) { // if Hero reaches the left of the board...
        momentumLeft = 0;
        hero.x = (heroWidth / 2);  // this is here as a hack fix to a bug with the joystick
    }
    // End Left Momentum ---------------------------------------->


}


var flipH = false;
//var joystickX = canvas.width - (150/2);
//var joystickY = canvas.height - (150/2);
var joystick = new VirtualJoystick({
    mouseSupport: true,
//    stationaryBase: true,
//    baseX: joystickX,
//    baseY: joystickY,
    limitStickTravel: true,
    stickRadius: 50
});


// Update game objects
var update = function (modifier) {
	if (joystick.up()) { // Player holding up
		if (hero.y >= 0 + (heroHeight/2)){
            momentum += momentumSpeedUp;
            if (momentumDown >= 0){
                momentumDown -= momentumSpeedUp;
            }
            hero.y -= hero.speed * modifier * (momentum);
        }
	}
	if (joystick.down()) { // Player holding down
        if (hero.y <= canvas.height - (heroHeight/2)){
            momentum = 0;
		    hero.y += hero.speed * modifier;
        }
	}
	if (joystick.left()) { // Player holding left
        if (hero.x >= 0 + (heroWidth/2)){
            momentumLeft += momentumSpeedHor;
		    hero.x -= hero.speed * momentumLeft;
            flipH = true;
        }
//        if (hero.x < 0){
//            momentumLeft = 0;
//            hero.x = 50;
//        }
	}
	if (joystick.right()) { // Player holding right
        if (hero.x <= canvas.width - (heroWidth/2)){
            momentumRight += momentumSpeedHor;
            hero.x += hero.speed * momentumRight;
            flipH = false;
        }
	}

//    if (joystick.up()) {
//        hero.y -= hero.speed * modifier * (momentum);
//    }
//    if (joystick.down()) {
//        hero.y += hero.speed * modifier;
//    }
//    if (joystick.right()) {
//        if (hero.x <= canvas.width - (heroWidth/2)){
//            momentumRight += momentumSpeedHor;
//		    hero.x += hero.speed * momentumRight;
//            flipH = false;
//        }
//    }
//    if (joystick.left()) {
//        if (hero.x >= 0 + (heroWidth/2)){
//            momentumLeft += momentumSpeedHor;
//		    hero.x -= hero.speed * momentumLeft;
//            flipH = true;
//        }
//    }

//    if (joystick.right()) {
//         console.log("Joystick Right");
//    }
//    if (joystick.left()) {
//         console.log("Joystick Left");
//    }
//    if (joystick.up()) {
//        console.log("Joystick Up");
//    }
//    if (joystick.down()) {
//         console.log("Joystick Down");
//    }



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
            if (joystick.up()){
		        ctx.drawImage(flameImage, posX, hero.y-(heroHeight/2), heroWidth, heroHeight);
            }
		    ctx.drawImage(heroImage, posX, hero.y-(heroHeight/2), heroWidth, heroHeight);
            ctx.restore(); // Restore the last saved state
        }
        else {
            if (joystick.up()){
                ctx.drawImage(flameImage, hero.x-(heroWidth/2), hero.y-(heroHeight/2));
            }
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
//    if (joystickImage){
//        ctx.drawImage(joystickImage, canvas.width - (joystickWidth), canvas.height - (joystickHeight));
//        ctx.drawImage(joystickCenterImage, canvas.width - (joystickWidth), canvas.height - (joystickHeight));
//    }


	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

    var livesLeft = gameOverLimit - peanutsCaught;

    totalScore = goodFoodCaught - peanutsCaught;
	ctx.fillText("Score: " + totalScore, 32, 32);
	ctx.fillText("Lives Left " + livesLeft + " of " + gameOverLimit, 32, 56);
};



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
        onScreenCloudCounter();
        moveHero();
    }

};

// Let's play this game!
onScreenGoodFoodCounter();
onScreenCounter();


var then = Date.now();


startGame();

setInterval(main, 1); // Execute as fast as possible
//setInterval(onScreenCloudCounter, .1); // Execute as fast as possible
