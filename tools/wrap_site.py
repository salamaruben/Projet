import sys
# Usage: wrap_site.py <artifact_index.html> <out_site_index.html>
# L'artifact est publié sans doctype (claude.ai l'ajoute). Vercel a besoin d'un document complet avec la balise viewport.
src=open(sys.argv[1],encoding='utf8').read()
assert '<!doctype' not in src.lower()[:200], "fichier déjà enrobé"
head='<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style>\n'
open(sys.argv[2],'w',encoding='utf8').write(head+src.rstrip()+'\n</body></html>\n')
