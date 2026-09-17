// Persistance locale, rangée par voyage. Vos traces (coches, notes, dépenses, arbitrages)
// ne quittent jamais l'appareil ; les photos, elles, vivent dans IndexedDB (voir photos.js).
const KEY = "carnet.v2";
const LEGACY = "carnet.chine.v1";        // format mono-voyage, avant le multi-carnet
const LEGACY_TRIP = "chine-2026-09";

const BLANK = () => ({ done: {}, todos: {}, notes: {}, pinnedDay: null, depenses: [], choix: {} });
const DEFAULT = () => ({ schema: 2, current: null, trips: {} });

let cache = null;
let tripId = LEGACY_TRIP;

// Migration depuis l'ancien format. On ne supprime JAMAIS l'ancienne clé : si quoi que ce
// soit se passe mal, les coches et les notes du voyage en cours sont encore là, intactes.
function migrate(d) {
  if (d.trips[LEGACY_TRIP]) return d;
  let vieux = null;
  try { vieux = JSON.parse(localStorage.getItem(LEGACY) || "null"); } catch (e) { vieux = null; }
  if (!vieux || typeof vieux !== "object") return d;
  d.trips[LEGACY_TRIP] = {
    ...BLANK(),
    done: vieux.done || {}, todos: vieux.todos || {},
    notes: vieux.notes || {}, pinnedDay: vieux.pinnedDay ?? null,
  };
  d.current = d.current || LEGACY_TRIP;
  d.migratedFrom = LEGACY;
  return d;
}

export function load() {
  if (cache) return cache;
  try {
    const brut = localStorage.getItem(KEY);
    cache = brut ? { ...DEFAULT(), ...JSON.parse(brut) } : DEFAULT();
  } catch (e) { cache = DEFAULT(); }
  cache.trips = cache.trips || {};
  cache = migrate(cache);
  return cache;
}
export function save() { if (cache) try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {} }

// --- voyage courant ---
export function setTrip(id) { tripId = id; const d = load(); d.trips[id] = { ...BLANK(), ...(d.trips[id] || {}) }; d.current = id; save(); }
export const getTrip = () => tripId;
export const lastOpened = () => load().current;
const T = () => { const d = load(); d.trips[tripId] = { ...BLANK(), ...(d.trips[tripId] || {}) }; return d.trips[tripId]; };

// --- étapes, réservations, notes ---
export const isDone = id => !!T().done[id];
export function toggleDone(id) { const t = T(); t.done[id] ? delete t.done[id] : (t.done[id] = true); save(); }
export const isTodoDone = id => !!T().todos[id];
export function toggleTodo(id) { const t = T(); t.todos[id] ? delete t.todos[id] : (t.todos[id] = true); save(); }
export const getNote = date => T().notes[date] || "";
export function setNote(date, txt) { const t = T(); txt.trim() ? (t.notes[date] = txt) : delete t.notes[date]; save(); }
export const getPinnedDay = () => T().pinnedDay;
export function setPinnedDay(n) { T().pinnedDay = n; save(); }

// --- arbitrages : quelle branche a été retenue pour un choix donné ---
export const getChoix = n => T().choix[n] ?? null;
export function setChoix(n, i) { const t = T(); i === null ? delete t.choix[n] : (t.choix[n] = i); save(); }

// --- dépenses, toujours stockées en monnaie locale ---
export const getDepenses = () => T().depenses || [];
export function addDepense(d) {
  const t = T();
  t.depenses = [{ id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()), ...d }, ...(t.depenses || [])];
  save();
}
export function delDepense(id) { const t = T(); t.depenses = (t.depenses || []).filter(x => x.id !== id); save(); }
export const totalDepenses = () => getDepenses().reduce((a, d) => a + (+d.cny || 0), 0);

// --- export / import ---
export function exportJSON(photos) {
  return JSON.stringify({ schema: 2, tripId, trip: T(), photos: photos || [], exportedAt: new Date().toISOString() }, null, 2);
}

// Accepte les deux formats : l'ancien export mono-voyage et le nouveau.
function normalise(o) {
  if (o.trip) return { id: o.tripId || LEGACY_TRIP, data: { ...BLANK(), ...o.trip } };
  const { photos, exportedAt, schema, ...reste } = o;      // ancien export à plat
  return { id: LEGACY_TRIP, data: { ...BLANK(), ...reste } };
}

export function inspectJSON(txt) {
  const o = JSON.parse(txt);
  if (!o || typeof o !== "object") throw new Error("Fichier illisible");
  const { data, id } = normalise(o);
  return {
    data: o, tripId: id,
    coches: Object.keys(data.done || {}).length,
    resas: Object.keys(data.todos || {}).length,
    notes: Object.keys(data.notes || {}).length,
    depenses: (data.depenses || []).length,
    photos: (o.photos || []).length,
    date: o.exportedAt || null,
  };
}

// mode "merge"   : on additionne — c'est le cas du carnet tenu à deux.
// mode "replace" : on écrase — c'est la restauration d'une sauvegarde sur un appareil neuf.
export function importJSON(txt, mode = "merge") {
  const o = JSON.parse(txt);
  const { data: venu, id } = normalise(o);
  const d = load();
  const cible = id || tripId;
  if (mode === "replace") { d.trips[cible] = { ...BLANK(), ...venu }; save(); return o.photos || []; }

  const t = { ...BLANK(), ...(d.trips[cible] || {}) };
  t.done = { ...t.done, ...venu.done };          // une étape cochée par l'un ou l'autre reste cochée
  t.todos = { ...t.todos, ...venu.todos };
  t.choix = { ...t.choix, ...venu.choix };
  for (const [date, apporte] of Object.entries(venu.notes || {})) {
    const mienne = (t.notes[date] || "").trim(), leur = (apporte || "").trim();
    if (!leur) continue;
    if (!mienne) t.notes[date] = leur;
    // Deux notes pour le même jour : on garde les deux. Perdre la sienne en important
    // celle de l'autre serait le pire résultat possible.
    else if (mienne !== leur && !mienne.includes(leur)) t.notes[date] = mienne + "\n———\n" + leur;
  }
  const vus = new Set((t.depenses || []).map(x => x.id));
  t.depenses = [...(t.depenses || []), ...(venu.depenses || []).filter(x => !vus.has(x.id))]
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  d.trips[cible] = t;
  save();                                        // le jour épinglé reste celui de cet appareil
  return o.photos || [];
}

export function reset() { const d = load(); d.trips[tripId] = BLANK(); save(); }
