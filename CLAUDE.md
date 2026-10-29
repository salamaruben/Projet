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

## Attention : deux formes du fichier index.html

- **Artifact** : publier `index.html` *sans* `<!doctype>`, `<html>`, `<head>` ni `<body>` (claude.ai les ajoute). Si on relit
  l'artifact avec l'outil Artifact, le fichier enregistré est la version enrobée : retirer l'enrobage avant de republier.
- **Vercel** (`site/index.html`) : il faut un document complet avec la balise `<meta name="viewport" ...>`, sinon les
  téléphones affichent la page réduite (tout est trop petit). Générer ce fichier avec :
  `python3 tools/wrap_site.py <index.html de l'artifact> site/index.html`.
- `site/mentions.html` est un document complet autonome, identique sur les deux copies.

## Décisions de l'utilisateur (à respecter)

**Identité et style**
- Accueil : grande image de Paris au crépuscule (silhouette dessinée, à remplacer par une photo libre de droits si l'utilisateur en fournit une), cadre fin arrondi, menu en verre dépoli, pastilles, bouton blanc.
- Palette du crépuscule (bleu ardoise, lavande, pêche) ; fond clair uni `#f1eff5`, jamais de dégradé orangé en bas de page, jamais de fond sombre ni de blanc pur.
- Formes arrondies partout (cartes 22 px, boutons en pilule). Police Inter.
- Couleurs des binômes : Surin et Griguer `#4a63b8`, Saada et Lagrue `#d9743f`, Bouyssou et Pascarel `#7a5fb0`, Fabiani et Naquet `#c2587a`. Ordre d'affichage : Surin, Saada, Bouyssou, Fabiani.
- Retiré à la demande : sièges/hémicycle, liens « Programme » par mesure, soulignements, mention « Ordre des avocats de Paris » en haut, phrase sur les 14 membres du Conseil, encadré « Limites de cette fiche » (ne plus l'afficher), bloc de découpage « en quatre thèmes » (entrée « Version initiale »).
- Site indépendant et non officiel : le dire dans l'en-tête, le pied de page et le PDF. Ne jamais utiliser le logo ni l'identité de l'Ordre.

**Mobile (≤ 700 px)** : une page à la fois, pas de longue page défilante. Barre du bas à 5 entrées (Accueil, Binômes, Comparer, Actus, PDF), ronds à deux initiales (SG, SL, BP, FN) sur les fiches, photos d'abord, tuiles de thèmes, comparatif à plier. L'accueil mobile n'a ni bouton PDF ni bouton « Comparer ». Le PDF s'ouvre dans un nouvel onglet. Après toute modification, vérifier que la version ordinateur est inchangée (comparaison de captures).

**PDF** : synthétique (7 pages : couverture, vue d'ensemble, une page par binôme, tableau « en un coup d'œil »), aux couleurs du site. Pas de détail des mesures, de sources ni d'évolutions dans le PDF.

**Contenu**
- Mentions légales : page séparée `mentions.html`, éditeur anonyme, hébergeur Vercel, contact programme.batonnat.2027@gmail.com, données personnelles retirées 3 mois après le scrutin (décembre 2026).
- Soutiens : recopier la fonction exacte de la source ; nom seul si elle est incertaine. Xavier Delcros : la page lue indique « président émérite » (l'utilisateur avait dit « président » : à confirmer).
- Biographies : à tirer des sites de cabinet ou de sources indépendantes, jamais des seuls sites de campagne, avec la source. Faites : Griguer, Bouyssou. À refaire : Surin, Pascarel, Saada, Lagrue, Fabiani, Naquet.
- Évolutions de la page d'accueil : actualités, évolutions et historique limités (« Voir plus »).

**Hébergement** : Vercel uniquement (plus de Netlify). Après chaque modification : artifact + branche `claude/site-vercel`, puis confirmer. Les tâches planifiées « Programmes bâtonnat » (10 h 01) et « Synchronisation Vercel » (10 h 35, heure de Paris) ne peuvent écrire dans le dépôt que si `salamaruben/Projet` leur est rattaché avec droit d'écriture ; à vérifier chaque jour.
