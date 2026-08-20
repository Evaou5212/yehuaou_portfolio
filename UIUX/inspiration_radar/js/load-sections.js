(function () {
  var container = document.getElementById('wpSections');
  if (!container) return;

  var sections = [
    'overview',
    'product-link',
    'problem-statement',
    'pivot',
    'criteria',
    'system',
    'experience',
    'key-features',
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
