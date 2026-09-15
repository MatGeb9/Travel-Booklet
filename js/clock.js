// Tout le carnet est écrit à l'heure de Pékin : le téléphone peut être resté à l'heure
// d'Europe (avion, eSIM qui traîne), donc on ne fait jamais confiance au fuseau local.
// On lit l'heure de Shanghai via Intl, quel que soit le réglage de l'appareil.
import { TRIP } from "./data.js";

export const MS_DAY = 86400000;
const FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hour12: false,
});

// { date:"2026-09-15", minutes: 934 } — minutes écoulées depuis minuit, heure de Pékin.
export function beijingNow(now = new Date()) {
  const p = {};
  for (const { type, value } of FMT.formatToParts(now)) p[type] = value;
  const hour = p.hour === "24" ? "00" : p.hour;   // Intl peut rendre 24:00 à minuit
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: +hour * 60 + +p.minute };
}

// Nombre de jours calendaires entre deux "YYYY-MM-DD" (b − a).
export function daysBetween(a, b) {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / MS_DAY);
}

export const toMinutes = t => { if (!t) return null; const [h, m] = t.split(":"); return +h * 60 + +m; };
export const fmtHour = t => { const [h, m] = t.split(":"); return m === "00" ? `${+h} h` : `${+h} h ${m}`; };

// Où en est-on du voyage ? day = n° de jour (1-15), ou null si on est hors dates.
export function tripPosition(now = new Date()) {
  const { date, minutes } = beijingNow(now);
  const idx = daysBetween(TRIP.firstDay, date);        // 0 = J1
  const total = daysBetween(TRIP.firstDay, TRIP.lastDay) + 1;
  if (idx < 0) return { phase: "before", day: null, date, minutes, countdown: -idx };
  if (idx >= total) return { phase: "after", day: null, date, minutes, since: idx - total + 1 };
  return { phase: "during", day: idx + 1, date, minutes };
}
