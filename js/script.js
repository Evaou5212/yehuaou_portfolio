/**
 * 首页滚动与转场逻辑
 * - 首屏：Shader 背景 + 球体通道；滚动时球体放大、辉度增强，走进通道
 * - 光充满屏后进入第二页：全屏光晕渐隐，露出第二页草坪背景
 */
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// ===== DOM Elements =====
const introScene = document.getElementById('introScene');
const scene3d = document.getElementById('scene3d');
const contentLayer = document.getElementById('contentLayer');
const portalLayer = document.getElementById('portalLayer');
const nameLayer = document.getElementById('nameLayer');
const nameText = document.getElementById('nameText');
const progressBar = document.querySelector('.progress-bar');
const scrollProgressEl = document.querySelector('.scroll-progress');
const scrollDownIntro = document.querySelector('.scroll-down-intro');
const mainContent = document.getElementById('mainContent');
const coverSection = document.getElementById('coverSection');
const backToHomeBtn = document.getElementById('backToHome');

// ===== Rotating text (playful / exploratory / intentional) =====
(function initRotatingText() {
    const words = document.querySelectorAll('.rotating-word');
    if (!words.length) return;
    let index = 0;
    const total = words.length;
    const intervalMs = 2800;

    function goNext() {
        const currentEl = words[index];
        const nextIndex = (index + 1) % total;
        const nextEl = words[nextIndex];

        currentEl.classList.remove('current');
        currentEl.classList.add('leave-up');
        nextEl.classList.remove('enter-from-below');
        nextEl.classList.add('current');

        setTimeout(() => {
            currentEl.classList.remove('leave-up');
            nextEl.classList.remove('enter-from-below');
        }, 520);

        index = nextIndex;
    }

    const tid = setInterval(goNext, intervalMs);
})();

// ===== State =====
let scrollAmount = 0;
let targetScroll = 0;
let hasCompleted = false;
let isReturning = false;
const SCROLL_SENSITIVITY = 0.0012;
const LERP_SPEED = 0.08;

// ===== Update 3D Scene (progress 0 = first page, 1 = second page) =====
const update3DScene = (progress) => {
    progress = Math.max(0, Math.min(1, progress));

    if (progress > 0.01) {
        scrollProgressEl.classList.add('visible');
        scrollDownIntro.style.opacity = Math.max(0, 1 - progress * 5);
    } else {
        scrollProgressEl.classList.remove('visible');
        scrollDownIntro.style.opacity = 1;
    }

    progressBar.style.width = `${progress * 100}%`;

    // 通道感：内容仅用缩放与透明度（不用 translateZ），避免返回时 3D 穿模
    const portalEase = progress * progress;
    const contentOpacity = 1 - (progress * 2);
    const contentScale = 1 - (progress * 0.3);
    contentLayer.style.opacity = Math.max(0, contentOpacity);
    contentLayer.style.transform = `scale(${contentScale})`;

    // 球体通道：仅在原地放大（不沿 Z 靠近），避免进入球体内部造成穿模；充满屏后由光晕渐隐过渡到第二页
    const portalScale = 1 + portalEase * 12;
    portalLayer.style.transform = `scale(${portalScale})`;

    // Yehua Ou name layer (optional: removed from intro per design)
    if (nameLayer) {
        const nameScale = 1 - progress * 0.2;
        const viewportCenterY = window.innerHeight * 0.5;
        const navCenterY = 42;
        const moveUpPx = (viewportCenterY - navCenterY) * progress;
        nameLayer.style.transform = `translate(-50%, calc(-50% - ${moveUpPx}px)) scale(${nameScale})`;
        nameLayer.style.opacity = 1;
    }

    // Sun Portal：滚动代替 Radiance Intensity slider，0.5 -> 2.5
    const sunPortal = document.getElementById('sunPortal');
    if (sunPortal) {
        const intensity = 0.5 + progress * 2;
        sunPortal.style.setProperty('--portal-intensity', String(intensity));
    }
};

// ===== Animation Loop =====
// 仅在未稳定时继续下一帧，稳定后停止循环，避免每帧写 style 导致返回后文字/球体闪烁
const animateScroll = () => {
    scrollAmount += (targetScroll - scrollAmount) * LERP_SPEED;
    if (Math.abs(targetScroll - scrollAmount) < 0.002) scrollAmount = targetScroll;

    // 返回第一页时：接近 0 则卡到 0，保证字体和内容精确回到原位
    if (!hasCompleted && targetScroll === 0 && scrollAmount <= 0.01) {
        scrollAmount = 0;
        update3DScene(0);
    } else {
        update3DScene(scrollAmount);
    }

    // 达到终点即进入第二页（放宽判定：lerp 难以精确到 0.998，且 targetScroll=1 即视为意图完成）
    if (!hasCompleted && targetScroll >= 1 && scrollAmount >= 0.92) {
        completeTransition();
        return;
    }

    if (Math.abs(targetScroll - scrollAmount) >= 0.002) requestAnimationFrame(animateScroll);
};

