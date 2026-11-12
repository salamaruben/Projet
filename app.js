const IMG = "https://image.tmdb.org/t/p/";
// Liens de recherche vers chaque plateforme (TMDB ne fournit pas de lien direct par titre).
const SEARCH = {
  8: q => `https://www.netflix.com/search?q=${q}`,
  119: q => `https://www.primevideo.com/search/?phrase=${q}`,
  381: q => `https://www.canalplus.com/recherche/?q=${q}`,
  350: q => `https://tv.apple.com/fr/search?term=${q}`,
  337: q => `https://www.disneyplus.com/fr-fr/search?q=${q}`,
  1899: q => `https://www.max.com/fr/fr/search?q=${q}`,
  531: q => `https://www.paramountplus.com/fr/search/?q=${q}`,
  283: q => `https://www.crunchyroll.com/fr/search?q=${q}`,
  56: q => `https://www.ocs.fr/recherche?q=${q}`,
  236: q => `https://www.france.tv/recherche/?q=${q}`,
};

const $ = id => document.getElementById(id);
let C, provById = {}, filter = null, query = "";

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

fetch("data/catalog.json").then(r => r.json()).then(c => {
  C = c;
  C.providers.forEach(p => (provById[p.id] = p));
  $("demo").hidden = !c.meta.demo;
  $("foot").textContent = `Catalogue France — mis à jour le ${new Date(c.meta.updated).toLocaleDateString("fr-FR")} · ${c.items.length} titres · données TMDB`;
  buildChips();
  render();
});

function buildChips() {
  const el = $("chips");
  const mk = (label, id) => {
    const b = document.createElement("button");
    b.className = "chip" + (filter === id ? " on" : "");
    b.textContent = label;
    b.onclick = () => { filter = id; buildChips(); render(); };
    el.append(b);
  };
  el.innerHTML = "";
  mk("Tout", null);
  C.providers.forEach(p => mk(p.name, p.id));
}

function visible() {
  const q = norm(query);
  return C.items.filter(i =>
    (!filter || i.providers.includes(filter)) && (!q || norm(i.title).includes(q)));
}

function card(i) {
  const d = document.createElement("div");
  d.className = "card" + (i.poster ? "" : " noimg");
  if (i.poster) { d.style.backgroundImage = `url(${IMG}w342${i.poster})`; }
  else d.textContent = i.title;
  const dots = i.providers.map(id => `<i class="dot" style="background:${provById[id]?.color}"></i>`).join("");
  d.innerHTML += `<div class="dots">${dots}</div>` + (i.poster ? `<div class="t">${i.title}</div>` : "");
  d.onclick = () => openModal(i);
  return d;
}

function row(title, list) {
  if (!list.length) return;
  const r = document.createElement("section");
  r.className = "row";
  r.innerHTML = `<h3>${title}</h3><div class="track"></div>`;
  list.slice(0, 40).forEach(i => r.lastChild.append(card(i)));
  $("rows").append(r);
}

function render() {
  const items = visible();
  $("rows").innerHTML = "";
  const hero = items.find(i => i.backdrop) ?? items[0];
  const h = $("hero");
  h.hidden = !hero;
  if (hero) {
    h.style.backgroundImage = hero.backdrop ? `url(${IMG}w1280${hero.backdrop})` : "none";
    h.innerHTML = `<h2>${hero.title}</h2><p>${hero.overview || ""}</p><div><button class="btn" id="hb">Où regarder</button></div>`;
    $("hb").onclick = () => openModal(hero);
  }
  if (query) return row(`Résultats pour « ${query} »`, items);
  row("Populaires", items);
  row("Films", items.filter(i => i.type === "movie"));
  row("Séries", items.filter(i => i.type === "tv"));
  if (!filter) C.providers.forEach(p => row(`Sur ${p.name}`, items.filter(i => i.providers.includes(p.id))));
}

function openModal(i) {
  const q = encodeURIComponent(i.title);
  const links = i.providers.map(id => {
    const p = provById[id];
    const url = SEARCH[id]?.(q);
    return url ? `<a href="${url}" target="_blank" rel="noopener" style="background:${p.color}">Regarder sur ${p.name}</a>` : "";
  }).join("");
  const m = $("modal");
  m.hidden = false;
  m.innerHTML = `<div class="box"><div class="img" style="background-image:url(${i.backdrop ? IMG + "w780" + i.backdrop : ""})"></div>
    <div class="in"><h2>${i.title}</h2>
    <div class="meta">${i.type === "tv" ? "Série" : "Film"} · ${i.year || ""} · ★ ${i.rating || "–"}</div>
    <p>${i.overview || "Pas de résumé."}</p>
    <div class="watch">${links}</div></div></div>`;
  m.onclick = e => { if (e.target === m) m.hidden = true; };
}
document.addEventListener("keydown", e => { if (e.key === "Escape") $("modal").hidden = true; });
$("search").oninput = e => { query = e.target.value.trim(); render(); };
