function initWritingFilter() {
  const writingFilter = document.getElementById('writing-filter');
  if (!writingFilter) return;

  const clearWritingFilter = document.getElementById('clear-writing-filter');
  const writingCards = Array.from(document.querySelectorAll('.article-card'));
  const emptyWritingState = document.getElementById('writing-filter-empty');
  const writingUrl = new URL(window.location.href);

  const applyWritingFilter = () => {
    const query = writingFilter.value.toLowerCase().trim();
    let visible = 0;

    writingCards.forEach((card) => {
      const haystack = ((card.getAttribute('data-writing') || '') + ' ' + card.textContent).toLowerCase();
      const matched = query === '' || haystack.includes(query);
      card.style.display = matched ? '' : 'none';
      if (matched) visible += 1;
    });

    if (emptyWritingState) {
      emptyWritingState.classList.toggle('show', visible === 0);
    }

    if (query) {
      writingUrl.searchParams.set('q', query);
    } else {
      writingUrl.searchParams.delete('q');
    }
    window.history.replaceState({}, '', writingUrl.toString());
  };

  const existingQuery = writingUrl.searchParams.get('q');
  if (existingQuery) {
    writingFilter.value = existingQuery;
  }
  writingFilter.addEventListener('input', applyWritingFilter);
  applyWritingFilter();

  if (clearWritingFilter) {
    clearWritingFilter.addEventListener('click', () => {
      writingFilter.value = '';
      applyWritingFilter();
      writingFilter.focus();
    });
  }
}

document.addEventListener('astro:page-load', initWritingFilter);
