var bg,bgImg;
var player, disparadorImg, disparandoImg;
var zombie, zombie1, zombie2, zombie3;
var zombieGroup;

var score = 0 ;
var life = 3;
var bullets = 70;
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var gameState = "fight"
var lose, winning, explosionSound;


function preload(){
  
  disparadorImg = loadImage("assets/corriendo3.png")
  disparandoImg = loadImage("assets/disparando.png")

  zombie1 = loadImage("assets/zombie1.png")
  zombie2 = loadImage("assets/zombie2.png")
  zombie3 = loadImage("assets/zombie3.png")

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  bgImg = loadImage("assets/fondo.webp")

  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 2
  

//creating the player sprite
player = createSprite(displayWidth-2050, displayHeight-300, 50, 50);
 player.addImage(disparadorImg)
   player.scale = 1
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

  //crear sprites para vidas del jugador
  heart1 = createSprite(displayWidth-150, 40, 20, 20);
  heart1.visible = false
  heart1.addImage("heart1",heart1Img)
  heart1.scale = 0.3

  heart2 = createSprite(displayWidth-100, 40, 20, 20);
  heart2.visible = false
  heart2.addImage("heart2",heart2Img)
  heart2.scale = 0.3

  heart3 = createSprite(displayWidth-150, 40, 20, 20);
  heart3.visible = false
  heart3.addImage("heart3",heart3Img)
  heart3.scale = 0.3

//crendo grupo para los zombies y balas
bulletGroup = new Group()
zombieGroup= new Group()
}

function draw() {
  background(0); 

  if(gameState === "fight"){
 //mostrar imagen de las vidas
 if(life === 3){
  heart3.visible = true
  heart2.visible = false
  heart1.visible = false
 }

 if(life === 2){
  heart3.visible = false
  heart2.visible = true
  heart1.visible = false
 }

 if(life === 1){
  heart3.visible = false
  heart2.visible = false
  heart1.visible = true
 }

 if(life===0){
  gameState = "lost"
 }
  
 if(score === 100){
  gameState = "won"
  winning.play();
 }




  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  
  bullet = createSprite(displayWidth-2050, player.y-40, 20, 10);
  bullet.velocityX = 240
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth + 2
  player.addImage(disparandoImg)
  bullets = bullets - 1
  explosionSound.play();
 
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(disparadorImg)
}

//ir al estado de juego bullet cuando el jugador se queda sin balas
if (bullets === 0){
  gameState = "bullet"
  lose.play();
}

//destruye al zombie cuando la bala lo toca e incrementa la puntuación
if(zombieGroup.isTouching(bulletGroup)){
  for(var i = 0; i < zombieGroup.length; i++){
    if(zombieGroup[i].isTouching(bulletGroup)){
      zombieGroup[i].destroy()
      bulletGroup.destroyEach()
      explosionSound.play();
      score = score + 2
    }
  }
}

//reducir vida y destruir el zombie cuando toca al jugador
if(zombieGroup.isTouching(player)){
  lose.play();
  for(var i = 0; i < zombieGroup.length; i++){
    if(zombieGroup[i].isTouching(player)){
      zombieGroup[i].destroy()
      life=life-1
    }
  }
}


enemy();
  }
drawSprites();

//mostrar puntuacion balas y vidas restantes
textSize(20)
fill("white")
text("Balas = " + bullets, displayWidth-200, displayHeight/2-350)
text("Puntuación = " + score, displayWidth-200, displayHeight/2-320)
text("Vidas = " + life, displayWidth-200, displayHeight/2-380)

//destruir zombie y al jugador, lost
if(gameState === "lost"){
  textSize(100)
  fill("black")
  text("Perdiste:(", displayWidth/2, displayHeight/2)
  zombieGroup.destroyEach();
  player.destroy();
}
else if(gameState === "won"){
  textSize(100)
  fill("yellow")
  text("Ganaste!!", displayWidth/2, displayHeight/2)
  zombieGroup.destroyEach();
  player.destroy();
}
else if(gameState === "bullet"){
  textSize(50)
  fill("yellow")
  text("Te quedaste sin balas", displayWidth/2, displayHeight/2)
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();
}
}
//funcion para crear zombies
function enemy(){
  
  if(frameCount%50 === 0){
    zombie = createSprite(random(2000,2100),random(100,1030), 40, 40)
    var rand = Math.round(random(1, 3));

    switch(rand){
      case 1: zombie.addImage(zombie1);
            break;
      case 2: zombie.addImage(zombie2);
            break;
      case 3: zombie.addImage(zombie3);
            break;
    }
    zombie.scale = 0.5
    zombie.velocityX = -6
    zombie.debug=true
    zombie.setCollider("rectangle", 0,0,400,400)
    zombie.lifeTime = 400
    zombieGroup.add(zombie)
  }
}