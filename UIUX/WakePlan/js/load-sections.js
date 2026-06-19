(function () {
  var container = document.getElementById('wpSections');
  if (!container) return;

  var sections = [
    'overview',
    'product-link',
    'full-video',
    'problem-statement',
    'challenge',
    'key-insight',
    'design-goals',
    'solution',
    'key-feature-01',
    'key-feature-02',
    'key-feature-03',
    'key-feature-04',
    'comparison',
    'user-flow',
    'design-philosophy',
    'ai-development',
    'reflection'
  ];

  Promise.all(
    sections.map(function (name) {
      return fetch('sections/' + name + '.html').then(function (res) {
        if (!res.ok) throw new Error('Failed to load section: ' + name);
        return res.text();
      });
    })
  )
    .then(function (htmlParts) {
      container.innerHTML = htmlParts.join('');
      document.dispatchEvent(new CustomEvent('wp-sections-loaded'));
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML =
        '<p class="wp-prose" style="padding:2rem 0">Unable to load page sections. Please serve this page through a local server.</p>';
    });
})();
