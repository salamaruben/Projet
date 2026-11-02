const url = 'https://www.batonnatsuringriguer.com/carte/';
const button = document.querySelector('#share');
const status = document.querySelector('#share-status');
button?.addEventListener('click', async () => {
  if (navigator.share) {
    try { await navigator.share({ title: 'Clarisse Surin & Merav Griguer — Bâtonnat Paris 2028', url }); status.textContent = 'Carte partagée.'; return; }
    catch (error) { if (error?.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(url); status.textContent = 'Lien de la carte copié.'; }
  catch { status.textContent = `Copiez ce lien : ${url}`; }
});
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/carte/sw.js', { scope: '/carte/' }).catch(() => {}));
