// Tout carnet est écrit à l'heure locale de sa destination : le téléphone peut être resté
// à l'heure d'Europe (avion, eSIM qui traîne), donc on ne fait jamais confiance au fuseau
// de l'appareil. On lit l'heure de la destination via Intl, quel que soit son réglage.
export const MS_DAY = 86400000;
const FMTS = new Map();
function fmt(tz) {
  if (!FMTS.has(tz)) FMTS.set(tz, new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }));
  return FMTS.get(tz);
}

// { date:"2026-09-16", minutes: 1204 } — minutes depuis minuit, à l'heure de la destination.
export function localNow(tz = "Asia/Shanghai", now = new Date()) {
  const p = {};
  for (const { type, value } of fmt(tz).formatToParts(now)) p[type] = value;
  const hour = p.hour === "24" ? "00" : p.hour;   // Intl peut rendre 24:00 à minuit
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: +hour * 60 + +p.minute };
}
export const beijingDate = (tz = "Asia/Shanghai", now = new Date()) => localNow(tz, now).date;

// Nombre de jours calendaires entre deux "YYYY-MM-DD" (b − a).
export function daysBetween(a, b) {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / MS_DAY);
}

export const toMinutes = t => { if (!t) return null; const [h, m] = t.split(":"); return +h * 60 + +m; };
export const fmtHour = t => { const [h, m] = t.split(":"); return m === "00" ? `${+h} h` : `${+h} h ${m}`; };

// Où en est-on du voyage ? day = n° de jour (1..n), ou null hors dates.
export function tripPosition(meta, now = new Date()) {
  const { date, minutes } = localNow(meta.tz || "Asia/Shanghai", now);
  const idx = daysBetween(meta.firstDay, date);
  const total = daysBetween(meta.firstDay, meta.lastDay) + 1;
  if (idx < 0) return { phase: "before", day: null, date, minutes, countdown: -idx };
  if (idx >= total) return { phase: "after", day: null, date, minutes, since: idx - total + 1 };
  return { phase: "during", day: idx + 1, date, minutes };
}
