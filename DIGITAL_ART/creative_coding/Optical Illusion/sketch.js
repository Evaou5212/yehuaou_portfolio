let rows = 9;
let freq = 0.05;
let amp = 30;
let speed = 0.3;
let rowOffsets = [];

function setup() {
  createCanvas(600, 600);
  noStroke();
  
  for (let i = 0; i < rows / 2; i++) {
    let offset = i * PI / 2;
    rowOffsets.push(offset);  
  }
  
  for (let i = 0; i < rows / 2; i++) {
    rowOffsets[rows - i - 1] = rowOffsets[i];
  }
  
}

function draw() {
  background(255);
  fill(0);
  
  for (let i = 0; i < rows; i++) {
    let y = map(i, 0, rows, 50, height - 50);
    let waveLengthFactor = abs(i - floor(rows / 2)) / (rows / 2);  
    let waveLength = map(waveLengthFactor, 0, 1, 100, 20);
    let cols = int(waveLength);
    
    for (let j = 0; j < cols; j++) {
      let x = map(j, 0, cols, 50, width - 50);
      let t = frameCount * speed + rowOffsets[i];  
      let size = amp + amp * cos(TWO_PI * freq * j + t);
      
      ellipse(x, y, size * 0.2, size);
    }
  }
}
