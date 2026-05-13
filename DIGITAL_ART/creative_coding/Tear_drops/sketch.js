const CFG = {
  canvasW: 600,
  canvasH: 800,

  colorHSB: { h: 150, s: 2, b: 70 },

  rMin: 35,
  rMax: 70,
  growthMin: 5,
  growthMax: 10,

  ellipseDeltaDiamMax: 12,

  angleStepDeg: 2,
  offsetMin: 15,
  offsetMax: 18,

  noiseFreqMin: 0.6,
  noiseFreqMax: 0.8,
  noiseOctaves: 18,
  noiseFalloff: 0.5,
  bulgeMin: 0.0,
  bulgeMax: 0.0,

  spawnDelayMax: 20.0,
  fadeDuration: 5.0,
  baseAlpha: 70,
  dropletCount: 32,

  // letter
  letterBoxW: 490,
  letterBoxH: 440,
  letterPaddingX: 28,
  letterFontSize: 20,
  letterLineHeight: 32,

  // stain
  stainAlpha: 42,
  stainStampSize: 28,
  textBlurPx: 7,
  shadowBlurPx: 16,
  shadowAlpha: 34
};

let droplets = [];

let sharpLetterLayer;
let blurredLetterLayer;
let shadowLetterLayer;

let stainMaskLayer;

let lines = [];
let letterBox = {};

// 这里换成你的信
const letterText = `Dearest Cecilia, 

The story can resume. The one I had been planning on that evening walk. I can become again the man who once crossed the surrey park at dusk, in my best suit, swaggering on the promise of life. The man who, with the clarity of passion, made love to you in the library.

The story can resume. I will return. Find you, love you, marry you and live without shame.`;

function setup() {
  createCanvas(CFG.canvasW, CFG.canvasH);
  pixelDensity(1);

  colorMode(HSB, 360, 100, 100, 255);
  noStroke();
  noiseDetail(CFG.noiseOctaves, CFG.noiseFalloff);

  setupLetterLayout();

  for (let i = 0; i < CFG.dropletCount; i++) {
    droplets.push(
      new Droplet(random(width), random(height), CFG.colorHSB)
    );
  }
}

function draw() {
  background(0, 0, 100);
  fill(40, 10, 95); rect(0, 0, width, height);

  const t = millis() / 1000;
  const dt = deltaTime / 1000;

  for (const d of droplets) {
    d.update(dt, t);
    stampDropletIfTouchingText(d, t);
    d.draw(t);
  }

  drawLetterComposite();
}

function setupLetterLayout() {
  letterBox.w = CFG.letterBoxW;
  letterBox.h = CFG.letterBoxH;
  letterBox.x = width / 2 - letterBox.w / 2;
  letterBox.y = height / 2 - letterBox.h / 2;

  sharpLetterLayer = createGraphics(width, height);
  blurredLetterLayer = createGraphics(width, height);
  shadowLetterLayer = createGraphics(width, height);
  stainMaskLayer = createGraphics(width, height);

  sharpLetterLayer.pixelDensity(1);
  blurredLetterLayer.pixelDensity(1);
  shadowLetterLayer.pixelDensity(1);
  stainMaskLayer.pixelDensity(1);

  buildLetterLines();
  renderLetterLayers();

  stainMaskLayer.clear();
  stainMaskLayer.noStroke();
}

function buildLetterLines() {
  lines = [];

  const usableW = letterBox.w - CFG.letterPaddingX * 2;

  sharpLetterLayer.textFont("Courier New");
  sharpLetterLayer.textSize(CFG.letterFontSize);

  const paragraphs = letterText.split("\n");

  for (let para of paragraphs) {
    const trimmed = para.trim();

    if (trimmed === "") {
      lines.push("");
      continue;
    }

    const words = trimmed.split(/\s+/);
    let current = "";

    for (let word of words) {
      const testLine = current === "" ? word : current + " " + word;
      const testW = sharpLetterLayer.textWidth(testLine);

      if (testW <= usableW) {
        current = testLine;
      } else {
        if (current !== "") lines.push(current);
        current = word;
      }
    }

    if (current !== "") lines.push(current);
  }
}

