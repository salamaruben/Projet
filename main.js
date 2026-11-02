const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const d=document.getElementById(b.dataset.dialog);if(b.dataset.tab)selectTab(document.getElementById(b.dataset.tab));d.showModal();d.scrollTop=0;}));
document.querySelectorAll('dialog').forEach(d=>{d.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>d.close()));d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
function selectTab(tab){[...tab.closest('[role=tablist]').querySelectorAll('[role=tab]')].forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});}
document.querySelectorAll('[role=tablist]').forEach(list=>{const tabs=[...list.querySelectorAll('[role=tab]')];tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectTab(tabs[next]);tabs[next].focus();});});});
// Agenda et journal : les données viennent de blocs JSON de la page. Pour brancher une source
// externe (agenda Microsoft 365, API), il suffira de remplacer loadData par un fetch.
async function loadData(id){try{return JSON.parse(document.getElementById(id)?.textContent||'[]');}catch{return [];}}
const frDate=d=>new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;}
// Mode « teasing » : date mise en avant, décompte en jours, détails annoncés plus tard (champ teaser).
function teaserItem(e){const li=el('li','agenda-item agenda-teaser');li.append(el('span','teaser-badge',e.titre));
 const t=el('time','teaser-date');t.dateTime=e.date;const d=new Date(e.date+'T12:00:00');t.append(el('strong',null,String(d.getDate())),el('span',null,d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})));li.append(t);
 const days=Math.ceil((d-new Date())/864e5);if(days>0)li.append(el('span','teaser-count',days===1?'Demain':`J-${days}`));
 li.append(el('p','agenda-desc',e.teaser));return li;}
(async()=>{
 const agenda=document.getElementById('agenda-list');
 if(agenda){const today=new Date().toISOString().slice(0,10);
  const events=(await loadData('agenda-data')).filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  agenda.replaceChildren(...events.map(e=>{if(e.teaser)return teaserItem(e);const li=el('li','agenda-item');const t=el('time','agenda-date',frDate(e.date));t.dateTime=e.date;li.append(t,el('strong','agenda-title',e.titre));
   const meta=[e.heure,e.lieu].filter(Boolean).join(' · ');if(meta)li.append(el('span','agenda-meta',meta));if(e.description)li.append(el('p','agenda-desc',e.description));return li;}));
  if(!events.length)agenda.append(el('li','agenda-empty','Les prochaines dates seront annoncées ici.'));}
 const journal=(await loadData('journal-data')).sort((a,b)=>b.date.localeCompare(a.date));
 if(journal.length){const list=document.getElementById('journal-list');
  list.replaceChildren(...journal.map(j=>{const li=el('li','journal-item');const t=el('time','agenda-date',frDate(j.date));t.dateTime=j.date;li.append(t);
   if(j.image){const img=document.createElement('img');img.src=j.image;img.alt=j.alt||'';img.loading='lazy';li.append(img);}
   li.append(el('h3',null,j.titre));if(j.texte)li.append(el('p',null,j.texte));return li;}));
  document.getElementById('journal').hidden=false;document.querySelector('[data-nav-journal]').hidden=false;document.querySelector('[data-nav-journal-soon]')?.remove();}
})();
// Identifiant d'envoi : un double clic ou un renvoi n'enregistre qu'un message.
document.querySelectorAll('[data-submission-id]').forEach(i=>{const a=new Uint8Array(16);crypto.getRandomValues(a);i.value=[...a].map(b=>b.toString(16).padStart(2,'0')).join('');});
// Bandeau cookies : information seulement (mesure d’audience anonyme sans cookie, aucun traceur publicitaire). Le choix est mémorisé dans le navigateur.
(()=>{const b=document.querySelector('[data-cookie-banner]');if(!b)return;let seen=false;try{seen=localStorage.getItem('sg-cookies')==='ok';}catch{}if(!seen)b.hidden=false;b.querySelector('[data-cookie-ok]').addEventListener('click',()=>{b.hidden=true;try{localStorage.setItem('sg-cookies','ok');}catch{}});})();
