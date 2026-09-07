(function(){
  const items=[...document.querySelectorAll('.aas-case-floaters [data-parallax]')];
  if(!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let raf=0, scrollY=window.scrollY;
  function render(){
    raf=0;
    const y=window.scrollY;
    items.forEach(el=>{
      const speed=parseFloat(el.dataset.parallax||0);
      const rect=el.parentElement.getBoundingClientRect();
      const local=(window.innerHeight/2-(rect.top+rect.height/2))*speed;
      el.style.transform=`translate3d(0,${local}px,0)`;
    });
  }
  function request(){ if(!raf) raf=requestAnimationFrame(render); }
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request,{passive:true});
  render();
})();