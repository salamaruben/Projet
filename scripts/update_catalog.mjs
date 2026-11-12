// Met à jour data/catalog.json depuis TMDB (disponibilités en France).
// Usage : TMDB_API_KEY=xxxx node scripts/update_catalog.mjs
import { writeFile } from "node:fs/promises";

const KEY = process.env.TMDB_API_KEY;
if (!KEY) {
  console.error("TMDB_API_KEY manquante (clé gratuite sur themoviedb.org > Paramètres > API).");
  process.exit(1);
}

const REGION = "FR";
const PAGES = 3; // 20 titres par page, par plateforme et par type

// Plateformes (id = identifiant TMDB "watch provider"). Ajoute/retire à ta guise.
const PROVIDERS = [
  { id: 8, name: "Netflix", color: "#e50914" },
  { id: 119, name: "Prime Video", color: "#00a8e1" },
  { id: 381, name: "Canal+", color: "#111111" },
  { id: 350, name: "Apple TV+", color: "#555555" },
  { id: 337, name: "Disney+", color: "#113ccf" },
  { id: 1899, name: "Max", color: "#5822b4" },
  { id: 531, name: "Paramount+", color: "#0064ff" },
  { id: 283, name: "Crunchyroll", color: "#f47521" },
  { id: 56, name: "OCS", color: "#ff7a00" },
  { id: 236, name: "France TV", color: "#1d4ed8" },
];

async function tmdb(path, params = {}) {
  const url = new URL("https://api.themoviedb.org/3" + path);
  url.search = new URLSearchParams({ api_key: KEY, language: "fr-FR", ...params });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const items = new Map();

for (const type of ["movie", "tv"]) {
  for (const p of PROVIDERS) {
    for (let page = 1; page <= PAGES; page++) {
      const data = await tmdb(`/discover/${type}`, {
        watch_region: REGION,
        with_watch_providers: p.id,
        with_watch_monetization_types: "flatrate",
        sort_by: "popularity.desc",
        page,
      });
      for (const r of data.results) {
        const key = `${type}-${r.id}`;
        const it = items.get(key) ?? {
          id: r.id,
          type,
          title: r.title ?? r.name,
          overview: r.overview,
          poster: r.poster_path,
          backdrop: r.backdrop_path,
          year: (r.release_date ?? r.first_air_date ?? "").slice(0, 4),
          rating: Math.round(r.vote_average * 10) / 10,
          popularity: r.popularity,
          providers: [],
        };
        if (!it.providers.includes(p.id)) it.providers.push(p.id);
        items.set(key, it);
      }
      if (page >= data.total_pages) break;
    }
    console.log(`${type} / ${p.name} ok`);
  }
}

const catalog = {
  meta: { updated: new Date().toISOString(), region: REGION, demo: false },
  providers: PROVIDERS,
  items: [...items.values()].sort((a, b) => b.popularity - a.popularity),
};
await writeFile(new URL("../data/catalog.json", import.meta.url), JSON.stringify(catalog));
console.log(`${catalog.items.length} titres écrits.`);
