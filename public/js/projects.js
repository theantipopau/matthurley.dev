function initProjectFilter() {
  const projectFilter = document.getElementById('project-filter');
  if (!projectFilter) return;

  const clearFilter = document.getElementById('clear-project-filter');
  const projectSections = Array.from(document.querySelectorAll('.project-grid'));
  const emptyState = document.getElementById('project-filter-empty');
  const url = new URL(window.location.href);

  const applyProjectFilter = () => {
    const query = projectFilter.value.toLowerCase().trim();
    let visible = 0;

    projectSections.forEach((section) => {
      const card = section.querySelector('.project-card');
      if (!card) return;
      const haystack = ((card.getAttribute('data-project') || '') + ' ' + card.textContent).toLowerCase();
      const matched = query === '' || haystack.includes(query);
      section.style.display = matched ? '' : 'none';
      if (matched) visible += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle('show', visible === 0);
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
  applyProjectFilter();

  if (clearFilter) {
    clearFilter.addEventListener('click', () => {
      projectFilter.value = '';
      applyProjectFilter();
      projectFilter.focus();
    });
  }
}

document.addEventListener('astro:page-load', initProjectFilter);
