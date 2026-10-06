// Project filtering: keyword search + category chips.
// Applies to both the case-study sections (.project-grid) and the
// "Also Shipped" spotlight cards, with a shared empty state.

function initProjectFilter() {
  const projectFilter = document.getElementById('project-filter');
  if (!projectFilter) return;

  const clearFilter = document.getElementById('clear-project-filter');
  const chips = Array.from(document.querySelectorAll('.chip[data-chip]'));
  const projectSections = Array.from(document.querySelectorAll('.project-grid'));
  const spotlightItems = Array.from(document.querySelectorAll('.spotlight-project'));
  const spotlightSection = document.getElementById('also-shipped');
  const emptyState = document.getElementById('project-filter-empty');
  const url = new URL(window.location.href);

  let activeCategory = 'all';

  const matches = (textEl, query, category, categoryEl = textEl) => {
    const categories = (categoryEl.getAttribute('data-category') || '').split(/\s+/).filter(Boolean);
    const categoryOk = category === 'all' || categories.includes(category);
    if (!categoryOk) return false;
    if (!query) return true;
    const haystack = ((textEl.getAttribute('data-project') || '') + ' ' + textEl.textContent).toLowerCase();
    return haystack.includes(query);
  };

  const applyProjectFilter = () => {
    const query = projectFilter.value.toLowerCase().trim();
    let visible = 0;

    projectSections.forEach((section) => {
      const card = section.querySelector('.project-card');
      if (!card) return;
      const matched = matches(card, query, activeCategory, section);
      section.style.display = matched ? '' : 'none';
      if (matched) visible += 1;
    });

    // Hide a group heading entirely when every case study under it is filtered out.
    document.querySelectorAll('main .section').forEach((group) => {
      const grids = Array.from(group.querySelectorAll(':scope > .project-grid'));
      if (!grids.length) return;
      const anyVisible = grids.some((grid) => grid.style.display !== 'none');
      group.style.display = anyVisible ? '' : 'none';
    });

    let visibleSpotlights = 0;
    spotlightItems.forEach((item) => {
      const matched = matches(item, query, activeCategory);
      item.style.display = matched ? '' : 'none';
      if (matched) visibleSpotlights += 1;
    });

    if (spotlightSection) {
      spotlightSection.style.display = visibleSpotlights > 0 ? '' : 'none';
    }

    if (emptyState) {
      emptyState.classList.toggle('show', visible === 0 && visibleSpotlights === 0);
    }

    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const existingQuery = url.searchParams.get('q');
  if (existingQuery) {
    projectFilter.value = existingQuery;
  }
  projectFilter.addEventListener('input', applyProjectFilter);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCategory = chip.getAttribute('data-chip') || 'all';
      chips.forEach((other) => {
        other.setAttribute('aria-pressed', String(other === chip));
      });
      applyProjectFilter();
    });
  });

  if (clearFilter) {
    clearFilter.addEventListener('click', () => {
      projectFilter.value = '';
      activeCategory = 'all';
      chips.forEach((chip) => {
        chip.setAttribute('aria-pressed', String(chip.getAttribute('data-chip') === 'all'));
      });
      applyProjectFilter();
      projectFilter.focus();
    });
  }

  applyProjectFilter();
}

document.addEventListener('astro:page-load', initProjectFilter);
