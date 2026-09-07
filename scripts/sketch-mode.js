(function(){
  const root=document.documentElement;
  const toggle=document.querySelector('#aas-styletoggle');
  if(!toggle)return;
  const button=toggle.querySelector('.aas-style-toggle-switch');
  function setMode(sketch,save){
    root.classList.toggle('sketch-mode',sketch);
    button.setAttribute('aria-pressed',String(sketch));
    button.setAttribute('aria-label',sketch?'Switch to final mode':'Switch to sketch mode');
    if(save)localStorage.setItem('archer-style-mode',sketch?'sketch':'final');
  }
  setMode(localStorage.getItem('archer-style-mode')==='sketch',false);
  button.addEventListener('click',()=>setMode(!root.classList.contains('sketch-mode'),true));
})();