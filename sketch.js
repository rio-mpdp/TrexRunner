var trex, trex_runs, edges, groundimage, invisableground, cloudimage, o1, o2, o3, o4, o5, o6, cloudg, ogroup, treximage, aviraptor1, aviraptor2, rg, invisablebg, gameover, restart, gmi, ri, die, jump, checkpoint, temp;
var score = 0;

function preload() {
  trex_runs = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  groundimage = loadImage("ground.png");
  cloudimage = loadImage("cloud-1.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
  treximage = loadImage("trex_collided.png");
  aviraptor1 = loadAnimation("Aviraptor_1.png", "Aviraptor_2.png");
  aviraptor2 = loadAnimation("Aviraptor_1.png")
  gmi = loadImage("gameOver.png");
  ri = loadImage("restart.png");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 200)
  trex = createSprite(25, 180, 20, 20);
  trex.addAnimation("runs", trex_runs);
  trex.addAnimation("dies", treximage);
  trex.scale = 0.5
  trex.setCollider("rectangle", 0, 0, 100, 100)
  edges = createEdgeSprites();
  ground = createSprite(300, 190, 600, 15)
  ground.addImage(groundimage);
  invisableground = createSprite(300, 200, 600, 10);
  invisableground.visible = false;
  cloudg = new Group();
  ogroup = new Group();
  temp = 0
  gamestate = 0;
  rg = new Group();
  invisablebg = createSprite(width / 2, height / 2, width, height)
  invisablebg.visible = false;
  gameover = createSprite(600 / 2, 200 / 2);
  gameover.addImage(gmi)
  restart = createSprite(600 / 2, 60);
  restart.addImage(ri)
  restart.scale = 0.6
  restart.visible = false;
  gameover.visible = false;


}

function createclouds() {
  if (frameCount % 60 == 0) {
    cloud = createSprite(600, Math.round(random(10, 100)), 10, 10);
    cloud.velocityX = -2;
    cloud.addImage(cloudimage)
    cloud.depth = trex.depth;
    trex.depth += 1
    cloud.lifetime = 600 / 2 + 20
    cloudg.add(cloud)
  }
}

function createraptors() {
  if (frameCount % 150 == 0) {
    r = createSprite(600, Math.round(random(10, 100)), 10, 10);
    r.velocityX = -2;
    r.addAnimation("fly", aviraptor1)
    r.addAnimation("stop", aviraptor2)
    r.scale = 0.4
    r.lifetime = 600 / 2 + 20
    rg.add(r);
  }
}


function obstacle1() {
  if (frameCount % 100 == 0) {
    obstacle = createSprite(600, 180, 10, 10);
    obstacle.velocityX = -2;
    obstacle.lifetime = 600 / 2
    var d = Math.round(random(1, 6));
    switch (d) {
      case 1:
        obstacle.addImage(o1);
        obstacle.scale = 0.4;
        break;
      case 2:
        obstacle.addImage(o2);
        obstacle.scale = 0.5;
        break;
      case 3:
        obstacle.addImage(o3);
        obstacle.scale = 0.4;
        obstacle.y = 180
        break;
      case 4:
        obstacle.addImage(o4);
        obstacle.scale = 0.4;
        break;
      case 5:
        obstacle.addImage(o5);
        obstacle.scale = 0.3;
        break;
      case 6:
        obstacle.addImage(o6);
        obstacle.scale = 0.3;
        break;
    }
    ogroup.add(obstacle)
  }

}

function callback(sprite1, sprite2) {
  sprite1.changeAnimation("stop")
}

function draw() {

  background(255);
  if (gamestate == 0) {
    if (trex.collide(ogroup) || rg.overlap(trex, callback)) {
      die.play()
      gamestate = 1;

    }

    if (keyDown("space") && trex.y >= 169) {
      jump.play()
      trex.velocityY = -10;

    }
    createclouds();
    obstacle1();
    createraptors();
    ground.velocityX = -2;
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    if (frameCount % 60 == 0) {
      score += 1
      temp = score
    }

    if (score % 10 == 0 && score > 0 && temp == score) {
      checkpoint.play()
      temp = temp + 0.01
    }
  } else if (gamestate == 1) {
    ogroup.setVelocityXEach(0);
    cloudg.setVelocityXEach(0);
    rg.setVelocityXEach(0);
    ground.velocityX = 0;
    trex.setVelocity(0, 0);
    trex.changeAnimation("dies")
    rg.overlap(invisablebg, callback)
    ogroup.setLifetimeEach(-1)
    cloudg.setLifetimeEach(-1)
    rg.setLifetimeEach(-1)
    gameover.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      ogroup.destroyEach()
      rg.destroyEach()
      cloudg.destroyEach()
      gameover.visible = false;
      restart.visible = false;
      trex.changeAnimation("runs")
      gamestate = 0
    }
  }
  trex.velocityY = trex.velocityY + 0.5

  trex.collide(invisableground);





  text("Score: " + score, 500, 20);

  drawSprites();

}