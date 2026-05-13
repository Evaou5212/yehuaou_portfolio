/**
 * About page: 标签先在天花板待命；仅当用户滚动到掉落区域进入视口后开始下落。
 * 物理引擎持续运行；用隐形静态圆跟随指针（无需按住拖动），悬停移动即可挤开标签。
 */
(function () {
  if (!document.body.classList.contains('about-page')) return;

  var container = document.getElementById('aboutFallingTags');
  var wrap = container && container.closest('.about-falling-wrap');
  if (!container || !wrap) return;

  var tags = [
    'Figma',
    'TouchDesigner',
    'p5.js',
    'Unity',
    'Webflow',
    'HTML',
    'CSS',
    'JavaScript',
    'Blender',
    'Ableton',
    'Adobe Creative Suite',
    'Claude Code',
    'Lovable',
    'Codex',
    'AI Studio',
    'Midjourney',
    'Cursor',
    'Gemini'
  ];
  var gravity = 0.81;
  var dropHeight = 400;
  var ceilingY = 24;
  /** 隐形碰撞圆（略小于力学半径，手感更集中） */
  var probeRadius = 56;
  /** 指针力学影响半径（过大显得「整个人都在推标签」） */
  var influenceRadius = 104;
  var started = false;
  var engine, world, runner, rafId;
  var mouseProbe;
  /** 相对 #aboutFallingTags 的指针坐标（不依赖 MouseConstraint，悬停即可更新） */
  var pointerPos = { x: -9999, y: -9999 };
  /** 上一帧指针位置，用于计算扫动方向 */
  var prevPointer = { x: -9999, y: -9999 };
  var pointerInside = false;
  var tagBodies = [];
  var tagEls = [];

  function createTagEl(label) {
    var el = document.createElement('span');
    el.className = 'about-tag ' + (Math.random() > 0.5 ? 'about-tag--dark' : 'about-tag--light');
    el.textContent = label;
    return el;
  }

  function syncElToBody(el, body, cw, ch) {
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    var x = body.position.x - w / 2;
    var y = body.position.y - h / 2;
    if (cw != null) {
      x = Math.max(0, Math.min(cw - w, x));
    }
    if (ch != null) {
      y = Math.max(0, Math.min(ch - h, y));
    }
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = 'rotate(' + body.angle + 'rad)';
  }

  /**
   * 将标签刚体限制在容器可视矩形内（考虑旋转矩形对角线，避免角穿出底部消失）
   */
  function clampBodyToPlayfield(body, el, Matter, cw, ch) {
    if (!body || !el) return;
    var w = Math.max(el.offsetWidth, 40) + 4;
    var h = Math.max(el.offsetHeight, 24) + 4;
    var R = Math.sqrt(w * w + h * h) / 2;
    var minX = R;
    var maxX = Math.max(R, cw - R);
    var minY = R;
    var maxY = Math.max(R, ch - R);
    var x = body.position.x;
    var y = body.position.y;
    var nx = Math.max(minX, Math.min(maxX, x));
    var ny = Math.max(minY, Math.min(maxY, y));
    if (Math.abs(nx - x) < 0.02 && Math.abs(ny - y) < 0.02) return;
    Matter.Body.setPosition(body, { x: nx, y: ny });
    var vx = body.velocity.x;
    var vy = body.velocity.y;
    if (Math.abs(nx - x) > 0.02) vx = 0;
    if (Math.abs(ny - y) > 0.02) vy = 0;
    Matter.Body.setVelocity(body, { x: vx, y: vy });
  }

  function setupCeiling() {
    container.classList.add('is-ceiling');
    var cw = container.offsetWidth || wrap.offsetWidth;
    var margin = 20;
    var count = Math.min(26, Math.max(tags.length, 20));
    for (var i = 0; i < count; i++) {
      var el = createTagEl(tags[i % tags.length]);
      container.appendChild(el);
      var maxLeft = cw - el.offsetWidth - margin;
      var x = margin + Math.random() * Math.max(0, maxLeft - margin);
      var y = ceilingY + (i % 2) * 36 + Math.random() * 12;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = 'none';
      tagEls.push(el);
    }
  }

  function startFalling() {
    if (started) return;
    started = true;
    container.classList.remove('is-ceiling');

    var Matter = window.Matter;
    if (
      !Matter ||
      !Matter.Engine ||
      !Matter.Bodies ||
      !Matter.World ||
      !Matter.Runner ||
      !Matter.Events
    ) {
      runFallbackOnce();
      return;
    }

    pointerInside = false;

    function syncPointer(ev) {
      var rect = container.getBoundingClientRect();
      pointerPos.x = ev.clientX - rect.left;
      pointerPos.y = ev.clientY - rect.top;
    }

    container.addEventListener(
      'pointerenter',
      function (ev) {
        pointerInside = true;
        syncPointer(ev);
        prevPointer.x = pointerPos.x;
        prevPointer.y = pointerPos.y;
      },
      { passive: true }
    );
    container.addEventListener(
      'pointerleave',
      function () {
        pointerInside = false;
      },
      { passive: true }
    );
    container.addEventListener(
      'pointermove',
      function (ev) {
        if (!pointerInside) return;
        syncPointer(ev);
      },
      { passive: true }
    );

    engine = Matter.Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: gravity }
    });
    world = engine.world;
    var cw = container.offsetWidth;
    var ch = dropHeight;
    var wallThickness = 24;
    var floorThickness = 20;
    var leftWall = Matter.Bodies.rectangle(-wallThickness / 2, ch / 2, wallThickness, ch * 2, { isStatic: true });
    var rightWall = Matter.Bodies.rectangle(cw + wallThickness / 2, ch / 2, wallThickness, ch * 2, { isStatic: true });
    var floor = Matter.Bodies.rectangle(cw / 2, ch + floorThickness / 2, cw + 100, floorThickness, { isStatic: true });
    Matter.World.add(world, [leftWall, rightWall, floor]);

    mouseProbe = Matter.Bodies.circle(-9999, -9999, probeRadius, {
      isStatic: true,
      friction: 0,
      frictionAir: 0,
      restitution: 0.45,
      collisionFilter: { mask: 0xffffffff },
      render: { visible: false },
      inertia: Infinity,
      slop: 0.05
    });
    Matter.World.add(world, mouseProbe);

    Matter.Events.on(engine, 'beforeUpdate', function () {
      if (!mouseProbe) return;
      if (!pointerInside) {
        Matter.Body.setPosition(mouseProbe, { x: -9999, y: -9999 });
        return;
      }
      Matter.Body.setPosition(mouseProbe, {
        x: pointerPos.x,
        y: pointerPos.y
      });

      var px = pointerPos.x;
      var py = pointerPos.y;
      var vx = px - prevPointer.x;
      var vy = py - prevPointer.y;
      prevPointer.x = px;
      prevPointer.y = py;
      var pointerSpeed = Math.sqrt(vx * vx + vy * vy);
      var sweepGain = Math.min(1.65, 0.1 + pointerSpeed * 0.05);

      for (var ti = 0; ti < tagBodies.length; ti++) {
        var body = tagBodies[ti];
        var bx = body.position.x;
        var by = body.position.y;
        var dx = bx - px;
        var dy = by - py;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= influenceRadius || dist < 0.25) continue;

        if (Matter.Sleeping && Matter.Sleeping.set) {
          Matter.Sleeping.set(body, false);
        }

        var inv = 1 / dist;
        var nx = dx * inv;
        var ny = dy * inv;
        var edge = (influenceRadius - dist) / influenceRadius;
        var falloff = edge * edge;
        var m = body.mass || 1;

        var push = 0.00135 * m * falloff;
        var fx = nx * push;
        var fy = ny * push;
        fy -= 0.00018 * m * falloff;

        if (pointerSpeed > 0.35) {
          var vinv = 1 / pointerSpeed;
          var sdx = vx * vinv;
          var sdy = vy * vinv;
          var sweep = 0.001 * m * falloff * sweepGain;
          fx += sdx * sweep;
          fy += sdy * sweep;
        }

        Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
      }
    });

    for (var i = 0; i < tagEls.length; i++) {
      var el = tagEls[i];
      var rect = el.getBoundingClientRect();
      var cr = container.getBoundingClientRect();
      var x = rect.left - cr.left + rect.width / 2;
      var y = rect.top - cr.top + rect.height / 2;
      var w = Math.max(el.offsetWidth, 40);
      var h = Math.max(el.offsetHeight, 24);
      var body = Matter.Bodies.rectangle(x, y, w + 4, h + 4, {
        restitution: 0.52,
        friction: 0.06,
        frictionStatic: 0.08,
        frictionAir: 0.032,
        density: 0.002,
        sleepThreshold: 48
      });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
      Matter.World.add(world, body);
      tagBodies.push(body);
    }

    Matter.Events.on(engine, 'afterUpdate', function () {
      for (var ci = 0; ci < tagBodies.length; ci++) {
        if (!tagEls[ci] || !tagEls[ci].parentNode) continue;
        clampBodyToPlayfield(tagBodies[ci], tagEls[ci], Matter, cw, ch);
      }
    });

    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    function update() {
      for (var k = 0; k < tagBodies.length; k++) {
        var b = tagBodies[k];
        if (!tagEls[k].parentNode) continue;
        syncElToBody(tagEls[k], b, cw, ch);
      }
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);
  }

  function runFallbackOnce() {
    tagEls.forEach(function (el, idx) {
      var duration = 2.5 + Math.random() * 2;
      var delay = idx * 0.08;
      el.style.transition = 'transform ' + duration + 's ease-in ' + delay + 's';
      el.style.transform = 'translateY(' + (dropHeight - ceilingY - 40) + 'px)';
    });
  }

  /** 仅当掉落区域进入视口后再开始，不在首屏加载时提前触发 */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) startFalling();
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12
    }
  );
  observer.observe(wrap);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCeiling);
  } else {
    setupCeiling();
  }
})();
