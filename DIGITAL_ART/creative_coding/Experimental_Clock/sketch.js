function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  frameRate(1);
}

function draw() {
  background(255); 


  let s = second();
  let m = minute();
  let h = hour() % 12;
  let color1 = map(m,0,60,0,255);
  let smallDiameter = 30;
  
  push();
  fill(200);
  ellipse(300,300,400+smallDiameter*6);
  pop();
  
  push();
  fill(150);
  ellipse(300,300,400+smallDiameter*4);
  pop();
  
  push();
  fill(0);
  ellipse(300,300,400+smallDiameter*2);
  pop();

 
  let sectors = s * 2;


  let centerX = width / 2;
  let centerY = height / 2;


  let diameter = 400;
  let radius = diameter / 2;

 
  if (sectors >= 1) {
    let anglePerSector = 360 / sectors;

    for (let i = 0; i < sectors; i++) {
      let startAngle = i * anglePerSector; 
      let endAngle = (i + 1) * anglePerSector; 

      if (i % 2 === 0) {
        fill(color1);
      } else {
        fill(255);
      }

      noStroke();
      arc(centerX, centerY, diameter, diameter, startAngle, endAngle, PIE);
    }
  } else {
    noStroke();
    fill(255);
    ellipse(centerX, centerY, diameter);
  }

  let smallRadius = smallDiameter / 2;

  
  let distance = radius + smallRadius; 


  let currentAngle = (h * 30) + (m * 0.5) - 90;

  let smallX = centerX + distance * cos(currentAngle);
  let smallY = centerY + distance * sin(currentAngle);

 
  fill(255,0,0); 
  noStroke();
  strokeWeight(2);
  ellipse(smallX, smallY,smallDiameter);
  
  //minute pointer
  let grayDiameter1 = 460;
  let grayRadius1 = grayDiameter1 / 2;
  let distanceMinute = grayRadius1 + smallRadius; 


  let angleMin = (m * 6) + (s * 0.1) - 90; 
  let smallXmin = centerX + distanceMinute * cos(angleMin);
  let smallYmin = centerY + distanceMinute * sin(angleMin);

  
  fill(0, 0, 255);
  noStroke();
  strokeWeight(2);
  ellipse(smallXmin, smallYmin, smallDiameter);
  
  //second pointer
  let grayDiameter2 = 520;
  let grayRadius2 = grayDiameter2 / 2;
  let distanceSecond = grayRadius2 + smallRadius; 

  let angleSec = (s * 6) - 90;
  let smallXsec = centerX + distanceSecond * cos(angleSec);
  let smallYsec = centerY + distanceSecond * sin(angleSec);

  fill(0, 255, 0);
  noStroke();
  ellipse(smallXsec, smallYsec, smallDiameter);


  fill(0);
  textSize(25);
  textStyle(BOLD);
  text("Time:"+h+":"+m+":"+s,10,580);
}
