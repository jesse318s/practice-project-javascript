var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 20;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 20;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 70;
var brickHeight = 10;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var ballColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Change the color of the ball to a random color every time it hits the wall
var bricksDestroyed = 0; // Make the paddle smaller after destroying 7 bricks
var paddleBounceMultiplier = 1; // Make the ball move faster when it hits the paddle
var lifeUpCount = 0; // Change the number of lives every 50 points

dx += lives / 3; // Change the speed of the moving ball as the game progresses
dy -= lives / 3; // Change the speed of the moving ball as the game progresses

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    // Change the number of bricks in a row or a column
    if (!(c === 2 && r === 4)) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.code == "ArrowRight") {
    rightPressed = true;
  } else if (e.code == "ArrowLeft") {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.code == "ArrowRight") {
    rightPressed = false;
  } else if (e.code == "ArrowLeft") {
    leftPressed = false;
  }
}
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  // Adjust the boundaries of the paddle movement
  if (relativeX > paddleWidth && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth;
  }
}
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      // Change the number of bricks in a row or a column
      if (!(c === 2 && r === 4)) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            ballColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Change the color of the ball when it hits the brick
            dy = -dy;
            b.status = 0;
            score++;
            // Make the paddle smaller after destroying 7 bricks
            bricksDestroyed++;
            if (bricksDestroyed === 7) {
              paddleWidth /= 2;
              paddleHeight /= 2;
            }
            // Add more points per brick hit the higher the row
            score += 15 - b.y / 10;
            if (score === 156) {
              alert("YOU WIN, CONGRATS!\nYOUR SCORE: " + score); // Print out the number of collected points in the end
              document.location.reload();
            }
            // Change the number of lives every 50 points
            if (score >= 50 && lifeUpCount === 0) {
              lives++;
              lifeUpCount++;
            }
            if (score >= 100 && lifeUpCount === 1) {
              lives++;
              lifeUpCount++;
            }
          }
        }
      }
    }
  }
  // Change the speed of the moving ball as the game progresses
  if (dx > 0) {
    dx = 2;
    dx += lives / 3;
    dx *= paddleBounceMultiplier; // Make the ball move faster when it hits the paddle
  } else {
    dx = -2;
    dx -= lives / 3;
    dx *= paddleBounceMultiplier; // Make the ball move faster when it hits the paddle
  }
  if (dy < 0) {
    dy = -2;
    dy -= lives / 3;
    dy *= paddleBounceMultiplier; // Make the ball move faster when it hits the paddle
  } else {
    dy = 2;
    dy += lives / 3;
    dy *= paddleBounceMultiplier; // Make the ball move faster when it hits the paddle
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  // Change the color of the ball to a random color every time it hits the wall
  if (
    x + dx > canvas.width - ballRadius ||
    x + dx < ballRadius ||
    x + dx > canvas.width - ballRadius ||
    x + dx < ballRadius ||
    y + dy < ballRadius ||
    y + dy > canvas.height - ballRadius
  ) {
    if (!(x > paddleX && x < paddleX + paddleWidth)) {
      ballColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
  }
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#d60f19";
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      // Change the number of bricks in a row or a column
      if (!(c === 2 && r === 4)) {
        if (bricks[c][r].status == 1) {
          var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#d60f19";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      // Change the angle the ball bounces off the paddle every 50 points
      if (score >= 50 && score < 100) {
        dx = -dx;
      }
      paddleBounceMultiplier += 0.2; // Make the ball move faster when it hits the paddle
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER\nYOUR SCORE: " + score); // Print out the number of collected points in the end
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        dx += lives / 3; // Change the speed of the moving ball as the game progresses
        dy -= lives / 3; // Change the speed of the moving ball as the game progresses
        paddleBounceMultiplier = 1; // Make the ball move faster when it hits the paddle
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
