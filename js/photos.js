// Photos attachées aux étapes — IndexedDB, comme Atlas.
// localStorage est limité à ~5 Mo et ne stocke que du texte : il ne peut pas porter
// d'images. IndexedDB accepte les Blob directement, sans base64, et n'a pas cette limite.
//
// Deux magasins exprès : `photos` porte la vignette (~30 Ko) et les métadonnées, `full`
// porte l'image complète. Au démarrage on ne lit que `photos` — charger toutes les images
// pleine taille en mémoire pour afficher une timeline serait absurde.
const DB = "carnet", VERSION = 1, META = "photos", FULL = "full";
const MAX_FULL = 1600;   // côté le plus long de l'image conservée
const MAX_THUMB = 420;   // côté le plus long de la vignette
const QUALITY = 0.82;

let dbp = null;
function open() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, VERSION);
    r.onupgradeneeded = () => {
      const d = r.result;
      if (!d.objectStoreNames.contains(META)) {
        const s = d.createObjectStore(META, { keyPath: "id" });
        s.createIndex("byTrip", "tripId");
        s.createIndex("byStep", ["tripId", "stepId"]);
      }
      if (!d.objectStoreNames.contains(FULL)) d.createObjectStore(FULL, { keyPath: "id" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
const asPromise = req => new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });
function run(stores, mode, fn) {
  return open().then(d => new Promise((res, rej) => {
    const t = d.transaction(stores, mode);
    let out; try { out = fn(t); } catch (e) { rej(e); return; }
    t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
  }));
}

const uid = () => (crypto.randomUUID && crypto.randomUUID()) || (Date.now().toString(36) + Math.random().toString(36).slice(2));

// --- redimensionnement ---
// On ne stocke jamais l'original : une photo d'iPhone pèse 3 à 5 Mo, et 200 d'entre elles
// feraient un export inexploitable. 1600 px de côté suffisent largement pour un carnet.
function loadImage(blob) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = e => { URL.revokeObjectURL(url); rej(e); };
    img.src = url;
  });
}
function scale(img, max) {
  const r = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * r), h = Math.round(img.naturalHeight * r);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  c.getContext("2d").drawImage(img, 0, 0, w, h);
  return new Promise(res => c.toBlob(b => res({ blob: b, w, h }), "image/jpeg", QUALITY));
}

// --- cache mémoire : métadonnées + URL des vignettes, pour un rendu synchrone ---
let meta = [];                       // enregistrements du magasin META, du voyage courant
const thumbURLs = new Map();         // id -> objectURL de la vignette
let currentTrip = null;

export async function init(tripId) {
  currentTrip = tripId;
  for (const u of thumbURLs.values()) URL.revokeObjectURL(u);
  thumbURLs.clear();
  try {
    meta = await run([META], "readonly", t =>
      asPromise(t.objectStore(META).index("byTrip").getAll(tripId))).then(r => r);
  } catch (e) { meta = []; return; }
  meta.sort((a, b) => a.addedAt - b.addedAt);
  for (const m of meta) if (m.thumb) thumbURLs.set(m.id, URL.createObjectURL(m.thumb));
}

export const forStep = stepId =>
  meta.filter(m => m.stepId === stepId).map(m => ({ id: m.id, url: thumbURLs.get(m.id), w: m.w, h: m.h }));
export const countForStep = stepId => meta.filter(m => m.stepId === stepId).length;
export const total = () => meta.length;
export const get = id => meta.find(m => m.id === id);

export async function add(tripId, stepId, dayDate, file) {
  const img = await loadImage(file);
  const [full, thumb] = await Promise.all([scale(img, MAX_FULL), scale(img, MAX_THUMB)]);
  const rec = { id: uid(), tripId, stepId, dayDate, type: "image/jpeg",
                w: full.w, h: full.h, addedAt: Date.now(), thumb: thumb.blob };
  await run([META, FULL], "readwrite", t => {
    t.objectStore(META).put(rec);
    t.objectStore(FULL).put({ id: rec.id, blob: full.blob });
  });
  meta.push(rec);
  thumbURLs.set(rec.id, URL.createObjectURL(rec.thumb));
  return rec;
}

export async function remove(id) {
  await run([META, FULL], "readwrite", t => { t.objectStore(META).delete(id); t.objectStore(FULL).delete(id); });
  const u = thumbURLs.get(id);
  if (u) { URL.revokeObjectURL(u); thumbURLs.delete(id); }
  meta = meta.filter(m => m.id !== id);
}

// URL de l'image pleine taille, à la demande (ouverture de la visionneuse seulement).
let openFullURL = null;
export async function fullURL(id) {
  if (openFullURL) { URL.revokeObjectURL(openFullURL); openFullURL = null; }
  const rec = await run([FULL], "readonly", t => asPromise(t.objectStore(FULL).get(id)));
  if (!rec || !rec.blob) return null;
  openFullURL = URL.createObjectURL(rec.blob);
  return openFullURL;
}
export function releaseFull() { if (openFullURL) { URL.revokeObjectURL(openFullURL); openFullURL = null; } }

// --- export / import : les Blob deviennent des data URL base64, comme dans Atlas ---
const blobToDataURL = b => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b);
});
const dataURLToBlob = async u => (await fetch(u)).blob();

export async function exportAll(tripId) {
  const recs = await run([META], "readonly", t => asPromise(t.objectStore(META).index("byTrip").getAll(tripId)));
  const out = [];
  for (const m of recs) {
    const f = await run([FULL], "readonly", t => asPromise(t.objectStore(FULL).get(m.id)));
    out.push({ id: m.id, tripId: m.tripId, stepId: m.stepId, dayDate: m.dayDate, type: m.type,
               w: m.w, h: m.h, addedAt: m.addedAt,
               thumb: m.thumb ? await blobToDataURL(m.thumb) : null,
               full: f && f.blob ? await blobToDataURL(f.blob) : null });
  }
  return out;
}

export async function importAll(list) {
  for (const p of list || []) {
    if (!p || !p.id) continue;
    const thumb = p.thumb ? await dataURLToBlob(p.thumb) : null;
    const full = p.full ? await dataURLToBlob(p.full) : null;
    await run([META, FULL], "readwrite", t => {
      t.objectStore(META).put({ id: p.id, tripId: p.tripId, stepId: p.stepId, dayDate: p.dayDate,
                                type: p.type || "image/jpeg", w: p.w, h: p.h, addedAt: p.addedAt || Date.now(), thumb });
      if (full) t.objectStore(FULL).put({ id: p.id, blob: full });
    });
  }
}

export async function clear(tripId) {
  const recs = await run([META], "readonly", t => asPromise(t.objectStore(META).index("byTrip").getAll(tripId)));
  await run([META, FULL], "readwrite", t => {
    for (const m of recs) { t.objectStore(META).delete(m.id); t.objectStore(FULL).delete(m.id); }
  });
  await init(tripId);
}
