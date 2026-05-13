function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
}

function draw() {
  background(255);
  translate(50,-90);
  line(40,380,50,480);
  ears();
  redhat();
  face();
  expression();
  hands();
  fill(225,176,155);
  legs(190,560,60,40);
  legs(250,560,60,40);
  legs(188,580,55,40);
  legs(252,580,55,40);
  legs(186,600,50,40);
  legs(254,600,50,40);
  fill(220);
  legs(174,620,70,35);
  legs(266,620,70,35);
  fill(199,111,89);
  legs(183,585,10,6);
  legs(257,585,10,6);
  fingernail(0,0);
  fingernail(0,10);
  fingernail(0,20);
}

function ears() {
  fill(220, 151, 110); 
  noStroke();
  //left ear
  beginShape();
  vertex(177, 106);
  bezierVertex(216, 134, 163, 170, 213, 207);
  vertex(213,207);
  vertex(227,207);
  vertex(227,207);
  bezierVertex(227,158,214,134,177,106);
  endShape(CLOSE);
  
  //right ear
  beginShape();
  vertex(300,98);
  bezierVertex(263,145,258,147,263,207);
  vertex(263,207);
  vertex(276,207);
  vertex(276,207);
  bezierVertex(313,180,309,152,300,98);
  endShape()
}

function redhat(){
  fill(198,59,53);
  noStroke();
  beginShape();
  vertex(148,313);
  bezierVertex(152,284,130,289,168,236);
  vertex(168,236);
  bezierVertex(184,222,212,205,227,203);
  vertex(227,203);
  bezierVertex(251,200,286,193,317,245);
  vertex(317,245);
  bezierVertex(332,271,338,334,347,347);
  vertex(347,347);
  bezierVertex(338,347,323,353,306,347);
  vertex(306,347);
  bezierVertex(290,335,295,347,265,353);
  vertex(265,353);
  bezierVertex(274,339,293,320,287,294);
  vertex(287,294);
  bezierVertex(268,273,258,287,246,271);
  vertex(246,271);
  bezierVertex(237,261,224,267,206,257);
  vertex(206,257);
  bezierVertex(189,272,192,272,177,276);
  vertex(177,276);
  bezierVertex(169,318,167,305,172,343);
  vertex(172,343);
  bezierVertex(162,341,143,333,149,315);
  vertex(149,315); 
  endShape();
}

function face(){
  fill(220, 151, 110); 
  noStroke();
  beginShape();
  vertex(265,353);
  bezierVertex(274,339,293,320,287,294);
  vertex(287,294);
  bezierVertex(268,273,258,287,246,271);
  vertex(246,271);
  bezierVertex(237,261,224,267,206,257);
  vertex(206,257);
  bezierVertex(189,272,192,272,177,276);
  vertex(177,276);
  bezierVertex(169,318,154,325,170,342);
  vertex(170,342);
  bezierVertex(190,359,182,356,199,351);
  vertex(199,351);
  bezierVertex(216,364,253,365,264,354);
  vertex(264,354);
  endShape();
}

function expression()
{
  fill(0);
  rect(198,340,2,12);
  triangle(199,343,182,325,216,325);
  fill(255);
  
  push();
  translate(250,300);
  rotate(-10);
  ellipse(0,0,40,30);
  fill(0);
  ellipse(-4,0,30,26);
  fill(255);
  ellipse(-6,-5,10);
  pop();
}

function hands(){
  stroke(0);
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(190,355);
  vertex(190,358);
  bezierVertex(167,375,163,387,161,401);
  vertex(120,450);
  vertex(75,410);
  vertex(5,410);
  vertex(45,420);
  vertex(5,420);
  vertex(45,430);
  vertex(5,430);
  vertex(45,440);
  vertex(75,445);
  vertex(122,485);
  vertex(205,425);
  endShape();
  
  beginShape();
  vertex(160,460);
  vertex(170,550)
  endShape();
  
  beginShape();
  vertex(260,356);
  bezierVertex(262,365,257,362,269,370);
  vertex(269,370)
  bezierVertex(284,381,298,411,301,436);
  vertex(365,400);
  vertex(440,400);
  vertex(400,410);
  vertex(440,410);
  vertex(400,420);
  vertex(440,420);
  vertex(400,430);
  vertex(365,435);
  vertex(296,472);
  vertex(280,466)
  endShape();
  
  beginShape();
  vertex(280,450);
  vertex(270,550);
  endShape();
  
  beginShape();
  vertex(235,400);
  vertex(225,500);
  vertex(230,540);
  endShape();
}

function legs(x1,y1,length1,height1){
  noStroke();
  ellipse(x1,y1,length1,height1);
}

function fingernail(x2,y2){
  fill(0);
  triangle(5+x2,410+y2,5+x2+20,410+y2,5+x2+20,410+y2+5);
  triangle(440+x2,400+y2,440+x2-20,400+y2,440+x2-20,400+y2+5);
}

