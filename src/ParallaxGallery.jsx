/**
 * 保留对角 zigzag 展开动态，但不用 sticky：整条 strip 随页面滚动，section 总高 1060vh，滚完即见页脚
 */
import React, { useRef } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';

const projects = [
  { id: 1, title: 'The Algorithmic Garden', category: 'Digital Art', aspectRatio: 'landscape', href: '/DIGITAL_ART/The-Algorithmic-Garden/index.html', image: '/DIGITAL_ART/The-Algorithmic-Garden/cover.png' },
  { id: 2, title: 'Trust Reconstruction', category: 'Games', aspectRatio: 'landscape', href: '/GAMES/marine%20game/Loggerhead/index.html', image: '/GAMES/marine%20game/Cover.png' },
  { id: 15, title: 'GRWM', category: 'Games', aspectRatio: 'landscape', href: '/GAMES/GRWM/index.html', image: '/GAMES/GRWM/scene1.JPG' },
  { id: 16, title: 'Irasutoya Cooking Game', category: 'Games', aspectRatio: 'landscape', href: '/GAMES/Irasutoya-Cooking-Game/index.html', image: '/GAMES/Irasutoya-Cooking-Game/cover.png', hideFromHomepage: true },
  { id: 3, title: 'Spatial Interface', category: 'UX Design', aspectRatio: 'landscape' },
  { id: 4, title: 'Neon Tokyo', category: 'Photography', aspectRatio: 'landscape' },
  { id: 5, title: 'Abstract Forms', category: '3D Art', aspectRatio: 'landscape' },
  { id: 6, title: 'Analog Dreams', category: 'Installation', aspectRatio: 'landscape' },
  { id: 7, title: 'Cyber Structure', category: 'Architecture', aspectRatio: 'landscape' },
  { id: 8, title: 'Minimalist Hub', category: 'Web Design', aspectRatio: 'landscape' },
  { id: 9, title: 'Future Wear', category: 'Fashion Tech', aspectRatio: 'landscape' },
  { id: 10, title: 'Glass Ecosystem', category: 'Render', aspectRatio: 'landscape' },
  { id: 11, title: 'Bio Synth', category: 'R&D', aspectRatio: 'landscape' },
  { id: 12, title: 'Kinetic Soul', category: 'Motion', aspectRatio: 'landscape' },
  { id: 13, title: 'Urban Decay', category: 'Photography', aspectRatio: 'landscape' },
  { id: 14, title: 'Deep Mind', category: 'AI Art', aspectRatio: 'landscape' },
];

const CELL_ASPECT_RATIO = 0.75;
const SUBPAGE_CELL_ASPECT_RATIO = 0.6;

function getLayout(columns, aspectRatio = CELL_ASPECT_RATIO) {
  const itemWidthVw = 100 / columns;
  const itemHeightVw = itemWidthVw * aspectRatio;
  return { itemWidthVw, itemHeightVw };
}

// 三列：照搬 replica 的 pattern [0,1,2,1]，第4张在中间列、从第3张左下角「转弯」长出来，origin 随左右移动
function getPosition(index, columns, aspectRatio = CELL_ASPECT_RATIO) {
  const { itemWidthVw, itemHeightVw } = getLayout(columns, aspectRatio);
  if (columns === 3) {
    const pattern = [0, 1, 2, 1];
    const colIndex = pattern[index % 4];
    const prevColIndex = index === 0 ? 0 : pattern[(index - 1) % 4];
    const left = `${colIndex * itemWidthVw}vw`;
    const topStr = `${index * itemHeightVw}vw`;
    let originX = 0;
    if (index === 0) originX = 0;
    else if (colIndex > prevColIndex) originX = 0;   // 往右 → 从左边长
    else if (colIndex < prevColIndex) originX = 1;     // 往左 → 从右边长
    else originX = 0;
    return { left, topStr, originX, itemWidthVw, itemHeightVw };
  }
  const col = index % columns;
  const left = `${col * itemWidthVw}vw`;
  const topStr = `${index * itemHeightVw}vw`;
  const originX = columns === 1 ? 0 : col / (columns - 1);
  return { left, topStr, originX, itemWidthVw, itemHeightVw };
}

const HIGH = 20;
// 先快后慢：滑动前约 1/4 就完成约 60% 展开（t^0.37：t=0.25 -> ~0.6）
const easeOutExp = 0.37;

function progressToEased(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped >= 1 ? 1 : clamped <= 0 ? 0 : Math.pow(clamped, easeOutExp);
}

function getFilteredProjects(category) {
  if (!category) return projects.filter((p) => !p.hideFromHomepage)
  if (category === 'Games') return projects.filter((p) => p.category === 'Games')
  if (category === 'UI/UX') return projects.filter((p) => p.category === 'UI/UX' || p.category === 'UX Design')
  if (category === 'Digital Art') return projects.filter((p) => p.category === 'Digital Art')
  return projects
}