function renderLetterLayers() {
  sharpLetterLayer.clear();
  sharpLetterLayer.push();

  sharpLetterLayer.textFont("Courier New");
  sharpLetterLayer.textStyle(NORMAL);
  sharpLetterLayer.textSize(CFG.letterFontSize);
  sharpLetterLayer.textLeading(CFG.letterLineHeight);
  sharpLetterLayer.textAlign(LEFT, TOP);
  sharpLetterLayer.fill(35);

  const startX = letterBox.x + CFG.letterPaddingX;
  const totalTextH = lines.length * CFG.letterLineHeight;
  const startY = height / 2 - totalTextH / 2;

  for (let i = 0; i < lines.length; i++) {
    sharpLetterLayer.text(lines[i], startX, startY + i * CFG.letterLineHeight);
  }

  sharpLetterLayer.pop();

  blurredLetterLayer.clear();
  blurredLetterLayer.image(sharpLetterLayer, 0, 0);
  blurredLetterLayer.filter(BLUR, CFG.textBlurPx);

  shadowLetterLayer.clear();
  shadowLetterLayer.image(sharpLetterLayer, 0, 0);
  shadowLetterLayer.filter(BLUR, CFG.shadowBlurPx);
}

function stampDropletIfTouchingText(d, t) {
  if (!d.isAlive(t)) return;

  const pts = d.getSamplePoints(6);
  let touching = false;

  for (const p of pts) {
    if (isPointOnLetter(p.x, p.y)) {
      touching = true;
      break;
    }
  }

  if (!touching && isPointOnLetter(d.x, d.y)) touching = true;
  if (!touching) return;

  stainMaskLayer.push();
  stainMaskLayer.fill(255, CFG.stainAlpha);

  stainMaskLayer.beginShape();
  const outline = d.getSamplePoints(1);
  for (const p of outline) {
    stainMaskLayer.vertex(p.x, p.y);
  }
  stainMaskLayer.endShape(CLOSE);

  // 固定偏移的小扩散印章，不会抖
  const offsets = [
    [0, 0],
    [8, -3],
    [-7, 5],
    [5, 8],
    [-9, -5]
  ];

  stainMaskLayer.fill(255, CFG.stainAlpha * 0.6);
  for (const off of offsets) {
    stainMaskLayer.circle(
      d.x + off[0],
      d.y + off[1],
      CFG.stainStampSize
    );
  }

  stainMaskLayer.pop();
}

function isPointOnLetter(px, py) {
  if (px < 0 || px >= width || py < 0 || py >= height) return false;
  const c = sharpLetterLayer.get(floor(px), floor(py));
  return c[3] > 10;
}

function drawLetterComposite() {
  if (!maskHasInk()) {
    image(sharpLetterLayer, 0, 0);
    return;
  }

  const stainMaskImage = graphicsToMaskImage(stainMaskLayer, false);
  const inverseMaskImage = graphicsToMaskImage(stainMaskLayer, true);

  let sharpPart = sharpLetterLayer.get();
  sharpPart.mask(inverseMaskImage);

  let blurPart = blurredLetterLayer.get();
  blurPart.mask(stainMaskImage);

  let shadowPart = shadowLetterLayer.get();
  shadowPart.mask(stainMaskImage);

  image(sharpPart, 0, 0);

  push();
  tint(255, CFG.shadowAlpha);
  image(shadowPart, 0, 0);
  pop();

  image(blurPart, 0, 0);
}

function graphicsToMaskImage(gfx, invert = false) {
  const img = createImage(gfx.width, gfx.height);
  gfx.loadPixels();
  img.loadPixels();

  for (let i = 0; i < gfx.pixels.length; i += 4) {
    const a = gfx.pixels[i + 3];
    const m = invert ? 255 - a : a;

    img.pixels[i] = 255;
    img.pixels[i + 1] = 255;
    img.pixels[i + 2] = 255;
    img.pixels[i + 3] = m;
  }

  img.updatePixels();
  return img;
}

function maskHasInk() {
  stainMaskLayer.loadPixels();
  for (let i = 3; i < stainMaskLayer.pixels.length; i += 4) {
    if (stainMaskLayer.pixels[i] > 0) return true;
  }
  return false;
}

