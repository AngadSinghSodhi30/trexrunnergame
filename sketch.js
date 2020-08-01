var trex, trex_running , ground, invisibleGround, groundimage, cloudimage, CloudsGroup, ObstaclesGroup,trex_collided
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6
var score
var jump,die,checkpoint

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, restart , gameOverimg, restartimg

function preload() {
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  trex_collided = loadAnimation("trex_collided.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}  

function setup() {
  createCanvas(600,200);
  trex = createSprite(50,180,20,20);
  trex.addAnimation("running",trex_running);
  trex.scale = 0.5;
  
  trex.addAnimation("collided",trex_collided);
  
  ground = createSprite(200,180,400,10);
  ground.addImage(groundimage);
  ground.velocityX = -6;
  ground.x = ground.width/2;
  invisibleGround = createSprite(200,190,400,5);
  invisibleGround.visible = false;
  
  score = 0;
  textSize(18);
textFont("Georgia");
textStyle(BOLD);
  
  CloudsGroup = createGroup();
  ObstaclesGroup = createGroup();
  
gameOver = createSprite(200,300);
restart = createSprite(200,340);
gameOver.addImage(gameOverimg);

gameOver.scale = 0.5;
restart.addImage(restartimg);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

}

function draw() {
  background("white");
  
  text("Score:"+ score, 500,50);
  
  
  if(gameState === PLAY){
  
   score = score+ Math.round(getFrameRate()/60);
    if (score>0 && score%100 === 0){
      checkpoint.play();
    }
  if(keyDown("space") && trex.y>160) {
     trex.velocityY = -10;
     jump.play();
  }
  trex.velocityY = trex.velocityY+0.5;
  if(ground.x<0) {
  ground.x = ground.width/2;
  }
  trex.collide(invisibleGround);
  
  spawnClouds();
  spawnObstacles();
    
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play();
    }
  }
   else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  drawSprites();
}
function reset(){
  gameState = PLAY;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  trex.setAnimation("trex");
  count = 0;
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(400,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
        case 1:obstacle.addImage(obstacle1);
        break;
        case 2:obstacle.addImage(obstacle2);
        break;
        case 3:obstacle.addImage(obstacle3);
        break;
        case 4:obstacle.addImage(obstacle4);
        break;
        case 5:obstacle.addImage(obstacle5);
        break;
        case 6:obstacle.addImage(obstacle6);
        break;
        default:break;
    }    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    ObstaclesGroup.add(obstacle);
  }
}