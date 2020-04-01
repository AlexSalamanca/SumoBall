//Declare variables for the canvas
let canvas;
let button;
const maxCanvasWidth = 800;
const maxCanvasHeight = 800;
let ctx;
//Declare variables for the players and platform
let speed = 0;
let mass = 10;
let players = new Array();
let player1;

let platformObj;

let winner = false;
//Declare variables for the audio when the ball bounce off of each other
let audio = new Audio("Sounds/bounce.wav");
let mute = false;
//Declare variable for the replay of the game
let replay = false;
//Function that start the game creating the canvas, context, players and platform and start the animation
function startGame(){
  if(replay){
    location.reload();
    replay = false;
  }
  button = document.getElementById('startButton');
  let canvasCreation = document.getElementById("canvasCall");
  canvasCreation.innerHTML = "<canvas id='canvas' width=800 height=800wd style='border: 3px solid black;'></canvas>";
  canvas = document.getElementById('canvas');
  canvas.style.backgroundColor = "#CF1020"
  ctx = canvas.getContext("2d");
  platformObj = new Platform(maxCanvasWidth / 2, maxCanvasHeight / 2, maxCanvasWidth / 3, "black");
  players.push(player1 = new Player(maxCanvasWidth / 4, maxCanvasHeight / 2, 50, "red", speed, mass, true, "red"));
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 4, 50, "yellow", speed, mass, false, "yellow"));
  players.push(new Player(maxCanvasWidth / 1.3, maxCanvasHeight / 2, 50, "green", speed, mass, false, "green"));
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 1.3, 50, "blue", speed, mass, false, "blue"));
  animate();
}
//Animate the game drawing players and pltform all the time, it also check for the winner
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(!winner){
    platformObj.draw();
    player1.newPosition();
    for(let i = 0; i < players.length; i++){
      players[i].update(players);
    }
  }
  checkWinner();
}
//Player object that declares all the attribute of each player
function Player(x, y, radius, color, speed, mass, player, name){
  this.x = x;
  this.y = y;
  //This angle is for moving the player
  this.angle = 0;
  this.rotationAngle = 0;
  this.speed = speed;
  //the velocity is for when the players bounce off of each other
  this.velocity = {
    x: Math.random() - 0.5,
    y: Math.random() - 0.5
  };
  //speed modifyer so all the players move at the same speed
  this.speedModifyer = 0.7;
  //Check if this player is a person or an AI
  this.player = player;
  //The mass is for the bouncing, if the player don't have a mass it dissapears when it collides
  this.mass = mass;
  this.radius = radius;
  this.color = color;
  this.name = name;
  //Check if this player has been pushed recently or if the player already lost
  this.isPush = false;
  this.lost = false;
  //Function that update the players each frame
  this.update = players => {
    this.draw();
    //check if the players collide
    for(let i = 0; i < players.length; i++){
      if(this === players[i]) continue;
      if(getDistance(this.x, this.y, players[i].x, players[i].y) - this.radius * 2 <= 0){
        push(this, players[i]);
        if(!mute) audio.play();
      }
    }
    //move the enemies
    if(!this.isPush && !this.player && players.length > 1) {
      let enemy = this.findEnemy();
      this.angle = getAngle(enemy.x, enemy.y, this.x, this.y);
      this.x += (Math.cos(this.angle) + this.speed) * this.speedModifyer;
      this.y += (Math.sin(this.angle) + this.speed) * this.speedModifyer;
    }
    else if(this.isPush && players.length > 1){
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
    //Does not allow  the players to leave the canvas
    if(this.x - this.radius <= 0 || this.x + this.radius >= maxCanvasWidth){
      this.velocity.x = -this.velocity.x;
    }
    if(this.y - this.radius <= 0 || this.y + this.radius >= maxCanvasHeight){
      this.velocity.y = -this.velocity.y;
    }
  };
  //Draw the players
  this.draw = function(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.restore();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };
  //Find the nearest enemy and return it
  this.findEnemy = function(){
    let enemies = new Array();
    let minDistance = Infinity;
    let nearestEnemy = 1;

    for(let i = 0; i < players.length; i++){
      if(this === players[i]) continue;
      enemies.push([i, getDistance(this.x, this.y, players[i].x, players[i].y)]);
    }

    for(let i = 0; i < enemies.length; i++){
      if(enemies[i][1] < minDistance) {
        minDistance = enemies[i][1];
        nearestEnemy = enemies[i][0];
      }
    }

    return players[nearestEnemy];
  }
  //Update the position of the person player each frame
  this.newPosition = function(){
    this.angle += this.rotationAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }
}
//Create the object of the platform and draws it
function Platform(x, y, radius, color){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity ={
    x: 0,
    y: 0
  };
  this.mass = 10;
  this.draw = function(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
//Check if the players left the platform and eliminate then from the players array,
//when there is only one player left display a winner message
function checkWinner(){
  for(let i = 0; i < players.length; i++){
    if(!players[i].lost){
      if(getDistance(platformObj.x, platformObj.y, players[i].x, players[i].y) > platformObj.radius){
        players[i].velocity.x = 0;
        players[i].velocity.y = 0;

        players[i].lost = true;
        let elimination = setInterval(function () {
          players[i].radius -= 10;
          if(players[i].radius <= 1){
            players.splice(i, 1);
            clearInterval(elimination);
          }
        }, 500);
      }
    }
  }
  if(players.length <= 1){
    winner = true;
    canvas.style.backgroundColor = players[0].color;
    platformObj.color = players[0].color;
    ctx.fillStyle = "#337CA0";
    ctx.font = "50px Arial";
    ctx.fillText(" The winner is " + players[0].name, 150, 400);
  }
  replay = true;
}
//Mute or unmute the sounds in the game RECOMMENDED ON
function toogleMute(){
  if(!mute){
    mute = true;
  }
  else{
    mute = false;
  }
}

// TODO: Improve AI and player movement
// TODO: Improve bouncing