// ===== Go to second page =====
const FADE_OUT_MS = 600;   /* 第一页淡出到白屏 */
const FADE_IN_MS = 950;    /* 第二页淡入（与 CSS transition 一致） */

const completeTransition = () => {
    if (hasCompleted) return;
    hasCompleted = true;

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const lightOverlay = document.getElementById('transitionLightOverlay');
    if (!lightOverlay) {
        doPageSwap();
        return;
    }

    // 先归零滚动，再显示白屏，避免进入第二页时从非顶部闪一下
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.body.classList.add('is-transitioning');
    lightOverlay.classList.remove('fade-out', 'overlay-hidden');
    lightOverlay.classList.add('fade-in');

    setTimeout(() => {
        // 阶段二：在白屏下切换页面并显示第二页，再让遮罩淡出（白→第二页淡入，连贯）
        doPageSwap();
        lightOverlay.classList.remove('fade-in');
        lightOverlay.classList.add('fade-out');

        setTimeout(() => {
            lightOverlay.classList.remove('fade-out');
            lightOverlay.classList.add('overlay-hidden');
            document.body.classList.remove('is-transitioning');
            const forceScrollTop = () => {
                try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (_) { window.scrollTo(0, 0); }
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            };
            forceScrollTop();
            setTimeout(forceScrollTop, 50);
        }, FADE_IN_MS + 50);
    }, FADE_OUT_MS);
};

const doPageSwap = () => {
    const forceScrollTop = () => {
        try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (_) { window.scrollTo(0, 0); }
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    forceScrollTop();
    introScene.style.display = 'none';
    introScene.classList.add('completed');
    mainContent.classList.add('visible');
    document.body.classList.remove('no-scroll');
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    forceScrollTop();
    requestAnimationFrame(() => { forceScrollTop(); });
    setTimeout(forceScrollTop, 0);
    setTimeout(forceScrollTop, 50);

    const backToHomeEl = document.getElementById('backToHome');
    if (nameText && backToHomeEl) {
        nameText.classList.remove('oval-name');
        nameText.classList.add('nav-main-name');
        nameText.style.transform = '';
        nameText.style.opacity = '';
        backToHomeEl.innerHTML = '';
        backToHomeEl.appendChild(nameText);
    }
};

// ===== Return to first page =====
// 卡顿原因简述：首屏 ShaderGradient(React+WebGL) 在 intro 被 display:none 时仍在后台每帧渲染；
// 返回时 intro 重新 display:block，浏览器要重新排版/合成；且 animateScroll 每帧改写多处
// (contentLayer/portalLayer/nameLayer/sunPortal) 的 style，易触发重排/重绘。与第二页是否
// 为纯色无关。文字不显示原因：contentOpacity = 1 - progress*2，progress > 0.5 时透明度为 0，
// 此前从 0.96 开始返回会导致文案长时间不可见，故改为从 0.45 开始。
const startReturn = () => {
    if (!hasCompleted) return;
    hasCompleted = false;

    // 重置过渡遮罩，下次进入第二页时可再次使用
    document.body.classList.remove('is-transitioning');
    const lightOverlay = document.getElementById('transitionLightOverlay');
    if (lightOverlay) lightOverlay.classList.remove('fade-in', 'fade-out');

    // Move "Yehua Ou" back from nav to name-layer for the return animation (only if name-layer exists)
    const nameEl = document.querySelector('#backToHome .nav-main-name');
    const backToHomeEl = document.getElementById('backToHome');
    if (nameEl && backToHomeEl && nameLayer) {
        nameEl.classList.remove('nav-main-name');
        nameEl.classList.add('oval-name');
        nameEl.id = 'nameText';
        nameEl.style.transform = '';
        nameLayer.appendChild(nameEl);
        const placeholder = document.createElement('span');
        placeholder.className = 'nav-main-name';
        placeholder.textContent = 'Yehua Ou';
        backToHomeEl.appendChild(placeholder);
    }

    document.body.classList.add('no-scroll');
    mainContent.classList.remove('visible');
    introScene.classList.remove('completed');
    introScene.style.display = 'block';

    // 从 progress 0.45 开始返回：此时 contentOpacity = 1 - 0.9 = 0.1，文字已可见，球体也未满屏，减轻穿模且避免「文字迟迟不出现」
    scrollAmount = 0.45;
    targetScroll = 0;
    update3DScene(0.45);

    requestAnimationFrame(animateScroll);
};

// ===== Wheel: 仅首屏控制过渡；进入第二页后滚轮不返回，只能点「Yehua Ou」返回 =====
window.addEventListener('wheel', (e) => {
    if (hasCompleted) return;

    e.preventDefault();
    if (e.deltaY > 0) {
        targetScroll += SCROLL_SENSITIVITY * Math.abs(e.deltaY);
    } else {
        targetScroll -= SCROLL_SENSITIVITY * Math.abs(e.deltaY) * 0.5;
    }
    targetScroll = Math.max(0, Math.min(1, targetScroll));
    requestAnimationFrame(animateScroll);
}, { passive: false });

// ===== Touch =====
let lastTouchY = 0;

window.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (hasCompleted) return;

    const currentY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentY;
    lastTouchY = currentY;
    targetScroll += deltaY * 0.0015;
    targetScroll = Math.max(0, Math.min(1, targetScroll));
    requestAnimationFrame(animateScroll);
    e.preventDefault();
}, { passive: false });

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
    if (hasCompleted) return;
    if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        targetScroll += 0.08;
        targetScroll = Math.min(1, targetScroll);
        requestAnimationFrame(animateScroll);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        targetScroll -= 0.1;
        targetScroll = Math.max(0, targetScroll);
        requestAnimationFrame(animateScroll);
    } else if (e.key === 'Enter') {
        targetScroll = 1;
        requestAnimationFrame(animateScroll);
    }
});

