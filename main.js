// **************************************************************************
//        SETTING UP / GLOBAL VARIABLES
// **************************************************************************

// Get access to our HTML canvas element and make it a JavaScript object
var canvas = document.getElementById('canvas');
// Set up our Canvas API drawing context, an object that lets us access canvas drawing methods
var pen = canvas.getContext('2d');

// Global variables for drawing the game
var width = 800;      // width of the canvas element, in pixels (should match the HTML!)
var height = 600;     // height of the canvas element, in pixles (should match the HTML!)
var scale = 20;       // size of a grid square in our game, in pixels

// Global variables for running the animation
var millisecondsBetweenFrames = 100; // controls animation speed. 100 here means 10 frames per second
var animationId;                     // will hold a unique ID to let us turn the animation off when game over
var nextFrameTimestamp = 0;          // used to run the animation - see the animate() function

// When the user releases any key on the keyboard, run this function:
document.addEventListener("keyup", handleKeyUp);

// Create an instance of our Snake object
var snake = new Snake();

// Create an instance of our Food object
var food = new Food();

// Start the animation loop! (which will repeat forever until we stop it)
animationFrameId = requestAnimationFrame(animate);
    // For more info on requestAnimationFrame:
    // https://css-tricks.com/using-requestanimationframe/


// **************************************************************************
//        DEFINING THE SNAKE OBJECT
// **************************************************************************

// Defines the properties and methods of every Snake object:
function Snake () {
  // Initial coordinates are (0, 0) for (x, y)
  this.x = 0;
  this.y = 0;

  // Initially, the snake starts moving to the right
  this.xDirection = 1 * scale;
  this.yDirection = 0 * scale;
}

// This method updates the snake's direction (used in handleKeyUp function)
Snake.prototype.updateDirection = function(x, y) {
  this.xDirection = x * scale;
  this.yDirection = y * scale;
};

// Method for the snake to update its coordinates
// NOTE: this is called by our animate function as part of the animation loop!
Snake.prototype.updatePosition = function() {
    // If x coordinate is off the canvas, we hit an edge, so game over!
    if (this.x < 0 || this.x > width - scale) {
      return "die";
    } else {
      // Otherwise, update x coord based on OLD x coord plus current direction
      this.x = this.x + this.xDirection;
    }

    // If y coordinate is off the canvas, we hit an edge, so game over!
    if (this.y< 0 || this.y > height - scale) {
      return "die";
    } else {
      // Otherwise, update y coord based on OLD y coord plus current direction
      this.y = this.y + this.yDirection;
    }

    // Check if the snake ate the food! If its new coordinates match the food, it ate:
    if (this.x === food.x && this.y === food.y) {
      return "eat";
    }

};

// This method draws the snake using its coordinates
Snake.prototype.draw = function() {
  pen.fillStyle = "black";
  pen.fillRect(this.x, this.y, scale, scale);
};


// **************************************************************************
//        THE FOOD OBJECT
// **************************************************************************

function Food () {
  // What properties should the food have??

  // How can you generate random coordinates for it
  // that still line up on the game's grid?

  // Hint: it will involve Math.random somehow!
  // Google it! :)

  this.x = Math.floor(Math.random() * (width - 0)) + 0;
  this.y = Math.floor(Math.random() * (height - 0)) + 0;

  x *= scale;
  y *= scale;


}

// This method draws a green square for the food using its coordinates
Food.prototype.draw = function() {
  // Draw the food the same way we draw the snake!
  // But maybe make it green instead of black?

  pen.fillStyle = "green";
  pen.fillRect(this.x, this.y, scale, scale);

};


// **************************************************************************
//        FUNCTIONS FOR RUNNING THE GAME
// **************************************************************************

// This function updates the game state and draws a single animation frame
function updateGame() {
  // Update the snake and save the result of its latest action
  var action = snake.updatePosition();

  // If the snake returned "die", game over!
  if (action === "die") {
    gameOver();
    return; // this stops the updateGame() function so the rest of its code won't run
  }

  // Otherwise, the snake is still alive! So...
  console.log(action);
  // If it successfully ate the food, update the food!
  if (action === "eat") {
    food = new Food();
    console.log("***** ATE THE FOOD!******");
  }

  // Draw the snake and the food for each animation frame (again, only if the snake isn't dead!)
  snake.draw();
  food.draw();
}

// Ends the animation loop and shows "Game Over!" text on the canvas
function gameOver() {
  pen.fillStyle = "red";
  pen.font = '80px sans-serif';
  pen.fillText('Game Over!', 180, 280);
  cancelAnimationFrame(animationFrameId);
}

// This is the function that runs on every "keyup" event to update the snake's direction
// using the UP / DOWN / LEFT / RIGHT arrow keys
function handleKeyUp(event) {
  if (event.keyCode === 38) {
    // set direction to UP
    snake.updateDirection(0,-1);
  } else if (event.keyCode === 40) {
    // set direction to DOWN
    snake.updateDirection(0,1);
  } else if (event.keyCode === 37) {
    // set direction to LEFT
    snake.updateDirection(-1,0);
  } else if (event.keyCode === 39) {
    // set direction to RIGHT
    snake.updateDirection(1,0);
  }
    // REFERENCE FOR DIRECTIONS:
    // UP:    xDirection:  0, yDirection: -1
    // DOWN:  xDirection:  0, yDirection:  1
    // LEFT:  xDirection: -1, yDirection:  0
    // RIGHT: xDirection:  1, yDirection:  0
}

// Animation loop: this function runs forever (until we stop it) to animate our canvas drawing!
function animate(currentTimestamp) {

  // Repeat the loop WITHOUT animating if it hasn't been long enough yet.
  if (currentTimestamp < nextFrameTimestamp) {
    requestAnimationFrame(animate);
    return; // this ends the function, preventing the code below from running when it shouldn't
  }

  // If it HAS been long enough, update the time for the next animation frame and then animate stuff!
  nextFrameTimestamp = currentTimestamp + millisecondsBetweenFrames;

  // Clear the whole canvas between each animation frame
  pen.clearRect(0, 0, 2000, 2000);

  // Update the game state, drawing everything for the current animation frame as needed
  updateGame();

  // Repeat the animation loop forever (until we stop it)
  requestAnimationFrame(animate);
}
