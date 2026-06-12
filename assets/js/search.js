(() => {
  const groupedResults = [
    {
      group: 'PAGES',
      items: [
        'HR Resources',
        'Policy Library',
        'Staff Directory',
        'Announcements',
        'Programs',
        'Employee Essentials',
        'Forms & Documents',
        'IT & Support',
        'Communications',
        'Office Locations'
      ].map((name) => ({ name, category: 'Page', icon: '📄', type: 'emoji' }))
    },
    {
      group: 'TOOLS',
      items: [
        { name: 'CityTime', favicon: 'https://www.nyc.gov/favicon.ico' },
        { name: 'ServiceNow', favicon: 'https://www.servicenow.com/favicon.ico' },
        { name: 'ESS (Employee Self Service)', favicon: 'https://www.nyc.gov/favicon.ico' },
        { name: 'NYCERS', favicon: 'https://www.nycers.org/favicon.ico' },
        { name: 'Payroll Portal', favicon: 'https://www.nyc.gov/favicon.ico' }
      ].map((item) => ({ ...item, category: 'Tool', icon: '🔧', type: 'favicon' }))
    },
    {
      group: 'PEOPLE',
      items: [
        { name: 'Sandra Escamilla-Davies', title: 'Commissioner' },
        { name: 'Esteban Alvarado-Jimenez', title: "College Aide – Chief of Staff's Office" },
        { name: 'Chuck', title: 'IT Support' },
        { name: 'Maria Torres', title: 'HR Director' },
        { name: 'James Reyes', title: 'Budget Analyst' },
        { name: 'Lisa Chen', title: 'Program Coordinator' }
      ].map((item) => ({ ...item, category: 'People', icon: '👤', type: 'emoji' }))
    }
  ];

  const ensureStyles = () => {
    if (document.getElementById('instant-search-styles')) return;
    const style = document.createElement('style');
    style.id = 'instant-search-styles';
    style.textContent = `
      .instant-search-wrap { position: relative; }
      .instant-search-dropdown {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        width: 100%;
        max-height: 340px;
        overflow-y: auto;
        background: white;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        z-index: 9999;
        padding: 8px 0;
        color: #1d2433;
      }
      .instant-search-group-label {
        padding: 8px 14px 5px;
        color: #8a8a8a;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
      }
      .instant-search-result {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        gap: 10px;
        align-items: center;
        width: 100%;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        padding: 9px 14px;
        text-align: left;
        font: inherit;
      }
      .instant-search-result:hover,
      .instant-search-result:focus { background: #f5f5f5; outline: none; }
      .instant-search-icon {
        width: 24px;
        height: 24px;
        display: inline-grid;
        place-items: center;
        font-size: 1.05rem;
      }
      .instant-search-icon img { width: 24px; height: 24px; object-fit: contain; display: block; }
      .instant-search-name { display: block; font-weight: 800; line-height: 1.15; }
      .instant-search-subtitle { display: block; margin-top: 3px; color: #777; font-size: 0.82rem; line-height: 1.2; }
      .instant-search-empty { padding: 14px; color: #777; font-size: 0.9rem; }
    `;
    document.head.appendChild(style);
  };

  const getSearchInputs = () => {
    const inputs = new Set(document.querySelectorAll('[data-search-input]'));
    document.querySelectorAll('form[role="search"] input[type="search"], .search-form input[type="search"]').forEach((input) => {
      const label = `${input.getAttribute('aria-label') || ''} ${input.placeholder || ''}`.toLowerCase();
      if (label.includes('search intranet')) inputs.add(input);
    });
    return Array.from(inputs);
  };

  const matchesQuery = (item, query) => {
    const haystack = [item.name, item.category, item.title].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(query);
  };

  const createIcon = (item) => {
    const icon = document.createElement('span');
    icon.className = 'instant-search-icon';
    if (item.type === 'favicon') {
      const img = document.createElement('img');
      img.src = item.favicon;
      img.alt = '';
      img.width = 24;
      img.height = 24;
      img.addEventListener('error', () => {
        icon.textContent = item.icon;
      }, { once: true });
      icon.appendChild(img);
    } else {
      icon.textContent = item.icon;
    }
    return icon;
  };

  const initInstantSearch = (input) => {
    const container = input.closest('form') || input.parentElement;
    if (!container || container.dataset.instantSearchReady === 'true') return;
    container.dataset.instantSearchReady = 'true';
    container.classList.add('instant-search-wrap');

    const dropdown = document.createElement('div');
    dropdown.className = 'instant-search-dropdown';
    dropdown.hidden = true;
    container.appendChild(dropdown);

    const close = () => { dropdown.hidden = true; };

    const render = () => {
      const query = input.value.trim().toLowerCase();
      dropdown.replaceChildren();
      if (query.length < 2) {
        close();
        return;
      }

      let matchCount = 0;
      groupedResults.forEach(({ group, items }) => {
        const matches = items.filter((item) => matchesQuery(item, query));
        if (!matches.length) return;
        matchCount += matches.length;

        const label = document.createElement('div');
        label.className = 'instant-search-group-label';
        label.textContent = group;
        dropdown.appendChild(label);

        matches.forEach((item) => {
          const row = document.createElement('button');
          row.className = 'instant-search-result';
          row.type = 'button';
          row.appendChild(createIcon(item));

          const text = document.createElement('span');
          const name = document.createElement('span');
          name.className = 'instant-search-name';
          name.textContent = item.name;
          const subtitle = document.createElement('span');
          subtitle.className = 'instant-search-subtitle';
          subtitle.textContent = item.title || item.category;
          text.append(name, subtitle);
          row.appendChild(text);

          row.addEventListener('click', () => {
            input.value = item.name;
            close();
          });
          dropdown.appendChild(row);
        });
      });

      if (!matchCount) {
        const empty = document.createElement('div');
        empty.className = 'instant-search-empty';
        empty.textContent = 'No results found';
        dropdown.appendChild(empty);
      }
      dropdown.hidden = false;
    };

    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
    document.addEventListener('click', (event) => {
      if (!container.contains(event.target)) close();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureStyles();
    getSearchInputs().forEach(initInstantSearch);
  });
})();
