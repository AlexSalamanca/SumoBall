let canvas
const maxCanvasWidth = 600;
const maxCanvasHeight = 600;
let ctx;

let speed = 1;
let mass = 10;
let playerOne;
let playerTwo;
let players = new Array();
let platform;

let up = false;
let down = false;
let right = false;
let left = false;

//let accelerationTimer = setInterval(acceleration, 1000);

let startTime = new Date();

addEventListener("keydown", function(event){
  if(event.keyCode == 87){
    acceleration();
    up = true;
  }
  if(event.keyCode == 83){
    down = true;
  }
  if(event.keyCode == 65){
    left = true;
  }
  if(event.keyCode == 68){
    right = true;
  }
});

addEventListener("keyup", function(event){
  if(event.keyCode = 87){
    up = false;
  }
  if(event.keyCode = 83){
    down = false;
  }
  if(event.keyCode = 65){
    left = false;
  }
  if(event.keyCode = 68){
    right = false;
  }
});


function startGame(){
  let button = document.getElementById('startButton');
  let canvasCreation = document.getElementById("canvasCall");
  button.remove();
  canvasCreation.innerHTML = "<canvas id='canvas' width='600' height='600' style='border: 3px solid black;'></canvas>";
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext("2d");
  platform = new Platform(maxCanvasWidth / 2, maxCanvasHeight / 2, 250, "black");
  players.push(new Player(maxCanvasWidth / 4, maxCanvasHeight / 2, 50, "red", speed, mass, true));
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 4, 50, "yellow", speed, mass, false));
  players.push(new Player(maxCanvasWidth / 1.3, maxCanvasHeight / 2, 50, "green", speed, mass, false));
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 1.3, 50, "blue", speed, mass, false));
}

function movement(){
   if(up){
     players[0].y -= speed;
   }
   if(down){
     players[0].y += acceleration();
   }
   if(left){
     players[0].x -= acceleration();
   }
   if(right){
     players[0].x += acceleration();
   }
 }

 function acceleration(){
   if(speed <= 10) return speed++;
   else return speed;
 }

function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  platform.update();
  for(let i = 0; i < players.length; i++){
    players[i].update(players);
  }
  movement();
}

function getTime(){
  return (new Date() - startTime) / 1000;
}

function Player(x, y, radius, color, speed, mass, player){
  this.x = x;
  this.y = y;
  if(player){
    this.velocity = {
      x: speed / getTime(),
      y: speed / getTime()
    };
  }
  else{
    this.velocity = {
      x: Math.random() - 0.5,
      y: Math.random() - 0.5
    };
  }
  this.speed = speed;
  this.mass = mass;
  this.radius = radius;
  this.color = color;
  this.update = players => {
    this.draw();

    for(let i = 0; i < players.length; i++){
      if(this === players[i]) continue;
      if(getDistance(this.x, this.y, players[i].x, players[i].y) - this.radius * 2 < 0){
        push(this, players[i]);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
      }
      if(!player){
        this.x += this.velocity.x;
        this.y += this.velocity.y;
      }
    }
  };
  this.draw = function(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };
}

function Platform(x, y, radius, color){
  this.update = function(){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

//Collision detection

//Detects when two objects collide using the Pythagorean Theorem
function getDistance(x1, y1, x2, y2){
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

/*
  Elastic Collision:  https://en.wikipedia.org/wiki/Elastic_collision
  Used to check the angle in which two objects collide in a single dimension.
*/

//Function that rotates the objects so the velocity is in a single dimension
function rotateVelocity(velocity, angle){
  const rotatedVelocity  = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocity;
}

//Swap the velocity of the 2 objects colliding and runs through the Elastic Collision equation
function push(player, collidedPlayer) {
  const xVelocityDifference = player.velocity.x - collidedPlayer.velocity.x;
  const yVelocityDifference = player.velocity.y - collidedPlayer.velocity.y;

  const xDistance = collidedPlayer.x - player.x;
  const yDistance = collidedPlayer.y - player.y;

  //Prevent overlapping of the players
  if(xVelocityDifference * xDistance + yVelocityDifference * yDistance >= 0){
    //Get the arcotangent between two points
    const angle = -Math.atan2(collidedPlayer.y - player.y, collidedPlayer.x - player.x);

    //Store the mass of the players
    const playerMass = player.mass;
    const collidedPlayerMass = collidedPlayer.mass;

    //Gets the velocity before it gets through the equation
    const playerVelocity = rotateVelocity(player.velocity, angle);
    const collidedPlayerVelocity = rotateVelocity(collidedPlayer.velocity, angle);

    //Equation to get the 1 dimension velocity of the players
    const player1DVelocity = {
      x: playerVelocity.x * (playerMass - collidedPlayerMass) / (playerMass + collidedPlayerMass) + collidedPlayerVelocity.x * 2 * collidedPlayerMass / (playerMass + collidedPlayerMass),
      y: playerVelocity.y
    };


    const collidedPlayer1DVelocity = {
      x: collidedPlayerVelocity.x * (playerMass - collidedPlayerMass) / (playerMass + collidedPlayerMass) + playerVelocity.x * 2 * collidedPlayerMass / (playerMass + collidedPlayerMass),
      y: collidedPlayerVelocity.y
    };


    const finalPlayerVelocity = rotateVelocity(player1DVelocity, -angle);
    const finalCollidedPlayerVelocity = rotateVelocity(collidedPlayer1DVelocity, -angle);

    //Swap the players velocity for bounce effect
    player.velocity.x = finalPlayerVelocity.x;
    player.velocity.y = finalPlayerVelocity.y;

    collidedPlayer.velocity.x = finalCollidedPlayerVelocity.x;
    collidedPlayer.velocity.y = finalCollidedPlayerVelocity.y;
  }
}


animate();
