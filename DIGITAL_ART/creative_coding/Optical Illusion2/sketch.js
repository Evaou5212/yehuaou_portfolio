let img;
function preload() {
  img = loadImage('circle.png');
}

function setup() {
  createCanvas(600, 600);
}

function draw() {
  
  background(220);
   image(img,0,0);
   for (let i = 0; i < 1000; i += 6) {
      for (let j = 0; j < height; j += 30) {
        strokeWeight(3);
        stroke(57, 36, 214);
        line(i, 0, i, height);
    }
  }
  
      for (let x=0; x<1000; x+=6){
        strokeWeight (3);
        stroke(57, 36, 214)
        line (x-mouseX,0,x-mouseX,height);
      }
  
        for (let x=0; x<1000; x+=6){
        strokeWeight (3);
        stroke(220)
        line (x+mouseX,0,x+mouseX,height);
      }

}