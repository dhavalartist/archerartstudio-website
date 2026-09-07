(function(){
  const root=document.documentElement;
  const body=document.body;
  const toggle=document.querySelector('.aas-style-toggle-switch');
  if(!toggle) return;

  function isDarkSchedule(){
    const h=new Date().getHours();
    return h>=18;
  }

  function setTheme(dark, announce){
    body.classList.toggle('dark-mode', dark);
    root.classList.toggle('dark-mode', dark);
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if(announce) toggle.setAttribute('data-theme-change', Date.now());
  }

  // On every page load, follow the requested automatic schedule.
  setTheme(isDarkSchedule(), false);

  // Manual toggle remains available, while the next scheduled boundary
  // restores the automatic state.
  toggle.addEventListener('click', function(){
    setTheme(!body.classList.contains('dark-mode'), true);
  });

  // Check frequently enough to catch 18:00 and 00:00 without requiring refresh.
  let lastSchedule=isDarkSchedule();
  setInterval(function(){
    const scheduled=isDarkSchedule();
    if(scheduled!==lastSchedule){
      lastSchedule=scheduled;
      setTheme(scheduled, true);
    }
  }, 30000);
})();