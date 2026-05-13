/**
 * 第二页动态草坪背景（注入到 .cover-bg）；第二页未显示时自动暂停绘制以减轻卡顿
 */
(function () {
  function Perlin() {
    var p = new Array(512);
    var permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    for (var i = 0; i < 256; i++) p[256 + i] = p[i] = permutation[i];
    this.p = p;
  }
  Perlin.prototype.fade = function (t) { return t * t * t * (t * (t * 6 - 15) + 10); };
  Perlin.prototype.lerp = function (t, a, b) { return a + t * (b - a); };
  Perlin.prototype.grad = function (hash, x, y, z) {
    var h = hash & 15;
    var u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14) ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  Perlin.prototype.noise = function (x, y, z) {
    var p = this.p;
    var X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    var u = this.fade(x), v = this.fade(y), w = this.fade(z);
    var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
    return this.lerp(w,
      this.lerp(v, this.lerp(u, this.grad(p[AA], x, y, z), this.grad(p[BA], x - 1, y, z)), this.lerp(u, this.grad(p[AB], x, y - 1, z), this.grad(p[BB], x - 1, y - 1, z))),
      this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x, y, z - 1), this.grad(p[BA + 1], x - 1, y, z - 1)), this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))));
  };

  function Blade(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.length = 40 + Math.random() * 50;
    this.targetAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    this.angle = this.targetAngle;
    this.stiffness = 0.05 + Math.random() * 0.05;
    this.width = 1.5 + Math.random() * 2;
    var h = 85 + Math.random() * 30, s = 30 + Math.random() * 30, l = 30 + Math.random() * 30;
    this.color = 'hsla(' + h + ', ' + s + '%, ' + l + '%, 0.7)';
  }
  Blade.prototype.update = function (mouseX, mouseY, mouseVx, isActive, windValue) {
    var windForce = windValue * 0.4;
    var mouseForce = 0;
    if (isActive) {
      var dx = this.x - mouseX, dy = this.y - mouseY;
      var distSq = dx * dx + dy * dy;
      var interactionRadius = 200, interactionRadiusSq = interactionRadius * interactionRadius;
      if (distSq < interactionRadiusSq) {
        var dist = Math.sqrt(distSq);
        var falloff = 1 - dist / interactionRadius;
        var clamp = 40;
        var clampedVx = Math.max(-clamp, Math.min(clamp, mouseVx));
        mouseForce = clampedVx * 0.1 * falloff;
      }
    }
    var desiredAngle = this.targetAngle + windForce + mouseForce;
    var isInteracting = Math.abs(mouseForce) > 0.01;
    var currentStiffness = isInteracting ? 0.18 : this.stiffness;
    this.angle += (desiredAngle - this.angle) * currentStiffness;
  };
  Blade.prototype.draw = function (ctx) {
    var tipX = this.x + Math.cos(this.angle) * this.length;
    var tipY = this.y + Math.sin(this.angle) * this.length;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    var ctrlX = this.x + Math.cos(this.angle - 0.1) * (this.length * 0.5);
    var ctrlY = this.y + Math.sin(this.angle - 0.1) * (this.length * 0.5);
    ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
    ctx.stroke();
  };

  var canvas, ctx, blades = [], perlin, rafId;
  var mouse = { x: 0, y: 0, vx: 0, vy: 0, isActive: false };
  var time = 0;
  var BG = '#ffffff';

  function init() {
    var w = window.innerWidth, h = window.innerHeight;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;
    if (ctx) {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
    }
    var area = w * h, density = 0.005, count = Math.floor(area * density);
    blades = [];
    for (var i = 0; i < count; i++) blades.push(new Blade(w, h));
  }

  function animate() {
    if (!canvas || !ctx) {
      rafId = requestAnimationFrame(animate);
      return;
    }
    var mainContent = document.getElementById('mainContent');
    if (mainContent && !mainContent.classList.contains('visible')) {
      rafId = requestAnimationFrame(animate);
      return;
    }
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    time += 0.025;
    mouse.vx *= 0.9;
    mouse.vy *= 0.9;
    for (var i = 0; i < blades.length; i++) {
      var b = blades[i];
      var n = perlin.noise(b.x * 0.0015, b.y * 0.0015, time);
      b.update(mouse.x, mouse.y, mouse.vx, mouse.isActive, n);
      b.draw(ctx);
    }
    rafId = requestAnimationFrame(animate);
  }

  function onMouseMove(e) {
    mouse.vx = e.clientX - mouse.x;
    mouse.vy = e.clientY - mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isActive = true;
  }
  function onTouchMove(e) {
    if (e.touches.length > 0) {
      var cx = e.touches[0].clientX, cy = e.touches[0].clientY;
      mouse.vx = cx - mouse.x;
      mouse.vy = cy - mouse.y;
      mouse.x = cx;
      mouse.y = cy;
      mouse.isActive = true;
    }
  }
  function onLeave() {
    mouse.isActive = false;
    mouse.vx = mouse.vy = 0;
  }

  function start() {
    var container = document.querySelector('.cover-bg');
    if (!container) return;
    canvas = document.createElement('canvas');
    canvas.className = 'grass-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'auto';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    perlin = new Perlin();
    init();
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.addEventListener('resize', init);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchend', onLeave);
    rafId = requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
