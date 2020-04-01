//Get difference of time
let startTime = new Date();

function getTime(){
  return (new Date() - startTime) / 1000;
}

//Add listerners for the keydown and keyup events
addEventListener("keydown", function(event){
  if(!player1.isPush){
    if(event.keyCode == 87){
      player1.speed = 1;
    }
    if(event.keyCode == 83){
      player1.speed = -1;
    }
    if(event.keyCode == 65){
      player1.rotationAngle = -1;
    }
    if(event.keyCode == 68){
      player1.rotationAngle = 1;
    }
  }
});

addEventListener("keyup", function(event){
  if(event.keyCode == 87 || event.keyCode == 83) player1.speed = 0;
  if(event.keyCode == 65 || event.keyCode == 68) player1.rotationAngle = 0;
});
//Collision detection

//Get the distance between two points using the Pythagorean Theorem
function getDistance(x1, y1, x2, y2){
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function getAngle(playerX, playerY, otherPlayerX, otherPlayerY){
  return Math.atan2(playerY - otherPlayerY, playerX - otherPlayerX);
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
  
  player.isPush = true;
  collidedPlayer.isPush = true;
  setTimeout(function () {
    player.isPush = false;
    collidedPlayer.isPush = false;
  }, 2000);
}
