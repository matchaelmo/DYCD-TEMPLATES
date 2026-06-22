(() => {
  const names = ['Intranet', 'Juventus', 'The Hub', 'Juventud', 'The Yard'];
  const setName = (name) => {
    document.querySelectorAll('[data-intranet-name]').forEach((el) => { el.textContent = name; });
    document.querySelectorAll('[data-intranet-heading]').forEach((el) => { el.textContent = name; });
    document.querySelectorAll('[data-name-trigger]').forEach((el) => { el.textContent = `${name} ▼`; });
    if (document.body.classList.contains('home-page')) {
      document.title = `DYCD ${name} | Internal Design Exploration`;
    }
  };

  document.querySelectorAll('[data-name-switcher]').forEach((switcher) => {
    const trigger = switcher.querySelector('[data-name-trigger]');
    trigger?.addEventListener('click', (event) => {
      event.stopPropagation();
      switcher.classList.toggle('is-open');
    });
    switcher.querySelectorAll('[data-name-option]').forEach((option) => {
      option.addEventListener('click', () => {
        setName(option.dataset.nameOption);
        switcher.classList.remove('is-open');
      });
    });
  });

  document.querySelectorAll('[data-resources-menu]').forEach((menu) => {
    const trigger = menu.querySelector('.resources-trigger');
    trigger?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      menu.classList.toggle('is-open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('[data-name-switcher], [data-resources-menu]').forEach((el) => el.classList.remove('is-open'));
  });


  document.querySelectorAll('[data-nav-search]').forEach((form) => {
    const toggle = form.querySelector('[data-search-toggle]');
    const input = form.querySelector('[data-search-input]');
    toggle?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.toggle('is-open');
      if (form.classList.contains('is-open')) input?.focus();
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = (input?.value || '').trim();
      if (query) {
        const prefix = form.dataset.searchPrefix || '';
        window.location.href = `${prefix}search.html?q=${encodeURIComponent(query).replace(/%20/g, '+')}`;
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('q') || '';
  document.querySelectorAll('[data-query-output]').forEach((el) => { el.textContent = searchQuery || 'all intranet content'; });
  document.querySelectorAll('[data-query-input]').forEach((el) => { el.value = searchQuery; });


  document.querySelectorAll('[data-contemporary-news]').forEach((shell) => {
    const tab = shell.querySelector('[data-news-tab]');
    const close = shell.querySelector('[data-news-close]');
    const toggle = (event) => {
      event?.stopPropagation();
      shell.classList.toggle('is-open');
    };
    tab?.addEventListener('click', toggle);
    close?.addEventListener('click', (event) => {
      event.stopPropagation();
      shell.classList.remove('is-open');
    });
    document.addEventListener('click', (event) => {
      if (!shell.contains(event.target)) shell.classList.remove('is-open');
    });
  });

  document.querySelectorAll('[data-live-feed]').forEach((shell) => {
    const toggle = shell.querySelector('[data-live-toggle]');
    const modal = shell.querySelector('[data-live-modal]');
    const close = shell.querySelector('[data-live-close]');
    const openFeed = () => {
      if (!modal) return;
      modal.hidden = false;
      shell.classList.add('is-open');
      toggle?.setAttribute('aria-expanded', 'true');
      close?.focus();
    };
    const closeFeed = () => {
      if (!modal) return;
      modal.hidden = true;
      shell.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.focus();
    };
    toggle?.addEventListener('click', (event) => {
      event.stopPropagation();
      openFeed();
    });
    close?.addEventListener('click', closeFeed);
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) closeFeed();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal?.hidden) closeFeed();
    });
  });

  const counters = document.querySelectorAll('.kpi-number[data-count]');
  const formatValue = (value) => value >= 1000 ? `${value.toLocaleString()}+` : `${value}+`;
  const animateCounter = (el) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const duration = document.body.classList.contains('visual') ? 900 : 1100;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (document.body.classList.contains('visual')) {
    counters.forEach(animateCounter);
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach((counter) => observer.observe(counter));
  }
})();

(() => {
  const glossarySearch = document.querySelector('[data-glossary-search]');
  const glossaryCards = Array.from(document.querySelectorAll('.glossary-card'));
  const glossaryEmpty = document.querySelector('[data-glossary-empty]');
  let activeLetter = 'all';

  const filterGlossary = () => {
    const query = (glossarySearch?.value || '').trim().toLowerCase();
    let visible = 0;
    glossaryCards.forEach((card) => {
      const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
      const matchesLetter = activeLetter === 'all' || card.dataset.letter === activeLetter;
      const show = matchesQuery && matchesLetter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (glossaryEmpty) glossaryEmpty.hidden = visible !== 0;
  };

  document.querySelectorAll('[data-letter]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      activeLetter = button.dataset.letter || 'all';
      document.querySelectorAll('[data-letter]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      filterGlossary();
      if (activeLetter !== 'all') document.querySelector('.glossary-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  glossarySearch?.addEventListener('input', filterGlossary);

  const filterButtons = document.querySelectorAll('[data-media-filter]');
  const mediaCards = document.querySelectorAll('.media-card');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.mediaFilter || 'All';
      filterButtons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      mediaCards.forEach((card) => { card.hidden = category !== 'All' && card.dataset.category !== category; });
    });
  });

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxTitle = document.querySelector('[data-lightbox-title]');
  const lightboxKind = document.querySelector('[data-lightbox-kind]');
  const closeLightbox = () => { if (lightbox) lightbox.hidden = true; };
  const openLightbox = (card) => {
    if (!lightbox) return;
    if (lightboxTitle) lightboxTitle.textContent = card.dataset.title || '';
    if (lightboxKind) lightboxKind.textContent = card.dataset.kind === 'video' ? '▶ Video Coming Soon' : 'Photo Coming Soon';
    lightbox.hidden = false;
  };
  mediaCards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });
  document.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
})();
