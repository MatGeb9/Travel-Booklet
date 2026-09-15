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

export function exportJSON() { return JSON.stringify({ ...load(), exportedAt: new Date().toISOString() }, null, 2); }
export function importJSON(txt) {
  const o = JSON.parse(txt);
  if (!o || typeof o !== "object") throw new Error("Fichier illisible");
  cache = { ...DEFAULT(), ...o };
  save();
}
export function reset() { cache = DEFAULT(); save(); }
