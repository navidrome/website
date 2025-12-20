/**
 * App Filters - Client-side filtering and search for the /apps page
 */
(function() {
  'use strict';

  // DOM element cache
  let elements = {};
  let totalApps = 0;

  /**
   * Initialize the filtering functionality
   */
  function init() {
    // Only run on apps page
    const appsGrid = document.querySelector('.apps-grid');
    if (!appsGrid) return;

    // Cache all DOM elements
    elements = {
      cards: document.querySelectorAll('.app-card'),
      searchInput: document.getElementById('app-search'),
      platformCheckboxes: document.querySelectorAll('input[name="platform"]'),
      apiCheckboxes: document.querySelectorAll('input[name="api"]'),
      ossCheckbox: document.getElementById('filter-oss'),
      clearButton: document.getElementById('clear-filters'),
      resultsCount: document.getElementById('results-count'),
      emptyState: document.getElementById('empty-state'),
      filterToggle: document.getElementById('filter-toggle'),
      filterPanel: document.getElementById('filter-panel'),
      filterCount: document.querySelector('.filter-count')
    };

    totalApps = elements.cards.length;

    // Apply initial filters from URL
    const urlState = parseURL();
    applyURLState(urlState);

    // Bind event listeners
    bindEvents();
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    // Search input with debouncing
    let searchTimeout;
    elements.searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        applyFilters();
      }, 300);
    });

    // Platform checkboxes
    elements.platformCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', applyFilters);
    });

    // API checkboxes
    elements.apiCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', applyFilters);
    });

    // OSS checkbox
    if (elements.ossCheckbox) {
      elements.ossCheckbox.addEventListener('change', applyFilters);
    }

    // Clear all button
    elements.clearButton.addEventListener('click', clearFilters);

    // Mobile filter toggle
    if (elements.filterToggle) {
      elements.filterToggle.addEventListener('click', toggleFilterPanel);
    }

    // Keyboard: Escape to close mobile filter panel
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && window.innerWidth <= 768) {
        if (elements.filterPanel.classList.contains('filter-panel--expanded')) {
          toggleFilterPanel();
        }
      }
    });
  }

  /**
   * Apply all active filters to the app cards
   */
  function applyFilters() {
    // Get current filter state
    const searchQuery = elements.searchInput.value.toLowerCase().trim();
    const selectedPlatforms = getCheckedValues(elements.platformCheckboxes);
    const selectedAPIs = getCheckedValues(elements.apiCheckboxes);
    const ossOnly = elements.ossCheckbox ? elements.ossCheckbox.checked : false;

    let visibleCount = 0;

    // Filter each app card
    elements.cards.forEach(card => {
      let matches = true;

      // Platform filter (OR logic within category)
      if (selectedPlatforms.length > 0) {
        const cardPlatforms = (card.dataset.platforms || '').split(' ');
        const hasMatchingPlatform = selectedPlatforms.some(platform => 
          cardPlatforms.includes(platform)
        );
        matches = matches && hasMatchingPlatform;
      }

      // API filter (OR logic within category)
      if (matches && selectedAPIs.length > 0) {
        const cardAPIs = (card.dataset.apis || '').split(' ');
        const hasMatchingAPI = selectedAPIs.some(api => 
          cardAPIs.includes(api)
        );
        matches = matches && hasMatchingAPI;
      }

      // OSS filter (AND logic)
      if (matches && ossOnly) {
        matches = card.dataset.oss === 'true';
      }

      // Search filter (AND logic, substring match in searchable text)
      if (matches && searchQuery) {
        const searchable = card.dataset.searchable || '';
        matches = searchable.includes(searchQuery);
      }

      // Toggle visibility
      if (matches) {
        card.classList.remove('app-card--hidden');
        visibleCount++;
      } else {
        card.classList.add('app-card--hidden');
      }
    });

    // Update UI feedback
    updateResultsCount(visibleCount);
    updateURL();
  }

  /**
   * Get checked values from a checkbox group
   */
  function getCheckedValues(checkboxes) {
    return Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
  }

  /**
   * Update the results count display
   */
  function updateResultsCount(visibleCount) {
    if (visibleCount === 0) {
      elements.resultsCount.parentElement.style.display = 'none';
      elements.emptyState.style.display = 'block';
    } else {
      elements.resultsCount.parentElement.style.display = 'block';
      elements.emptyState.style.display = 'none';
      
      if (visibleCount === totalApps) {
        elements.resultsCount.textContent = `Showing all ${totalApps} apps`;
      } else {
        elements.resultsCount.textContent = `Showing ${visibleCount} of ${totalApps} apps`;
      }
    }

    // Update mobile toggle button count
    if (elements.filterCount) {
      elements.filterCount.textContent = visibleCount;
    }
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    // Clear search
    elements.searchInput.value = '';

    // Uncheck all checkboxes
    elements.platformCheckboxes.forEach(cb => cb.checked = false);
    elements.apiCheckboxes.forEach(cb => cb.checked = false);
    if (elements.ossCheckbox) {
      elements.ossCheckbox.checked = false;
    }

    // Apply filters (will show all apps)
    applyFilters();

    // Focus search input for better UX
    elements.searchInput.focus();
  }

  /**
   * Toggle mobile filter panel visibility
   */
  function toggleFilterPanel() {
    const isExpanded = elements.filterPanel.classList.contains('filter-panel--expanded');
    
    if (isExpanded) {
      elements.filterPanel.classList.remove('filter-panel--expanded');
      elements.filterToggle.setAttribute('aria-expanded', 'false');
      elements.filterToggle.innerHTML = `<i class="fas fa-filter"></i> Filter & Search (<span class="filter-count">${elements.filterCount.textContent}</span> apps)`;
    } else {
      elements.filterPanel.classList.add('filter-panel--expanded');
      elements.filterToggle.setAttribute('aria-expanded', 'true');
      elements.filterToggle.innerHTML = '<i class="fas fa-times"></i> Hide Filters';
    }
  }

  /**
   * Parse URL parameters into filter state
   */
  function parseURL() {
    const params = new URLSearchParams(window.location.search);
    
    return {
      platforms: params.has('platform') ? params.get('platform').split(',') : [],
      apis: params.has('api') ? params.get('api').split(',') : [],
      oss: params.get('oss') === 'true',
      search: params.get('q') || ''
    };
  }

  /**
   * Apply filter state from URL
   */
  function applyURLState(state) {
    // Set search input
    if (state.search) {
      elements.searchInput.value = state.search;
    }

    // Check platform checkboxes
    state.platforms.forEach(platform => {
      const checkbox = Array.from(elements.platformCheckboxes).find(cb => cb.value === platform);
      if (checkbox) checkbox.checked = true;
    });

    // Check API checkboxes
    state.apis.forEach(api => {
      const checkbox = Array.from(elements.apiCheckboxes).find(cb => cb.value === api);
      if (checkbox) checkbox.checked = true;
    });

    // Set OSS checkbox
    if (elements.ossCheckbox && state.oss) {
      elements.ossCheckbox.checked = true;
    }

    // Apply filters immediately
    applyFilters();
  }

  /**
   * Update URL with current filter state
   */
  function updateURL() {
    const params = new URLSearchParams();

    // Add platform params
    const selectedPlatforms = getCheckedValues(elements.platformCheckboxes);
    if (selectedPlatforms.length > 0) {
      params.set('platform', selectedPlatforms.join(','));
    }

    // Add API params
    const selectedAPIs = getCheckedValues(elements.apiCheckboxes);
    if (selectedAPIs.length > 0) {
      params.set('api', selectedAPIs.join(','));
    }

    // Add OSS param
    if (elements.ossCheckbox && elements.ossCheckbox.checked) {
      params.set('oss', 'true');
    }

    // Add search param
    const searchQuery = elements.searchInput.value.trim();
    if (searchQuery) {
      params.set('q', searchQuery);
    }

    // Update URL without reload
    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    window.history.pushState({}, '', newURL);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
