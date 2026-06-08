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
