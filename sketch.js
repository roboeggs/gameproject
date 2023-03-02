class Gamer {
  constructor(gamer, position, step = 5){
      this._score = 0;
      this._lifePos = position;
      this._falling = 3;
      this._gamerStart = gamer;
      this._gamer = Object.assign({}, this._gamerStart);
      this._step = step;
      this._isLeft = false;
      this._isRight = false;
      this._isFalling = false;
      this._isPlummeting = false;
      this.isMoving = true;
  }
  resetAll(){
    this.resetParam();
    this._gamer.life = this._gamerStart.life;
  }
  resetParam(){
    this._score = 0;
    this.isMoving = true;
    this._gamer.x = this._gamerStart.x;
    this._gamer.y = this._gamerStart.y;
  }
  getGamer(){return this._gamer;}
  getScope(){return this._score;}
  keySwitch(keyCode, bolSwitch){
    switch(keyCode){
      case 37:
        this._isLeft = !this._isLeft;
        break;
      case 39:
        this._isRight = !this._isRight;
        break;
    }
    if(keyCode == 32 || keyCode == 87 || keyCode == 38){
      this._isFalling = bolSwitch;
      // this._isPlummeting = false;
      this._gamer.isFalling = this._isFalling;
    }
  }
  removeLife(){
    this._gamer.life--;
  }
  addScore(){
    this._score++;
  }
  isPlummeting(){
    this._gamer.y += this._falling;
    this._isPlummeting = true;
  }
  _platform(platform){
    for(let obj of platform){
      if(obj.check(this._gamer)){
        return obj;
      }
    }
    return false;
  }
  _flight(x){
    if(this._isPlummeting && this._gamer.y <= x){
      this._gamer.y += this._falling;
      
    }
    else{
      this._isPlummeting = false;
    }
  }

  isDo(platform){
    if(this._gamer.y <= this._gamerStart.y + 3 && this.isMoving){
      if(this._isLeft){
        this._gamer.x -= this._step;
      }
  
      if(this._isRight){
        this._gamer.x += this._step;
      }
      const obj = this._platform(platform);
      if(this._isFalling){
        if(!this._isPlummeting){
            this._gamer.y -= 100;        
            soundJump.play();
        }
        this._isFalling = !this._isFalling;
      }
      this._isPlummeting = true;
      if(obj && !(this._gamer.y < ground && this._gamer.y - 3 > obj.y)){
        this._flight(obj.y);
      }else{
        this._flight(this._gamerStart.y)
      }

    }
  }
  drawGamer(){
    const offset = {
      x: [0, 0],
      y: 10,
      side: false
    };
    

    if(this._isLeft && this._isFalling){
      offset.x[0] = 5;
      offset.x[1] = 15;
      offset.y = 13;
    }
    else if(this._isRight && this._isFalling){
      offset.x[1] = 10;
      offset.y = 13;
      offset.side = true;
    }
    else if(this._isLeft){
      offset.x[0] = 5;
      offset.x[1] = 15;
      offset.side = true;
    }
    else if(this._isRight){
      offset.x[1] = 10;
      offset.side = true;
    }
    else if(this._isFalling || this._isPlummeting){
      offset.x[1] = 15;
      offset.y = 13;
    }
    else{
      offset.x[1] = 15;
    }
    noStroke();
    // header
    fill(255, 140, 0);
    circle(this._gamer.x + 25 / 2, this._gamer.y - 65, 25);

    // body
    fill(199, 0, 255);
    
    ellipse(this._gamer.x + 25 / 2, this._gamer.y - 30, 30, 50);
    if(offset.side){
      strokeWeight(1);
      stroke(0);
      rect((this._gamer.x + 25 / 2) - 2, this._gamer.y - 50, 4, 30);
      noStroke();
    }
    
    // legs
    fill(127, 102, 3);
    rect(this._gamer.x + offset.x[0], this._gamer.y - offset.y, 10, 10);
    rect(this._gamer.x + offset.x[1], this._gamer.y - offset.y, 10, 10);
    
  }
  drawLife(){
    fill(255);
    textSize(16);
    text('Lifes: ' + this._gamer.life, 20, 20);
    text('Score: ' + this._score, 20, 35);
    
    fill(185, 38, 19);
    for(let i = 0; i < this._gamer.life; i++){
      circle(this._lifePos.x + i * 40, this._lifePos.y, 20);
      circle(this._lifePos.x + 13  + i * 40, this._lifePos.y, 20);
      triangle(this._lifePos.x - 8  + i * 40, this._lifePos.y + 6, this._lifePos.x + 21  + i * 40, this._lifePos.y + 6, this._lifePos.x + 7 + i * 40, this._lifePos.y + 20);
    }
}
};

function Canyon(x, y){
  this.x = x;
  this.y = y;
  this.drawCanyon = () => {
    stroke(0, 157, 255);
    fill(0, 157, 255);
    rect(this.x, this.y - 100, 100, 100);
    fill(51, 36, 23);
    noStroke();
    rect(this.x, this.y - 20, 100, 20);
    
  }
  this.check = (gamer) => {
    if((this.x < gamer.getGamer().x && this.x + 100 - 25> gamer.getGamer().x) && gamer.getGamer().y >= ground){
      gamer.isPlummeting(); 
    }
  }
}

