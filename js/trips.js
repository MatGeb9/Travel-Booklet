// Chargement des carnets. Le contenu est de la donnée pure (trips/*.json), jamais du code :
// un carnet généré depuis un PDF ne peut donc rien exécuter. Le service worker met les
// fichiers en cache, l'ensemble reste consultable hors-ligne.
import { daysBetween, beijingDate } from "./clock.js";

let manifeste = null;

export async function loadManifest() {
  if (manifeste) return manifeste;
  const r = await fetch("./trips/index.json");
  if (!r.ok) throw new Error("Manifeste des voyages introuvable");
  manifeste = (await r.json()).trips || [];
  manifeste.sort((a, b) => (a.firstDay < b.firstDay ? 1 : -1));   // le plus récent d'abord
  return manifeste;
}

export async function loadTrip(id) {
  const liste = await loadManifest();
  const entree = liste.find(t => t.id === id) || liste[0];
  if (!entree) throw new Error("Aucun voyage");
  const r = await fetch("./" + entree.file);
  if (!r.ok) throw new Error("Carnet introuvable : " + entree.file);
  return await r.json();
}

// « En cours », « à venir » ou « archivé » se déduisent des dates : pas de drapeau à tenir
// à jour, donc rien qui puisse mentir.
export function statut(t, aujourdhui) {
  const j = aujourdhui || beijingDate();
  if (daysBetween(j, t.firstDay) > 0) return "avenir";
  if (daysBetween(t.lastDay, j) > 0) return "archive";
  return "encours";
}

// Le voyage à ouvrir : celui qui contient aujourd'hui, sinon le prochain, sinon le dernier.
export function voyageDuJour(liste, aujourdhui) {
  const j = aujourdhui || beijingDate();
  return (liste.find(t => statut(t, j) === "encours")
       || [...liste].reverse().find(t => statut(t, j) === "avenir")
       || liste[0] || null);
}
