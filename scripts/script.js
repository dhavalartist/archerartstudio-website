const toggle = document.querySelector('.aas-menu-toggle');
const menu = document.querySelector('.aas-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('.aas-menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}


/* Services dropdown — close when clicking outside */
document.addEventListener('click', (event) => {
  document.querySelectorAll('.aas-nav-dropdown[open]').forEach(dropdown => {
    if (!dropdown.contains(event.target)) {
      dropdown.removeAttribute('open');
    }
  });
});


/* Services dropdown — close with Escape */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.aas-nav-dropdown[open]').forEach(dropdown => {
      dropdown.removeAttribute('open');
    });
  }
});


/* Portfolio filters */
const buttons = document.querySelectorAll('.aas-filters button');
const projects = document.querySelectorAll('.aas-project');

buttons.forEach(btn => btn.addEventListener('click', () => {
  buttons.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  const f = btn.dataset.filter;

  projects.forEach(p => {
    p.classList.toggle(
      'is-hidden',
      f !== 'all' && p.dataset.type !== f
    );
  });
}));