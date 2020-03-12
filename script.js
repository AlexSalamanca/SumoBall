let canvas
const maxCanvasWidth = 600;
const maxCanvasHeight = 600;
let ctx;

let speed = 0;
let mass = 10;
let players = new Array();
<<<<<<< HEAD
let platform;

=======
let player1;
>>>>>>> 44f231f2e66c28f2a740477aa93517f3f22cea47
let up = false;
let down = false;
let right = false;
let left = false;

//let accelerationTimer = setInterval(acceleration, 1000);




function startGame(){
  let button = document.getElementById('startButton');
  let canvasCreation = document.getElementById("canvasCall");
  button.remove();
  canvasCreation.innerHTML = "<canvas id='canvas' width='600' height='600' style='border: 3px solid black;'></canvas>";
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext("2d");
<<<<<<< HEAD
  platform = new Platform(maxCanvasWidth / 2, maxCanvasHeight / 2, 250, "black");
  players.push(new Player(maxCanvasWidth / 4, maxCanvasHeight / 2, 50, "red", speed, mass, true));
=======
  platform(maxCanvasWidth / 2, maxCanvasHeight / 2, 250, "black");
  players.push(player1 = new Player(maxCanvasWidth / 4, maxCanvasHeight / 2, 50, "red", speed, mass, true));
>>>>>>> 44f231f2e66c28f2a740477aa93517f3f22cea47
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 4, 50, "yellow", speed, mass, false));
  players.push(new Player(maxCanvasWidth / 1.3, maxCanvasHeight / 2, 50, "green", speed, mass, false));
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 1.3, 50, "blue", speed, mass, false));
}

function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
<<<<<<< HEAD
  platform.update();
=======
  platform(maxCanvasWidth / 2, maxCanvasHeight / 2, 250, "black");

>>>>>>> 44f231f2e66c28f2a740477aa93517f3f22cea47
  for(let i = 0; i < players.length; i++){
    players[i].update(players);
  }
  player1.newPosition();
}

function Player(x, y, radius, color, speed, mass, player){
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.rotationAngle = 0;
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
  this.player = player;
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
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }

  };
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

  if(player){
    this.newPosition = function(){
      this.angle += this.rotationAngle * Math.PI / 180;
      this.x += this.speed * Math.sin(this.angle);
      this.y -= this.speed * Math.cos(this.angle);
    }
  }
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

//Program the AI
function artificialIntelligence(players){
  let minDistance = 9999;
  for(let i = 0; i < players.length; i++){
    if(players[i].player) continue;
    if(getDistance(this.x, this.y, players[i].x, players[i].y) - this.radius * 2 < 0){
      push(this, players[i]);
    }
  }
}

animate();