function ZigZagItem({ project, index, currentStep, columns, totalItems, cellAspectRatio }) {
  const { left, topStr, originX, itemWidthVw, itemHeightVw } = getPosition(index, columns, cellAspectRatio);
  // 先「突然出现」：opacity 在极短区间内 0→1，此时 scale 仍为 0（首张从 step 0 开始）
  const opacityStart = Math.max(0, index - 0.9);
  const opacityEnd = Math.max(0.06, index - 0.8);
  const opacity = useTransform(currentStep, (v) => {
    if (v >= opacityEnd || v >= HIGH) return 1;
    if (v <= opacityStart) return 0;
    return progressToEased((v - opacityStart) / (opacityEnd - opacityStart));
  });
  const total = totalItems ?? 1
  const scaleStart = Math.max(opacityEnd, index - 0.78);
  const scaleEnd = Math.min(index + 1.15, total);
  const scale = useTransform(currentStep, (v) => {
    if (v >= scaleEnd || v >= HIGH) return 1;
    if (v <= scaleStart) return 0;
    return progressToEased((v - scaleStart) / (scaleEnd - scaleStart));
  });
  const imageScale = useTransform(currentStep, (v) => {
    if (v >= scaleEnd || v >= HIGH) return 1;
    if (v <= scaleStart) return 0.4;
    const eased = progressToEased((v - scaleStart) / (scaleEnd - scaleStart));
    return 0.4 + eased * 0.6;
  });
  const textOpacity = useTransform(currentStep, (v) => {
    const start = index - 0.2;
    const end = Math.min(index + 0.9, total);
    if (v >= end || v >= HIGH) return 1;
    if (v <= start) return 0;
    return progressToEased((v - start) / (end - start));
  });
  const textY = useTransform(currentStep, (v) => {
    const start = index - 0.05;
    const end = Math.min(index + 1.15, total);
    if (v >= end || v >= HIGH) return 0;
    if (v <= start) return -18;
    const eased = progressToEased((v - start) / (end - start));
    return -18 + eased * 18;
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        left,
        top: topStr,
        width: `${itemWidthVw}vw`,
        originX,
        originY: 0,
        scale,
        opacity,
        zIndex: index,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <a
        href={project.href || '#'}
        className="gallery-card-link"
        onClick={project.href ? undefined : (e) => e.preventDefault()}
        style={{ display: 'flex', flexDirection: 'column', width: '100%', textDecoration: 'none', color: 'inherit' }}
        aria-label={`View project: ${project.title}`}
      >
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          height: `${itemHeightVw}vw`,
        }}
      >
        <motion.div
          style={{
            scale: imageScale,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
          aria-hidden="true"
        >
          {project.image ? (
            <img
              src={project.image}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.target.onerror = null; e.target.src = project.imageFallback || ''; }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#e8e8e8' }} />
          )}
        </motion.div>
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(0,0,0,0.4)' }}>0{index + 1}</span>
        </div>
      </div>
      <motion.div
        style={{
          opacity: textOpacity,
          y: textY,
          marginTop: 12,
          paddingLeft: 16,
          paddingRight: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', margin: '0 0 4px 0' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: 16, fontWeight: 400, color: 'rgba(0,0,0,0.5)', lineHeight: 1.4, margin: 0 }}>
          {project.category} — Digital Frontier
        </p>
      </motion.div>
      </a>
    </motion.div>
  );
}

export default function ParallaxGallery({ columns = 2, category = '' }) {
  const filtered = getFilteredProjects(category)
  const cellAspectRatio = (category === 'Games' || category === 'UI/UX') ? SUBPAGE_CELL_ASPECT_RATIO : CELL_ASPECT_RATIO
  const { itemHeightVw } = getLayout(columns, cellAspectRatio)
  const STRIP_HEIGHT_VW = filtered.length * itemHeightVw
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.2,
    stiffness: 50,
    damping: 15,
    restDelta: 0.0001,
  })

  const totalSteps = filtered.length
  const currentStep = useTransform(smoothProgress, [0, 1], [0, totalSteps])

  return (
    <section
      ref={containerRef}
      className="parallax-gallery-section"
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--color-bg-second)',
        margin: 0,
        minHeight: `${STRIP_HEIGHT_VW}vw`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `${STRIP_HEIGHT_VW}vw`,
          minHeight: `${STRIP_HEIGHT_VW}vw`,
          overflow: 'visible',
          background: 'var(--color-bg-second)',
        }}
      >
        <motion.div style={{ position: 'relative', width: '100%', height: '100%', willChange: 'transform' }}>
          {filtered.map((project, index) => (
            <ZigZagItem key={project.id} project={project} index={index} currentStep={currentStep} columns={columns} totalItems={filtered.length} cellAspectRatio={cellAspectRatio} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