function ellipseRadiusAtAngleRot(a, r, deltaR, phi) {
  const rx = r + deltaR;
  const ry = r - deltaR;
  const ang = a - phi;
  const c = cos(ang), s = sin(ang);
  return 1.0 / sqrt((c * c) / (rx * rx) + (s * s) / (ry * ry));
}

class Droplet {
  constructor(x, y, colHSB) {
    this.x = x;
    this.y = y;
    this.col = colHSB;

    this.spawnDelay = random(0, CFG.spawnDelayMax);
    this.fadeDuration = CFG.fadeDuration;

    const rStart = random(CFG.rMin, (CFG.rMin + CFG.rMax) * 0.65);
    const rTarget = random(max(rStart + 1, CFG.rMin), CFG.rMax);
    this.r = rStart;
    this.targetR = rTarget;
    this.speed = random(CFG.growthMin, CFG.growthMax);
    this.growing = true;

    this.ellipseDeltaR = random(0, CFG.ellipseDeltaDiamMax * 0.5);
    this.ellipsePhi = random(TWO_PI);

    this.angleStep = radians(CFG.angleStepDeg);
    this.offsetAmp = random(CFG.offsetMin, CFG.offsetMax);
    this.nFreq = random(CFG.noiseFreqMin, CFG.noiseFreqMax);
    this.nSeedX = random(1000);
    this.nSeedY = random(1000);

    this.vertices = this.buildVertices();
  }

  ringNoise(a) {
    let sum = 0;
    let norm = 0;
    let freq = this.nFreq;
    let amp = 1;

    for (let o = 0; o < CFG.noiseOctaves; o++) {
      const nx = this.nSeedX + cos(a) * freq;
      const ny = this.nSeedY + sin(a) * freq;
      sum += amp * noise(nx, ny);
      norm += amp;
      freq *= 1.0;
      amp *= CFG.noiseFalloff;
    }

    return ((sum / max(1e-6, norm)) - 0.5) * 2.0 * this.offsetAmp;
  }

  buildVertices() {
    const arr = [];
    for (let a = 0; a < TWO_PI; a += this.angleStep) {
      arr.push({ angle: a, offset: this.ringNoise(a) });
    }
    return arr;
  }

  update(dt, t) {
    if (t < this.spawnDelay) return;

    if (this.growing) {
      this.r += this.speed * dt;
      if (this.r >= this.targetR) {
        this.r = this.targetR;
        this.growing = false;
      }
    }
  }

  isAlive(t) {
    const age = t - this.spawnDelay;
    if (age < 0) return false;
    const k = 1 - constrain(age / this.fadeDuration, 0, 1);
    return k > 0;
  }

  getCurrentAlpha(t) {
    const age = t - this.spawnDelay;
    if (age < 0) return 0;
    const k = 1 - constrain(age / this.fadeDuration, 0, 1);
    if (k <= 0) return 0;
    return CFG.baseAlpha * k;
  }

  getPoint(i) {
    const N = this.vertices.length;
    const v = this.vertices[(i + N) % N];

    const base = ellipseRadiusAtAngleRot(
      v.angle,
      this.r,
      this.ellipseDeltaR,
      this.ellipsePhi
    );

    const rr = base + v.offset;

    return {
      x: this.x + cos(v.angle) * rr,
      y: this.y + sin(v.angle) * rr
    };
  }

  getSamplePoints(step = 6) {
    const pts = [];
    for (let i = 0; i < this.vertices.length; i += step) {
      pts.push(this.getPoint(i));
    }
    return pts;
  }

  draw(t) {
    const alpha = this.getCurrentAlpha(t);
    if (alpha <= 0) return;

    fill(this.col.h, this.col.s, this.col.b, alpha);
    this.drawSmooth();
  }

  drawSmooth() {
    beginShape();
    const N = this.vertices.length;

    const p_1 = this.getPoint(-1);
    const p0 = this.getPoint(0);
    const p1 = this.getPoint(1);

    curveVertex(p_1.x, p_1.y);
    curveVertex(p0.x, p0.y);

    for (let i = 1; i < N; i++) {
      const p = this.getPoint(i);
      curveVertex(p.x, p.y);
    }

    curveVertex(p1.x, p1.y);
    const p2 = this.getPoint(2);
    curveVertex(p2.x, p2.y);

    endShape(CLOSE);
  }
}