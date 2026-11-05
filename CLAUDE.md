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

**Mobile (≤ 700 px)** : une page à la fois, pas de longue page défilante. Barre du bas à 6 entrées (Accueil, Binômes, Comparer, Réseaux, Actus, PDF), ronds à deux initiales (SG, SL, BP, FN) sur les fiches, photos d'abord, tuiles de thèmes, comparatif à plier. L'accueil mobile n'a ni bouton PDF ni bouton « Comparer ». Le PDF s'ouvre dans un nouvel onglet. Après toute modification, vérifier que la version ordinateur est inchangée (comparaison de captures).

**PDF** : synthétique (7 pages : couverture, vue d'ensemble, une page par binôme, tableau « en un coup d'œil »), aux couleurs du site. Pas de détail des mesures, de sources ni d'évolutions dans le PDF.

**Contenu**
- Mentions légales : page séparée `mentions.html`, éditeur anonyme, hébergeur Vercel, contact programme.batonnat.2027@gmail.com, données personnelles retirées 3 mois après le scrutin (décembre 2026).
- Soutiens : recopier la fonction exacte de la source ; nom seul si elle est incertaine. Xavier Delcros : la page de soutiens de Fabiani–Naquet indique « Président émérite de Section parisienne de l'Association nationale des avocats honoraires » (revérifié le 2026-10-29) ; garder « président émérite ».
- Biographies : à tirer des sites de cabinet ou de sources indépendantes, jamais des seuls sites de campagne, avec la source. Les six binômes sont faits (2026-10-29), chaque personne a un champ `sources` affiché sous sa biographie. Non retrouvé hors site de campagne, donc non repris : mandats ordinaux et syndicaux de Saada (SAF, Conseil de l'Ordre, CNB, CNBF), SAF Paris 2011-2017 et rôle de fondatrice de DSF pour Lagrue, Lawyers 4 Women pour Pascarel, candidature 2024 de Surin ; à compléter si une source indépendante apparaît.
- Onglet « Réseaux » (public, chiffres seulement) : graphiques d'abonnés par compte, total par binôme, gain/perte « depuis hier » (dernier relevé vs relevé de la veille ; si la veille manque, depuis le relevé précédent avec la durée indiquée, jamais ramené à un jour) et par semaine du lundi au dimanche (écart entre le relevé du lundi ou le dernier avant, et celui du dimanche ou le dernier disponible ; semaine du dernier relevé, « en cours » tant qu'elle n'est pas finie, plus la semaine précédente), et évolution PAR BINÔME (une courbe par binôme, avec un bouton pour passer de « Gain depuis le premier relevé », affiché par défaut, à « Total des abonnés » ; le total est la somme des comptes du binôme), calculés depuis `candidats[].reseaux` = `{label, url?, plateforme, releves?}` ; `releves` = `{date: AAAA-MM-JJ, abonnes: nombre}` relevés à la main par l'utilisateur (jamais inventés, jamais de connexion à un compte). La section « Présence sur les réseaux » (cartes des comptes avec liens) a été RETIRÉE le 2026-11-02 à la demande de l'utilisateur : ne pas la recréer ; l'onglet lui-même est conservé (une première version retirait tout l'onglet par erreur). Sur mobile, un onglet « Réseaux » est dans la barre du bas, qui passe donc à 6 entrées (Accueil, Binômes, Comparer, Réseaux, Actus, PDF) à la demande de l'utilisateur du 2026-11-03 (la tuile d'accueil et le bouton de Comparer essayés avant ont été retirés). Pas de commentaires de particuliers sur le site public. Ne pas supprimer `reseaux` ni `releves` lors des mises à jour quotidiennes.
- Onglet « Soutiens » (ajouté le 2026-11-04 à la demande de l'utilisateur) : liste complète des soutiens par binôme, dans `candidats[].soutiens.liste` = `[{nom, fonction?}]` avec `liste_source` (page de soutiens du candidat), `liste_date` et, si aucune liste n'existe, `liste_note` (Surin–Griguer : aucune liste publiée, seulement un formulaire). Repris tels quels des pages de soutiens (noms et fonctions exacts de la source, dans l'ordre de la page, sans les citations ni l'année non expliquée affichée chez Bouyssou–Pascarel). Au 2026-11-04 : Saada–Lagrue 149, Bouyssou–Pascarel 310, Fabiani–Naquet 359. Onglet dans la barre des onglets et le menu du haut (ordinateur) ; sur mobile, accès par le lien « Voir la liste complète des soutiens » en bas de chaque fiche (la barre du bas reste à 6 entrées). Depuis le 2026-11-05, la tâche « Programmes bâtonnat » (étape 4 ter de sa consigne) relit chaque jour les pages de soutiens, remplace `liste` dans l'ordre de la page (nouveaux noms ajoutés, noms retirés par la source supprimés), analyse les nouveaux soutiens (journal + notification) et ajoute les nouveaux notables à `notables` ; elle ne remplace jamais une liste mal lue (page incomplète, vide ou en baisse de plus de 20 %). Ne pas supprimer `liste` lors des mises à jour manuelles. Mention de retrait sur la page : programme.batonnat.2027@gmail.com.
- Évolutions de la page d'accueil : actualités, évolutions et historique limités (« Voir plus »). Listes d'actualités réduites le 2026-11-04 à la demande de l'utilisateur : 3 éléments affichés sur l'accueil (« Dernières actualités ») et 3 sur chaque fiche de binôme (section « Actualités »), avec « Voir les N autres ».

**Hébergement** : Vercel uniquement (plus de Netlify). Après chaque modification : artifact + branche `claude/site-vercel`, puis confirmer. Les tâches planifiées « Programmes bâtonnat » (10 h 01) et « Synchronisation Vercel » (10 h 35, heure de Paris) ne peuvent écrire dans le dépôt que si `salamaruben/Projet` leur est rattaché avec droit d'écriture ; à vérifier chaque jour.
