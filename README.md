# 🏮 Carnet de route · Chine

Le carnet de voyage **Chine, 11 – 26 septembre 2026** (Shanghai · Chongqing ·
Chengdu · Xi'an), transformé en app qu'on ouvre d'une main dans la rue au lieu de
chercher la bonne page d'un PDF.

App **web installable** (PWA) — s'installe sur l'écran d'accueil de l'iPhone et
s'ouvre en plein écran comme une vraie app. **Tout fonctionne hors-ligne** : pas
de réseau, pas d'eSIM, pas de VPN. Vos coches et vos notes restent sur l'appareil.

---

## Ce que ça fait

**🧭 Aujourd'hui** — l'écran qui sert 90 % du temps. L'app sait quel jour du
voyage on est et ouvre directement dessus : le programme heure par heure, l'étape
en cours marquée **MAINTENANT** en rouge, la suivante **À SUIVRE** en or. Les
conseils du jour sont au-dessus, la barre de progression compte les étapes faites.
Une étape se coche d'un pouce ; on la touche pour lire le détail complet.

> L'heure est toujours lue **à l'heure de Pékin**, jamais celle du téléphone : le
> carnet est écrit en heure locale chinoise, et un téléphone resté à l'heure
> d'Europe afficherait le mauvais créneau — voire le mauvais jour.

**📅 Jours** — les 15 jours d'un coup d'œil, avec la ville, la date et le nombre
d'étapes faites. On touche pour ouvrir n'importe quel jour ; un bouton « Revenir
à aujourd'hui » ramène au jour réel.

**🏙️ Villes** — les pages « à la carte » : Shanghai, Chongqing, Chengdu, Xi'an.
Adresses, tarifs, horaires, et ce qui n'a pas trouvé de créneau.

**🎒 Pratique** — les réservations à prendre (cochables), ce qui est déjà
verrouillé, les préparatifs, les arbitrages, le shopping et le budget.

**中 À montrer** — 55 cartes : phrases utiles et adresses en caractères chinois.
On touche, ça s'affiche en **plein écran, en très gros**, assez pour être lu par
un chauffeur de Didi. « Copier pour Amap » met les caractères dans le
presse-papier — le PDF le dit lui-même : une adresse en alphabet latin ne sert
à rien.

**📷 Photos** — un bouton 📷 sur chaque étape. Les photos s'affichent en vignettes
sous l'étape, s'ouvrent en plein écran, et partent dans l'export. Elles sont
redimensionnées à 1600 px en entrant : un carnet de quinze jours reste transportable.

**🔍 Recherche** (l'icône en haut à droite) — cherche dans *tout* le carnet d'un
coup : les 15 jours, les pages par ville, le pratique, les cartes. Tapez
`hot pot`, `passeport`, `Wulong`, `spa` et allez droit au bon endroit. C'est ce
qui remplace le feuilletage du PDF.

**⏰ Alertes** — une réservation dont l'échéance tombe aujourd'hui s'affiche en
rouge en haut de l'écran du jour, et celles qui traînent sont rappelées sur une
ligne. Cochez-les dans *Pratique* pour les faire disparaître.

---

## Installer sur l'iPhone

1. Ouvrir l'adresse de l'app **dans Safari** (pas Chrome — seul Safari sait
   installer une PWA sur iOS).
2. Bouton **Partager** → **« Sur l'écran d'accueil »**.
3. L'icône 🏮 apparaît. Elle s'ouvre en plein écran, sans barre d'adresse.

> **Avant de partir : ouvrez l'app une fois, en ligne.** Le service worker met
> alors tout en cache. Ensuite elle marche même en mode avion.

Sur Mac / PC : Chrome ou Edge → icône d'installation dans la barre d'adresse.
Safari sur Mac : Fichier → « Ajouter au Dock ».

---

## Développer

Pas de build, pas de dépendances, pas de framework : du HTML, du CSS et du
JavaScript en modules ES.

```bash
python3 -m http.server 8799
# puis http://localhost:8799/
```

> ⚠️ Ne pas ouvrir le fichier en `file://` : les modules ES et le service worker
> exigent `http://` ou `https://`.

### Publier

Le dépôt se sert tel quel par **GitHub Pages** (`Settings → Pages → Deploy from
a branch`). Le fichier `.nojekyll` est là pour que Pages ne touche à rien.

Après une modification, **bumper `CACHE` dans `sw.js`** (`carnet-chine-v1` →
`v2`). Sans ça, l'iPhone peut rester collé à l'ancienne version en cache.

### Arborescence

```
index.html              coquille : #app + barre d'onglets
manifest.webmanifest    nom, icônes, mode plein écran
sw.js                   cache hors-ligne (stale-while-revalidate)
css/styles.css          thème sombre, rouge et or, safe-areas iOS
js/data.js              méta, réservations, villes, shopping, budget, cartes
js/days.js              les 15 jours, étape par étape
js/clock.js             heure de Pékin, jour courant, « maintenant »
js/store.js             localStorage : coches, notes, export/import
js/app.js               rendu + délégation d'événements sur data-action
make_icons.py           régénère les icônes (python make_icons.py)
```

Le contenu vient du PDF *Chine 11-26 septembre 2026 (v8)*. Pour corriger une
adresse ou un horaire, éditez `js/days.js` ou `js/data.js` : ce sont de simples
tableaux d'objets, rien d'autre à toucher.

### Pourquoi une PWA et pas du natif

Une app iPhone native (Swift) demanderait un Mac, Xcode, un compte développeur
Apple à 99 $/an, et un passage par l'App Store à chaque correction d'horaire.
Java, c'est Android — pas iPhone. La PWA s'installe en deux taps, se corrige en
poussant un commit, et marche hors-ligne exactement pareil. C'est le même choix
que pour **Muscu** et **Atlas**.

---

## Comment les données sont rangées

Il y a **deux stockages, et ils ne se mélangent jamais**. C'est ce qui rend le
multi-voyage simple à venir.

### 1. Le contenu du carnet — lecture seule, vient du dépôt

Les jours, les étapes, les adresses, le budget : tout est dans `js/data.js` et
`js/days.js`, importé au démarrage et mis en cache par le service worker.
**L'app n'écrit jamais dedans.** Corriger un horaire, c'est un commit.

`TRIP.id` (`"chine-2026-09"`) identifie le voyage. Il sert déjà à ranger les
photos — pour qu'ajouter un deuxième carnet plus tard ne demande pas d'y retoucher.

### 2. Vos traces — lecture/écriture, restent sur l'appareil

Rien ne part sur le réseau. Deux technologies, pour une raison précise :

| | Où | Pourquoi |
|---|---|---|
| coches, notes, jour épinglé | `localStorage["carnet.chine.v1"]` | petit, texte, synchrone |
| photos | IndexedDB `carnet` | `localStorage` plafonne à ~5 Mo et ne stocke que du texte |

La base `carnet` a deux magasins : `photos` porte la vignette (~40 Ko) et les
métadonnées, `full` porte l'image à 1600 px (~300 Ko). Au démarrage on ne lit que
les vignettes — charger toutes les images pleine taille pour dessiner une journée
serait absurde. L'image complète n'est lue qu'à l'ouverture de la visionneuse.

Chaque photo porte `{ tripId, stepId, dayDate }` : elle est attachée à une étape
précise, dans un voyage précis.

### L'export

*Pratique → Sauvegarde* produit **un seul fichier `.json`**, comme Atlas : les
coches, les notes, et les photos converties en base64 (`data:image/jpeg;base64,…`).
L'import fait le chemin inverse et réinjecte les images dans IndexedDB.

L'app réclame le stockage persistant au démarrage (`navigator.storage.persist()`),
demande à iOS de ne pas évincer les photos sous pression disque, et affiche dans
*Pratique → Sauvegarde* la place occupée et le nombre de photos encore possibles.
Si l'appareil est plein, l'ajout le dit explicitement — et non « photo illisible »,
qui enverrait chercher le mauvais problème.

> Le base64 gonfle d'environ un tiers. Deux photos font ~0,9 Mo ; comptez donc
> autour de **0,4 Mo par photo**. C'est précisément pour ça que les images sont
> ramenées à 1600 px en entrant — sans ça, deux cents photos d'iPhone feraient un
> export d'un gigaoctet, inexploitable.

### Ce qu'il faudra pour plusieurs voyages

Rien de tout ceci n'est à jeter. Il faudra :

1. fusionner `data.js` + `days.js` en un `trips/<id>.json` par voyage, plus un manifeste ;
2. imbriquer le `localStorage` par `tripId` (avec migration de l'existant) ;
3. passer le voyage en paramètre à `clock.js` au lieu de l'importer ;
4. un sélecteur de voyage — les archives se déduisent des dates, pas d'un drapeau.

Les photos, elles, sont déjà au bon format.
