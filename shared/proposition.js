// Comportements communs aux propositions : en-tête au scroll, apparitions, parallaxe, inclinaison au pointeur, compteurs.
(()=>{
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const hdr=document.querySelector('[data-hdr]');
const onScroll=()=>hdr&&hdr.classList.toggle('is-scrolled',scrollY>40);
onScroll();addEventListener('scroll',onScroll,{passive:true});

const rv=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  rv.forEach(el=>io.observe(el));
}else rv.forEach(el=>el.classList.add('in'));

// Compteurs animés
const counters=document.querySelectorAll('[data-count]');
if(counters.length&&'IntersectionObserver' in window&&!reduce){
  const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);
    const el=e.target,end=parseInt(el.dataset.count,10),t0=performance.now(),dur=1600;
    const tick=t=>{const p=Math.min(1,(t-t0)/dur),v=1-Math.pow(1-p,4);el.textContent=Math.round(end*v);if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}),{threshold:.6});
  counters.forEach(c=>{c.textContent='0';co.observe(c);});
}

if(!reduce){
  // Parallaxe au scroll : data-parallax="0.15"
  const px=[...document.querySelectorAll('[data-parallax]')];
  if(px.length){let raf=0;const f=()=>{px.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;el.style.setProperty('--py',((r.top+r.height/2-innerHeight/2)*parseFloat(el.dataset.parallax)).toFixed(1)+'px');});raf=0;};
    addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(f);},{passive:true});f();}
  // Profondeur au pointeur sur le héros
  const hero=document.querySelector('[data-hero]');
  if(hero&&matchMedia('(pointer:fine)').matches){let raf=0;
    hero.addEventListener('pointermove',e=>{if(raf)return;raf=requestAnimationFrame(()=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));hero.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3));raf=0;});});}
}
})();
