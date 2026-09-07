(function(){
  const items=[...document.querySelectorAll('.aas-premium-floater[data-parallax-speed]')];
  if(!items.length) return;

  let scrollY=window.scrollY || 0;
  let pointerY=window.innerHeight*.5;
  let currentScroll=scrollY;
  let currentPointer=pointerY;
  let ticking=false;

  window.addEventListener('scroll',function(){
    scrollY=window.scrollY || 0;
    if(!ticking) requestAnimationFrame(render);
    ticking=true;
  },{passive:true});

  window.addEventListener('pointermove',function(e){
    pointerY=e.clientY;
    if(!ticking) requestAnimationFrame(render);
    ticking=true;
  },{passive:true});

  function render(){
    ticking=false;
    currentScroll += (scrollY-currentScroll)*.10;
    currentPointer += (pointerY-currentPointer)*.08;

    const pointerOffset=(currentPointer-window.innerHeight*.5)*.035;

    items.forEach(function(el,i){
      const speed=parseFloat(el.dataset.parallaxSpeed || .15);
      const scrollOffset=currentScroll*speed;
      const wobble=Math.sin(performance.now()/1500+i*1.7)*4;
      el.style.setProperty('transform',
        'translate3d(0,'+(scrollOffset+pointerOffset+wobble)+'px,0)'
      );
    });

    requestAnimationFrame(render);
  }

  render();
})();