function Flagpole(x, y){
  this.x = x;
  this.y = y;
  this.isReached = false;
  this.renderFlagpole = () => {
    push();
    strokeWeight(5);
    stroke(158,107,14);
    line(this.x,  this.y, this.x,  this.y - 150);
    noStroke();
    fill(170, 59,42);
    if(this.isReached){
      triangle(this.x,  this.y - 150, this.x,  this.y - 100, this.x + 50,  this.y -125);
    }else
    {
      triangle(this.x,  this.y - 50, this.x,  this.y, this.x + 50,  this.y - 25);
    }
    pop();
  }
  this.status = (gamer) => {
    if(this.isReached){
      fill(255);
      textSize(32);
      textAlign(CENTER);
      text('Level complete. Press space to continue.', frameWidth / 2, frameHeight /2);
      restartGame();
    }else
    {
      this.check(gamer);
    }
  }
  
  this.check = (gamer) => {
    if(distance(gamer.getGamer().x, this.x) < 12 && gamer.getScope() == collectable.length){
      this.isReached = true;
    }
  }
}

function Collectable(x, y){
  this.x = x;
  this.y = y;
  this.isFound = false;
  this.drawCollectable = () => {
    fill(206, 107, 107);
    rect( this.x, this.y - 30, 30, 30);
    fill(153, 79, 130);
    triangle( this.x + 15, this.y - 33,  this.x, this.y - 48,  this.x + 30, this.y - 48);
    triangle( this.x + 15, this.y - 48,  this.x, this.y - 33,  this.x + 30, this.y - 33);
  }
  this.check = (gamer) => {
      if(!this.isFound){
        if(dist(gamer.getGamer().x, gamer.getGamer().y, this.x, this.y) < 30 && !this.isFound){
          this.isFound = true;
          gamer.addScore();
          soundGift.play();
        }
        this.drawCollectable(this.x);
      }
  }
}

function Platworm(x, y, width){
  this.x = x;
  this.y = y;
  this.width = width;
  this.drawPlatworm = () => {
    fill(88, 99, 107);
    for(let i = 0; i < this.width; i++){
      stroke(255);
      strokeWeight(1);
      rect( this.x + i * 20, this.y, 20, 10 );
    }
  }
  this.check = (gamer) => {
    if((this.x - 30 < gamer.x && this.x + this.width * 20> gamer.x)){
      return true;
    }
    return false;
  }
}

function Enemie(x, width, y){
  this.x = x;
  this.y = y;
  this.width = width;
  this._widthNow = width;
  this._xStart = x;
  // this.isFound = false;
  this.incr = 1;
  this.drawEnemie = () => {
    stroke(255, 0, 0 );
    strokeWeight(4);
    if(this._widthNow >= this.width + this.x){
      this.incr *= -1;
      this._xStart = this.x;
    }
    if(this._widthNow <= this.x){
      this.incr *= -1;
      this._xStart = this.x + this.width;
    }
    line(this._xStart, this.y, this._widthNow, this.y);
    noStroke();
    this._widthNow += this.incr;
  }
  this.check = (gamer) => {
    const gamerDist = 5;
    const maxX = max(this._xStart, this._widthNow);
    const minX = min(this._xStart, this._widthNow);
    const regarding = {
      x: 12,
      y: 20
    }
    if(dist(gamer.getGamer().x + regarding.x, gamer.getGamer().y - regarding.y, this._xStart, this.y) < gamerDist || 
      dist(gamer.getGamer().x + regarding.x, gamer.getGamer().y - regarding.y, this._widthNow, this.y) < gamerDist ||
      minX < gamer.getGamer().x && maxX > gamer.getGamer().x && distance(gamer.getGamer().y, this.y) < 5
      ){
      
      return true;
    }
    return false;
  }
}

let frameWidth = 750;
let frameHeight = 500;
let ground = frameHeight - 100;

let cameraPosX = 0;

const clouds = {
  x: [-300, -250, -150, -100, 100, 150, 489, 596, 400, 1030, 800, 1500, 1379, 2000, 1700, 1850, 1430], 
  y: [200,140,100, 135,100, 125, 103, 90, 50, 30, 110, 150, 130, 200, 115, 70, 40], 
  size: [15, 50, 40 ,20, 50, 30, 45, 60, 15, 58, 47, 70, 20, 30, 70, 60, 65]
};

const mountains = {
  x: [90, 150, 565, 650, 1900, 2050],
  size: [0.5, 1, 1.1, 0.8, 0.6, 1.5]
};

const enemiesPar = {
  x: [0, -100, 505],
  width: [150, -200, 600]
}

const treesArray = [-150, 0, 180, 560, 600, 1000, 1500];

const platforms = {
  x: [0, 170, 500, 1000, 1500],
  y: ground - 100,
  count: [3, 5, 2, 4, 7],
};


// let platformsY = ground - 100;

