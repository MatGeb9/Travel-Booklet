// Persistance locale (localStorage) : étapes cochées, notes libres par jour, réglages.
// Export/import JSON pour sauvegarder dans Fichiers / iCloud.
const KEY = "carnet.chine.v1";

const DEFAULT = () => ({
  schema: 1,
  done: {},        // "d4b" -> true            (étapes cochées)
  todos: {},       // "t-spa" -> true          (réservations faites)
  notes: {},       // "2026-09-15" -> "texte"  (notes libres du jour)
  pinnedDay: null, // n° de jour figé manuellement, sinon on suit l'horloge
});

let cache = null;
export function load() {
  if (cache) return cache;
  try { const raw = localStorage.getItem(KEY); cache = raw ? { ...DEFAULT(), ...JSON.parse(raw) } : DEFAULT(); }
  catch (e) { cache = DEFAULT(); }
  return cache;
}
export function save() { if (cache) try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {} }

export const isDone = id => !!load().done[id];
export function toggleDone(id) { const d = load(); d.done[id] ? delete d.done[id] : (d.done[id] = true); save(); }
export const isTodoDone = id => !!load().todos[id];
export function toggleTodo(id) { const d = load(); d.todos[id] ? delete d.todos[id] : (d.todos[id] = true); save(); }
export const getNote = date => load().notes[date] || "";
export function setNote(date, txt) {
  const d = load();
  txt.trim() ? (d.notes[date] = txt) : delete d.notes[date];
  save();
}
export const getPinnedDay = () => load().pinnedDay;
export function setPinnedDay(n) { const d = load(); d.pinnedDay = n; save(); }

// L'export embarque les photos en base64, comme Atlas : un seul fichier à ranger.
export function exportJSON(photos) {
  return JSON.stringify({ ...load(), photos: photos || [], exportedAt: new Date().toISOString() }, null, 2);
}
// Ce que contient un fichier, avant de décider quoi en faire.
export function inspectJSON(txt) {
  const o = JSON.parse(txt);
  if (!o || typeof o !== "object") throw new Error("Fichier illisible");
  return {
    data: o,
    coches: Object.keys(o.done || {}).length,
    resas: Object.keys(o.todos || {}).length,
    notes: Object.keys(o.notes || {}).length,
    photos: (o.photos || []).length,
    date: o.exportedAt || null,
  };
}

// mode "merge"   : on additionne — c'est le cas du carnet tenu à deux.
// mode "replace" : on écrase — c'est la restauration d'une sauvegarde sur un appareil neuf.
// Renvoie les photos trouvées ; l'appelant les réinjecte dans IndexedDB (elles se
// fusionnent toujours par identifiant, un même cliché importé deux fois ne se duplique pas).
export function importJSON(txt, mode = "merge") {
  const { data } = inspectJSON(txt);
  const { photos, ...rest } = data;
  if (mode === "replace") {
    cache = { ...DEFAULT(), ...rest };
    save();
    return photos || [];
  }
  const d = load(), inc = { ...DEFAULT(), ...rest };
  d.done = { ...d.done, ...inc.done };        // une étape cochée par l'un ou l'autre reste cochée
  d.todos = { ...d.todos, ...inc.todos };
  for (const [date, venue] of Object.entries(inc.notes || {})) {
    const mienne = (d.notes[date] || "").trim(), leur = (venue || "").trim();
    if (!leur) continue;
    if (!mienne) d.notes[date] = leur;
    // Deux notes pour le même jour : on garde les deux. Perdre la sienne en important
    // celle de l'autre serait le pire résultat possible.
    else if (mienne !== leur && !mienne.includes(leur)) d.notes[date] = mienne + "\n———\n" + leur;
  }
  save();                                      // le jour épinglé reste celui de cet appareil
  return photos || [];
}
export function reset() { cache = DEFAULT(); save(); }
