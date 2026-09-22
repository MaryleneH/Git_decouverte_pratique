# Git sans douleur — Jour 1

Site web de formation **Git / GitLab pour statisticiens** (Jour 1), construit
avec [Quarto](https://quarto.org). Une journée pour passer de
`rapport_final_vraiment_final.docx` à un vrai workflow versionné :

```text
modifier → observer → sélectionner → enregistrer → comprendre l'historique → partager
```

Le site est conçu comme une expérience d'apprentissage progressive — neuf
séquences, des widgets interactifs (staging, commit ≠ push, tags), des
terminaux animés et un challenge final « Mission — livraison 17:00 » — pour un
public de statisticiens, chargés d'études et data analysts qui découvrent Git.

## Prérequis

- [Quarto](https://quarto.org/docs/get-started/) ≥ 1.4 (le site est développé
  avec la 1.6) ;
- un navigateur récent. C'est tout : pas de R, ni Python, ni Node — le site
  est purement statique (HTML/CSS/JS vanilla).

## Lancement local

```bash
# Aperçu avec rechargement automatique
quarto preview

# Rendu complet dans _site/
quarto render
```

Le résultat de `quarto render` est un site statique autonome dans `_site/`,
déployable sur n'importe quel serveur web (ou consultable en local).

## Structure du projet

```text
.
├── _quarto.yml              # Configuration : navigation, thème, format
├── index.qmd                # Accueil « Découverte pratique de Git »
├── cours/                   # Les 9 séquences du Jour 1
│   ├── 01-pourquoi-git.qmd  #   Problèmes vécus → l'idée de Git
│   ├── 02-premier-commit.qmd#   status / diff / add / commit + widget staging
│   ├── 03-historique.qmd    #   log / show + frise + cas « 43 ans »
│   ├── 04-revenir.qmd       #   switch --detach / restore / revert
│   ├── 05-tags.qmd          #   Versions officielles + widget jalon
│   ├── 06-gitlab.qmd        #   Git ≠ GitLab
│   ├── 07-local-distant.qmd #   fetch / pull / push + widget commit ≠ push
│   ├── 08-collaboration.qmd #   clone / remote -v, reprise d'étude
│   └── 09-mission.qmd       #   Challenge final en autonomie
├── exercices/index.qmd      # 5 exercices récapitulatifs (réponses repliées)
├── ressources/index.qmd     # Mémo des commandes + glossaire
├── assets/
│   ├── css/                 # Thème SCSS structuré
│   │   ├── theme.scss       #   Point d'entrée (variables Bootstrap + imports)
│   │   ├── _tokens.scss     #   Variables CSS : couleurs, espaces, ombres, timings
│   │   ├── _typography.scss #   Échelle typographique éditoriale
│   │   ├── _layout.scss     #   Navbar, sidebar-parcours, rythme des pages
│   │   ├── _components.scss #   Encarts pédagogiques, frise Git, carte mentale
│   │   ├── _terminal.scss   #   Composant terminal (zone sombre)
│   │   ├── _widgets.scss    #   Widgets interactifs (staging, push, quiz…)
│   │   └── _animations.scss #   Système de mouvement + prefers-reduced-motion
│   ├── js/                  # JavaScript vanilla, progressif
│   │   ├── animations.js    #   Apparitions au scroll (IntersectionObserver)
│   │   ├── terminal.js      #   Habillage des terminaux, bouton copier
│   │   ├── progress.js      #   Barre de lecture + progression du parcours
│   │   └── interactions.js  #   Widgets staging / push / tag / checkpoints
│   ├── partials/scripts.html# Chargeur des scripts (chemins relatifs sûrs)
│   ├── img/                 # Logo et favicon SVG
│   └── video/               # Emplacements des mini-films (à ajouter)
└── README.md
```

## Principes de conception

- **Pédagogie avant tout** : chaque notion suit *problème → besoin → concept →
  démonstration → pratique → mémorisation*, avec un double niveau de lecture
  (les blocs « Pour aller plus loin » sont repliés pour ne pas noyer les
  débutants).
- **Une métaphore centrale** : l'album photo du projet, matérialisé par la
  « carte mentale de Git » (`.git-map`) qui s'enrichit de séquence en séquence.
- **Exemples métier** : `analyse.R`, `rapport.qmd`, seuils de population,
  livraisons au commanditaire — jamais d'exemples de développement web.
- **JavaScript progressif** : sans JS, tout le contenu reste lisible et les
  widgets affichent un état statique compréhensible.
- **Accessibilité** : HTML sémantique, focus visibles, contrastes AA,
  `prefers-reduced-motion` respecté partout (les animations sont un
  enrichissement, jamais une condition de compréhension).

## Personnalisation

- **Couleurs, espacements, ombres, vitesses d'animation** : tout est
  centralisé dans `assets/css/_tokens.scss` (variables CSS) et dans les
  variables Sass de `assets/css/theme.scss`.
- **Composants pédagogiques** : dans les `.qmd`, utilisez simplement
  `::: {.concept}`, `::: {.try}`, `::: {.remember}`, `::: {.warning}`,
  `::: {.mission-block}`, `::: {.checkpoint}` — et
  `<details class="go-further">` pour le second niveau de lecture.
- **Terminaux** : entourez un bloc de commande + un bloc de sortie avec
  `<div class="terminal-demo" data-title="nom-du-depot">` (voir les pages de
  cours pour des exemples). Le premier bloc est la commande (bouton
  « Copier »), les suivants sont la sortie (révélée ligne à ligne).

## Ajouter les mini-films

La séquence « Pourquoi Git ? » utilise quatre vidéos, versionnées comme
fichiers Git ordinaires (ré-encodées pour le web : H.264 1080p,
`+faststart`, ~10 Mo chacune — pas de Git LFS, donc aucun quota de bande
passante consommé au déploiement). `films.js` détecte leur présence et
active la lecture (si un fichier manque, un placeholder élégant
s'affiche) :

```text
assets/video/Sequence1_film1.mp4   # Situation 1 — rapport_final_vraiment_final
assets/video/Sequence1_film2.mp4   # Situation 2 — vendredi, ça marchait
assets/video/Sequence1_film3.mp4   # Situation 3 — qui a changé ça ?
assets/video/Sequence1_film4.mp4   # Situation 4 — voyage dans le temps
```

Un film peut aussi être **hébergé hors du dépôt** (S3, MinIO…) : il
suffit de mettre l'URL absolue (`https://…`) dans le `data-src` du
composant — `films.js` l'active directement, sans sonde (c'est le cas
du mini-film 05 de la séquence 03, servi depuis le SSPCloud).

Posters optionnels (détectés automatiquement eux aussi) :

```text
assets/img/video/pourquoi-git-01-poster.webp
assets/img/video/pourquoi-git-02-poster.webp
assets/img/video/pourquoi-git-03-poster.webp
assets/img/video/pourquoi-git-04-poster.webp
```

Les accordéons « Transcription du mini-film » de
`cours/01-pourquoi-git.qmd` contiennent une version décrite de chaque
film (accessibilité) ; si les films comportent des dialogues, remplacez-y
la description par le texte exact et prévoyez des sous-titres
(`<track kind="captions" …>`).
Comportement du lecteur : lecture volontaire uniquement, jamais deux vidéos
en même temps, `preload="none"` tant que l'utilisateur n'a pas cliqué.

## Déploiement

### GitHub Pages (workflow fourni)

Le dépôt contient `.github/workflows/publish.yml` : à chaque push sur `main`,
le site est rendu par Quarto et publié sur GitHub Pages. Activez simplement
**Settings → Pages → Source : GitHub Actions** dans le dépôt.

### Ailleurs (GitLab Pages, serveur interne…)

Le site ne dépend pas de GitHub Pages : `quarto render` produit un site
statique dans `_site/`, qu'il suffit de copier sur n'importe quel hébergement.
Pour GitLab Pages, un job qui exécute `quarto render` et publie `_site/` en
tant que `public/` suffit.

> Note : les polices (Fraunces, Public Sans, JetBrains Mono) sont chargées
> depuis Google Fonts. Sur un réseau fermé, remplacez l'`@import` en tête de
> `assets/css/theme.scss` par des fichiers de polices locaux — des polices de
> repli système sont prévues et le site reste parfaitement lisible sans.