let collectable = [80, -20, 500, 1050].map((index) => { return new Collectable(index, ground) });
platforms.x.map((currentValue, index) => {
  collectable.push(new Collectable((platforms.count[index] * 20 / 2) + currentValue - 15, platforms.y));

});
let canyon = [350, 750, 1100, 1700].map((index) => {return new Canyon(index, frameHeight)});


const gamerPeople = new Gamer({ x: frameWidth / 2 - 100, y: ground, life: 3 }, {x: 30, y: 50});
const flag = new Flagpole(2000, ground);

let soundJump;
let soundGift;
let platObj = [];
let enemies = [];

function preload() {
  soundFormats('mp3', 'wav');
  soundJump = loadSound('assets/jump.mp3');
  soundJump.setVolume(1);

  soundGift = loadSound('assets/receive.mp3');
  soundGift.setVolume(0.6);
}

function setup(){
	createCanvas(frameWidth, frameHeight);
  for(let i = 0; i < platforms.x.length; i++){
    platObj.push(new Platworm(platforms.x[i], platforms.y, platforms.count[i]));
  }
  for(let i = 0; i < enemiesPar.x.length; i++){
    enemies.push(new Enemie(enemiesPar.x[i], enemiesPar.width[i], ground - 20));
    console.log(enemiesPar.x[i], enemiesPar.width[i], ground - 20);
  }
  startGame(gamerPeople);
}

function draw()
{
  cameraPosX = constrain(gamerPeople.getGamer().x -width/2, -width/2, width*2);

  // landscape
	background(0, 157, 255);
  fill(255, 233, 0);
  strokeWeight(1);
  stroke(51);
  circle(frameWidth - 100, 100, 60);
  fill(0, 137, 18);
  stroke(0, 175, 0);
  rect(0, frameHeight - 100, frameWidth, 100);
  noStroke();

  gamerPeople.drawLife();

  flag.status(gamerPeople);

  push();
  translate(-cameraPosX, 0);

  

  if(gamerPeople.getGamer().life < 1){
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text('Game over. Press space to continue.', frameWidth / 2, frameHeight /2);
    gamerPeople.isMoving = false;
    restartGame();
  }
  
  drawClouds();

  drawMountains();

  checkPlayersDie(gamerPeople);

 
  flag.renderFlagpole();

  treesArray.forEach(index => drawTrees(index, ground));

  collectable.forEach(element => element.check(gamerPeople));

  canyon.forEach(element => element.drawCanyon(gamerPeople));

  platObj.forEach(element => element.drawPlatworm());

  enemies.forEach(element => {
    element.drawEnemie();
    if(element.check(gamerPeople)){
      delLife(gamerPeople);
    }
  });
  // if(enemies.check(gamerPeople)){delLife(gamerPeople);}

  gamerPeople.drawGamer();

  pop();
  
  canyon.forEach(element => element.check(gamerPeople));

  gamerPeople.isDo(platObj);
}


function keyPressed(){
  gamerPeople.keySwitch(keyCode, true);
}

function keyReleased(){
  gamerPeople.keySwitch(keyCode, false);
}

function drawClouds(){
  fill(255, 255, 255);
  for(let i = 0; i < clouds.x.length; i++){
    let radCir = clouds.size[i];
    for(let j = 1; j < 4; j++){
      radCir /= j;
      circle(clouds.x[i] - radCir, clouds.y[i], radCir);
    }
  }
}

function drawMountains(){
  fill(168, 177, 181);
  for(let i = 0; i < mountains.x.length; i++){
    triangle(mountains.x[i],
      ground - 150 * mountains.size[i], mountains.x[i]  - 100  * mountains.size[i], 
      ground, mountains.x[i] + 100  * mountains.size[i], ground);
  }
}

function drawTrees(treesX, treesY){
    fill(155, 80, 0);
    rect(treesX, treesY - 40, 30, 40);
    fill(0, 63, 22);
    triangle(treesX + 15, treesY - 100, treesX - 50, treesY - 40, treesX + 80, treesY - 40);
    triangle(treesX + 15, treesY - 130, treesX - 40, treesY - 40, treesX + 70, treesY - 40);
    triangle(treesX + 15, treesY - 150, treesX - 40, treesY - 80, treesX + 70, treesY - 80);
    triangle(treesX + 15, treesY - 200, treesX - 20, treesY - 80, treesX + 50, treesY - 80);
    fill(221, 24, 24);
    circle(treesX + 15, treesY - 205, 15, 15);
}

function checkPlayersDie(gamer){
  if(gamer.getGamer().y > frameHeight){
    delLife(gamer);
  }
}

function delLife(gamer){
  
  if(gamer.getGamer().life > 0){
    gamer.removeLife();
    startGame(gamer);
  }
}

function startGame(gamer){
  collectable.forEach(element => element.isFound = false);
  gamer.resetParam();
  flag.isReached = false;
}

function restartGame(){
  if(gamerPeople.getGamer().isFalling){
    gamerPeople.resetAll();
    startGame(gamerPeople);
  }
}

function distance(a, b){
  return Math.abs(a - b);
}