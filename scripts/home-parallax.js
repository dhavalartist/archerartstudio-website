(function(){
  const items=[...document.querySelectorAll('.aas-home-float[data-home-parallax]')];
  if(!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf=0;
  function render(){
    raf=0;
    const y=window.scrollY;
    items.forEach(el=>{
      const speed=parseFloat(el.dataset.homeParallax||0);
      el.style.transform=`translate3d(0,${y*speed}px,0)`;
    });
  }
  function request(){if(!raf)raf=requestAnimationFrame(render)}
  window.addEventListener('scroll',request,{passive:true});
  render();
})();