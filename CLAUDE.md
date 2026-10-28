# Site « Bâtonnat de Paris 2027 »

Le site est statique : `site/index.html` (page) et `site/data.json` (toutes les données).
Vercel le publie depuis la branche `claude/site-vercel` (dossier `site/`, voir `vercel.json`).

Il existe aussi une copie en artifact claude.ai : https://claude.ai/artifact/C7KzGET2k2oMKfg5myfNw3
(capacité `downloads` déclarée). La tâche programmée « Programmes bâtonnat » la met à jour chaque
jour (contenu de `data.json`) et pousse le même `data.json` sur `claude/site-vercel`.

## Règle : toujours mettre à jour les deux copies

Toute modification de `site/index.html` ou de `site/data.json` doit être appliquée aux deux endroits,
dans la même opération :

1. publier le fichier modifié sur l'artifact (outil Artifact, même `url`, `files` pour `data.json`) ;
2. pousser les mêmes fichiers sur la branche `claude/site-vercel` (Vercel redéploie tout seul).

Confirmer ensuite à l'utilisateur que les deux sont à jour. Ne jamais modifier une seule copie.
