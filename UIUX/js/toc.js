(function () {
  function initToc(tocId) {
    var links = document.querySelectorAll('#' + tocId + ' a');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ link: a, el: el });
    });
    if (!sections.length) return;

    var wrap = document.getElementById('page-scroll-wrap');
    var toc = document.getElementById(tocId);

    function onScroll() {
      var anchor = 150;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.el.getBoundingClientRect().top <= anchor) current = s;
      });
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (current) {
        current.link.classList.add('is-active');
        if (window.innerWidth < 768 && toc) {
          var linkLeft = current.link.offsetLeft;
          var linkWidth = current.link.offsetWidth;
          var tocWidth = toc.clientWidth;
          var targetScroll = linkLeft - (tocWidth - linkWidth) / 2;
          toc.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
        }
      }
    }

    (wrap || window).addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  window.initProjectToc = initToc;
})();
