// 404 page: show the address the visitor asked for, and suggest the pages that
// do exist. Docsy's own search widget renders into a floating popover, so this
// queries Lunr directly and lists the matches inline instead.
document.addEventListener('DOMContentLoaded', function () {
  var pathEl = document.getElementById('nd-404-path');

  var path = window.location.pathname;
  try {
    path = decodeURIComponent(path);
  } catch (e) {
    // Leave a malformed escape sequence as-is.
  }
  if (pathEl) {
    pathEl.textContent = path;
  }

  // The search block is only rendered when offline search is enabled.
  var input = document.getElementById('nd-404-input');
  if (!input || typeof lunr === 'undefined') {
    return;
  }

  var title = document.getElementById('nd-404-results-title');
  var list = document.getElementById('nd-404-results-list');
  var empty = document.getElementById('nd-404-results-empty');

  var MAX_RESULTS = 6;
  var DEBOUNCE_MS = 150;

  // Words that say nothing about what the visitor wanted.
  var skip = { docs: 1, en: 1, index: 1, html: 1, htm: 1, php: 1, json: 1, xml: 1, www: 1 };

  input.value = path
    .split(/[^a-zA-Z0-9]+/)
    .map(function (part) {
      return part.toLowerCase();
    })
    .filter(function (part) {
      return part.length > 2 && part.length <= 24 && !skip[part];
    })
    .filter(function (part, i, all) {
      return all.indexOf(part) === i;
    })
    .slice(0, 4)
    .join(' ');

  var idx = null;
  var pages = {};

  var search = function (query) {
    return idx
      .query(function (q) {
        lunr.tokenizer(query.toLowerCase()).forEach(function (token) {
          var term = token.toString();
          q.term(term, { boost: 100 });
          q.term(term, {
            wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
            boost: 10
          });
          q.term(term, { editDistance: 2 });
        });
      })
      .slice(0, MAX_RESULTS);
  };

  var entry = function (ref) {
    var page = pages[ref] || {};
    var item = document.createElement('li');

    var link = document.createElement('a');
    link.href = ref;
    link.textContent = page.title || ref;
    item.appendChild(link);

    if (page.excerpt) {
      var excerpt = document.createElement('p');
      excerpt.textContent = page.excerpt;
      item.appendChild(excerpt);
    }

    return item;
  };

  var render = function () {
    var query = input.value.trim();
    list.textContent = '';

    if (!idx || query === '') {
      title.hidden = list.hidden = empty.hidden = true;
      return;
    }

    var found = search(query);

    if (found.length === 0) {
      title.textContent = 'No matching pages';
      empty.textContent = 'Nothing here matches “' + query + '”. Try the links below.';
      list.hidden = true;
      title.hidden = empty.hidden = false;
      return;
    }

    title.textContent = 'Did you mean?';
    found.forEach(function (result) {
      list.appendChild(entry(result.ref));
    });
    empty.hidden = true;
    title.hidden = list.hidden = false;
  };

  // Each query runs wildcard and edit-distance terms, so wait for a pause in
  // typing rather than searching on every keystroke.
  var pending = null;
  input.addEventListener('input', function () {
    clearTimeout(pending);
    pending = setTimeout(render, DEBOUNCE_MS);
  });

  fetch(input.dataset.searchIndexSrc)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      idx = lunr(function () {
        this.ref('ref');
        this.field('title', { boost: 5 });
        this.field('categories', { boost: 3 });
        this.field('tags', { boost: 3 });
        this.field('description', { boost: 2 });
        this.field('body');

        data.forEach(function (page) {
          this.add(page);
          pages[page.ref] = { title: page.title, excerpt: page.excerpt };
        }, this);
      });
      render();
    })
    .catch(function () {
      // Without the index the browse links still work.
    });
});