// ===== Back to home (Yehua Ou on second page)：刷新页面，从头开始，避免返回动画卡顿 =====
if (backToHomeBtn) {
    const goToCover = () => {
        window.location.href = window.location.pathname || 'index.html';
    };
    backToHomeBtn.addEventListener('click', goToCover);
    backToHomeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToCover();
        }
    });
}

// ===== Start loop =====
requestAnimationFrame(animateScroll);
update3DScene(0);

// ===== 第二页 Cover 区：第一次滚轮只出字不滚页，出字后再滚才滚页；仅在最顶部且未出字时拦截一次 =====
const coverMotionText = document.getElementById('coverMotionText');
const coverMotionLines = document.querySelectorAll('.cover-motion-text .motion-line');

let coverRevealedLines = 0;
const COVER_REVEAL_COOLDOWN_MS = 520;

function revealNextCoverLine() {
    if (!mainContent.classList.contains('visible') || !coverMotionLines.length) return false;
    if (coverRevealedLines >= coverMotionLines.length) return false;
    const lineEl = coverMotionLines[coverRevealedLines];
    const words = lineEl.querySelectorAll('.motion-word');
    words.forEach((w, i) => { w.style.setProperty('--word-i', String(i)); });
    lineEl.classList.add('revealed');
    coverRevealedLines++;
    return true;
}

let coverRevealCooldownUntil = 0;
function onSecondPageWheel(e) {
    if (!hasCompleted) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollY > 6) return;
    if (e.deltaY <= 0) {
        e.preventDefault();
        return;
    }
    // 在顶部且 Cover 未完全展示时：始终拦截向下滚，避免快速滑动时页面先滑下去再跳回
    if (coverRevealedLines < coverMotionLines.length) {
        e.preventDefault();
        if (Date.now() >= coverRevealCooldownUntil && revealNextCoverLine()) {
            coverRevealCooldownUntil = Date.now() + COVER_REVEAL_COOLDOWN_MS;
        }
    }
}

let coverTouchStartY = 0;
function onSecondPageTouchStart(e) {
    if (!hasCompleted) return;
    coverTouchStartY = e.touches[0].clientY;
}
function onSecondPageTouchMove(e) {
    if (!hasCompleted) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollY > 6) return;
    const y = e.touches[0].clientY;
    const dy = coverTouchStartY - y;
    coverTouchStartY = y;
    if (coverRevealedLines < coverMotionLines.length) {
        if (dy > 20 && Date.now() >= coverRevealCooldownUntil && revealNextCoverLine()) {
            coverRevealCooldownUntil = Date.now() + COVER_REVEAL_COOLDOWN_MS;
        }
        if (dy > 0) e.preventDefault();
    } else if (dy < -5) {
        e.preventDefault();
    }
}

window.addEventListener('wheel', onSecondPageWheel, { passive: false });
window.addEventListener('touchstart', onSecondPageTouchStart, { passive: true });
window.addEventListener('touchmove', onSecondPageTouchMove, { passive: false });

const coverObserver = new MutationObserver(() => {
    if (mainContent.classList.contains('visible')) {
        coverRevealedLines = 0;
        coverRevealCooldownUntil = 0;
        coverMotionLines.forEach(line => line.classList.remove('revealed'));
    }
});
coverObserver.observe(mainContent, { attributes: true, attributeFilter: ['class'] });

// ===== Back to top (second page) =====
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Normal in-page links on second page =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (!hasCompleted) return;
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 从二级分页点「Yehua Ou」进入 index.html#main 时，直接显示第二页（跳过封面）
if (window.location.hash === '#main') {
    hasCompleted = true;
    doPageSwap();
}

console.log('%c👋 Hello!', 'font-size: 24px; font-weight: bold;');
console.log('%cDesigned by Yehua Ou', 'font-size: 14px; color: #888;');
