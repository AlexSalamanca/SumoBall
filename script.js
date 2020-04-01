let canvas;
let button;
const maxCanvasWidth = 800;
const maxCanvasHeight = 800;
let ctx;

let speed = 0;
let mass = 10;
let players = new Array();
let player1;

let platformObj;
let winner = false;

function startGame(){
  button = document.getElementById('startButton');
  let canvasCreation = document.getElementById("canvasCall");
  button.style.visibility = "hidden";
  canvasCreation.innerHTML = "<canvas id='canvas' width=800 height=800wd style='border: 3px solid black;'></canvas>";
  canvas = document.getElementById('canvas');
  canvas.style.marginLeft = "200px";
  ctx = canvas.getContext("2d");
  while(players.length > 0){
    players.splice(0, 1);
  }
  platformObj = new Platform(maxCanvasWidth / 2, maxCanvasHeight / 2, maxCanvasWidth / 3, "black");
  players.push(player1 = new Player(maxCanvasWidth / 4, maxCanvasHeight / 2, 50, "red", speed, mass, true, "red"));
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 4, 50, "yellow", speed, mass, false, "yellow"));
  players.push(new Player(maxCanvasWidth / 1.3, maxCanvasHeight / 2, 50, "green", speed, mass, false, "green"));
  players.push(new Player(maxCanvasWidth / 2, maxCanvasHeight / 1.3, 50, "blue", speed, mass, false, "blue"));
  animate();
}

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

function Player(x, y, radius, color, speed, mass, player, name){
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.rotationAngle = 0;
  this.speed = speed;
  this.velocity = {
    x: Math.random() - 0.5,
    y: Math.random() - 0.5
  };
  this.speedModifyer = 0.5;
  this.player = player;

  this.mass = mass;
  this.radius = radius;
  this.color = color;
  this.name = name;
  this.isPush = false;
  this.lost = false;

  this.update = players => {
    this.draw();
    for(let i = 0; i < players.length; i++){
      if(this === players[i]) continue;

      if(getDistance(this.x, this.y, players[i].x, players[i].y) - this.radius * 2 <= 0){
        push(this, players[i]);
      }
    }

    if(!this.isPush && !this.player) {
      let enemy = this.findEnemy();
      this.angle = getAngle(enemy.x, enemy.y, this.x, this.y);
      this.x += (Math.cos(this.angle) + this.speed) * this.speedModifyer;
      this.y += (Math.sin(this.angle) + this.speed) * this.speedModifyer;
    }
    else if(this.isPush){
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }

    if(this.x - this.radius <= 0 || this.x + this.radius >= maxCanvasWidth){
      this.velocity.x = -this.velocity.x;
    }
    if(this.y - this.radius <= 0 || this.y + this.radius >= maxCanvasHeight){
      this.velocity.y = -this.velocity.y;
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

  this.newPosition = function(){
    this.angle += this.rotationAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }
}

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

function checkWinner(){
  for(let i = 0; i < players.length; i++){
    if(!players[i].lost){
      if(getDistance(platformObj.x, platformObj.y, players[i].x, players[i].y) > platformObj.radius){
        players[i].isPush = true;
        players[i].lost = true;
        let elimination = setInterval(function () {
          players[i].radius -= 10;
          if(players[i].radius <= 1){
            clearInterval(elimination);
            players.splice(i, 1);
          }
        }, 500);
      }
    }
  }
  if(players.length == 1){
    winner = true;
    button.style.visibility = "visible"
    canvas.style.backgroundColor = players[0].color;
    platformObj.color = players[0].color;
    ctx.fillStyle = "#337CA0";
    ctx.font = "50px Arial";
    ctx.fillText(" The winner is " + players[0].name, 75, 300);
  }
}
