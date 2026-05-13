let bg;
let clothr = 213;
let clothg = 30;
let clothb = 35;

function setup() {
  createCanvas(400, 400);

  
  bg = color(255, 174, 43);
  background(bg);
}

function draw() {
  background(bg);
  noStroke();
  
  translate(5,10);
  
  //body
  fill(clothr,clothg,clothb);
  ellipse(200,500,400,450);
  fill(0);
  ellipse(200,345,15);
  ellipse(200,370,15);
  ellipse(200,395,15);
  
  
  //face
  fill(255-mouseX/800*255,255-mouseX/800*255,255-mouseX/800*255);
  rect(90,120,200,190,60);
  ellipse(110,180,80,70);
  ellipse(90,220,90,80);
  ellipse(100,260,60,50);
  ellipse(150,280,90,80);
  ellipse(210,290,100,80);
  ellipse(270,260,110,90);
  ellipse(290,220,90,80);
  ellipse(270,180,80,70);
  
  
  fill(229, 113, 136);
  rect(105,130,170,100,250);
  
  fill(0,0,0);
  ellipse(143+20*mouseX/400,190+10*mouseY/400,10+mouseY/400*10);
  ellipse(220+20*mouseX/400,190+10*mouseY/400,10+mouseY/400*10);
  
  
  fill(255-mouseX/800*255,255-mouseX/800*255,255-mouseX/800*255);
  push();
  translate(165,180);
  rotate(9/10*PI);
  rect(0,0,30,15,250);
  pop();
  push();
  translate(220,166);
  rotate(1/10*PI);
  rect(0,0,30,15,250);
  pop();

  fill(213, 30, 35);
  ellipse(190,225,random(35,45));
  
  push();
  noFill();
  stroke(0+mouseX/800*255);
  strokeWeight(8);
  arc(190, 260, 33+40*mouseY/400, 30+40*mouseY/400, 0, 5/7*PI); 
  pop();

  

  //hat
  fill(clothr,clothg,clothb);
  push();
  translate(-15,-110);
  beginShape();
  vertex(100, 250);  // Bottom-left corner of the hat
  bezierVertex(120, 200, 170, 150, 210, 120);  // Control points leading to the sharp top
  bezierVertex(250, 150, 300, 200, 320, 250);  // Control points for the right side
  vertex(100, 250);
  endShape();
  pop();
  
  fill(255, 242, 222);
  ellipse(195,10,30);
  
  
  fill(255, 242, 222);
  ellipse(110,130,60,50);
  ellipse(145,120,50,45);
  ellipse(145,140,50,50);
  ellipse(185,120,35,30);
  ellipse(185,145,60,50);
  ellipse(225,125,60,70);
  ellipse(235,140,70,50);
  ellipse(275,130,65,60);
  
  
   if (mouseIsPressed) { 
     
     //wire
     push();
     beginShape();
     translate(0,-150);
     noFill();
     stroke(255);
     strokeWeight(20);
     for (let x = 0; x <= width; x++) {
      let y = height / 2 + 20 * sin(PI * x / (width * 1.5)) + 10 * sin(2 * PI * x / (width * 2.5));
      vertex(x, y);
    }
    endShape();
     pop();
     
     //lights
     fill(random(0,255),random(0,255),random(0,255));
     ellipse(60,80,50,45);
     fill(random(0,255),random(0,255),random(0,255));
     ellipse(120,50,40,38);
     fill(random(0,255),random(0,255),random(0,255));
     ellipse(140,90,35);
     fill(random(0,255),random(0,255),random(0,255));
     ellipse(260,80,50,45);
     fill(random(0,255),random(0,255),random(0,255));
     ellipse(330,60,50);
     fill(random(0,255),random(0,255),random(0,255));
     ellipse(360,100,25);
   }
  
}

function mousePressed(){
  bg = color(0);
  clothr = random(0,255);
  clothg = random(0,255);
  clothb = random(0,255);
  
}

function mouseReleased(){
  bg = color(255, 174, 43);
  clothr = 213;
  clothg = 30;
  clothb = 35;
}
