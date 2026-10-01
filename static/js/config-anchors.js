// Adds a small anchor link to every row of the configuration options tables,
// so each option can be linked to and shared directly.
(function () {
  'use strict';

  function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var containers = document.querySelectorAll('.config-options');
    if (!containers.length) {
      return;
    }

    var used = Object.create(null);
    var currentRow = null;

    // Keep a single option highlighted: the one currently linked to via the
    // anchor. It stays lit until another option is visited, so it remains
    // visible after the page finishes scrolling to it.
    function setCurrent(row) {
      if (currentRow === row) {
        return;
      }
      if (currentRow) {
        currentRow.classList.remove('config-anchor-current');
      }
      currentRow = row;
      if (row) {
        row.classList.add('config-anchor-current');
      }
    }

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(ta);
      return ok;
    }

    function copy(text, link) {
      var confirmCopied = function () {
        link.classList.add('config-anchor--copied');
        setTimeout(function () {
          link.classList.remove('config-anchor--copied');
        }, 1500);
      };
      // Only confirm when the copy actually succeeded, so we never claim
      // "Copied!" if the clipboard write was blocked or unsupported.
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(confirmCopied, function () {
          if (fallbackCopy(text)) {
            confirmCopied();
          }
        });
      } else if (fallbackCopy(text)) {
        confirmCopied();
      }
    }

    containers.forEach(function (container) {
      var rows = container.querySelectorAll('table tbody tr');
      Array.prototype.forEach.call(rows, function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length < 2) {
          return;
        }

        // Prefer the config-file name; fall back to the env var (minus the ND_ prefix)
        // for rows that only have an environment variable (config column shows "-").
        var match = cells[0].textContent.trim().match(/^[A-Za-z0-9._]+/);
        var base = match ? match[0] : cells[1].textContent.trim().replace(/^ND_/i, '');
        if (!base) {
          return;
        }

        var id = 'opt-' + slugify(base);
        if (used[id]) {
          used[id] += 1;
          id = id + '-' + used[id];
        } else {
          used[id] = 1;
        }
        row.id = id;

        var link = document.createElement('a');
        link.className = 'config-anchor';
        link.href = '#' + id;
        link.title = 'Copy link to this option';
        link.setAttribute('aria-label', 'Copy link to this option');
        link.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i>';

        link.addEventListener('click', function (e) {
          e.preventDefault();
          var url =
            window.location.origin + window.location.pathname + window.location.search + '#' + id;
          if (window.location.hash === '#' + id) {
            setCurrent(row);
          } else {
            window.location.hash = id;
          }
          copy(url, link);
        });

        cells[0].appendChild(document.createTextNode(' '));
        cells[0].appendChild(link);
      });
    });

    function scrollToHash() {
      if (!window.location.hash) {
        setCurrent(null);
        return;
      }
      var el = document.getElementById(window.location.hash.slice(1));
      if (el && el.matches('.config-options tbody tr')) {
        el.scrollIntoView({ block: 'start' });
        setCurrent(el);
      } else {
        setCurrent(null);
      }
    }

    window.addEventListener('hashchange', scrollToHash);
    // Handle a hash present on initial load (IDs are assigned above, after the
    // browser's own anchor scroll has already run and found nothing).
    scrollToHash();
  });
})();
