// Carnet de route — Chine, 11-26 septembre 2026.
// PWA vanilla, sans build : un dispatcher de rendu + délégation d'événements sur data-action,
// comme Muscu. Tout est hors-ligne : aucune requête réseau une fois l'app installée.
import { TRIP, TAGS, CITIES, BOOKED, TODOS, PREP, GUIDES, CHOICES, SHOPPING, BUDGET, PHRASES, BUILD } from "./data.js";
import { DAYS } from "./days.js";
import * as store from "./store.js";
import * as photos from "./photos.js";
import { tripPosition, toMinutes, fmtHour, daysBetween } from "./clock.js";

const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
let state = { tab: "today", day: null, guide: 0, q: "", showing: null };

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dayOf = n => DAYS.find(d => d.n === n);
const cityColor = c => (CITIES.find(x => x.key === c) || {}).color || "#7B8494";
const tagHTML = t => t ? `<span class="tag ${TAGS[t] || "mute"}">${esc(t)}</span>` : "";
const stepLabel = it => it.t ? fmtHour(it.t) : (it.label || "");
const mapsURL = q => "https://maps.apple.com/?q=" + encodeURIComponent(q);
// Un tableau [colonne1, colonne2, …] rendu en lignes empilées : titre, puis le reste
// en une ligne grise. Seul format lisible sur un écran de téléphone.
const listRows = (rows, fmt) => `<div class="card">${rows.map((r, i) => `
  <div class="lrow${i ? " sep" : ""}"><div class="lmain">${esc(r[0])}</div>
    <div class="lmeta">${esc((fmt ? fmt(r) : r.slice(1)).filter(x => x && x !== "—").join(" · "))}</div></div>`).join("")}</div>`;

function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2400);
}

// Jour affiché : celui qu'on a figé à la main, sinon celui de l'horloge de Pékin,
// sinon J1 avant le départ et J15 une fois rentré.
function currentDay() {
  const pinned = store.getPinnedDay();
  if (pinned) return pinned;
  const p = tripPosition();
  return p.phase === "during" ? p.day : (p.phase === "before" ? 1 : DAYS.length);
}

// Repère « maintenant » / « à suivre » dans la journée affichée, seulement si c'est vraiment aujourd'hui.
function marks(day) {
  const p = tripPosition();
  if (p.phase !== "during" || p.day !== day.n) return {};
  const timed = day.items.filter(i => i.t);
  let now = null, next = null;
  for (const it of timed) {
    if (toMinutes(it.t) <= p.minutes) now = it.id;
    else if (!next) next = it.id;
  }
  return { now, next, minutes: p.minutes };
}

// ---------- rendu ----------
let lastView = null;
function render() {
  const view = { today: viewToday, days: viewDays, guides: viewGuides, prep: viewPrep, phrases: viewPhrases }[state.tab] || viewToday;
  const key = state.tab + ":" + (state.tab === "today" ? currentDay() : state.guide);
  const keep = key === lastView ? (app.querySelector(".scroll")?.scrollTop || 0) : 0;
  app.innerHTML = view();
  renderTabbar();
  app.querySelector(".scroll").scrollTop = keep;   // même écran -> on reste où on était
  lastView = key;
  if (state.tab === "prep") refreshStorageLine();
}
function renderTabbar() {
  const tabs = [["today", "Aujourd'hui", "🧭"], ["days", "Jours", "📅"], ["guides", "Villes", "🏙️"], ["prep", "Pratique", "🎒"], ["phrases", "À montrer", "中"]];
  $("#tabbar").innerHTML = tabs.map(([k, l, i]) =>
    `<button class="tab ${state.tab === k ? "active" : ""}" data-tab="${k}"><span>${i}</span>${l}</button>`).join("");
}

// ---------- AUJOURD'HUI ----------
const shotCount = day => day.items.reduce((a, i) => a + photos.countForStep(i.id), 0);

function viewToday() {
  const n = currentDay(), day = dayOf(n), p = tripPosition(), m = marks(day);
  const total = day.items.length;
  const done = day.items.filter(i => store.isDone(i.id)).length;
  const isToday = p.phase === "during" && p.day === n;

  let kicker = `Jour ${n} sur ${DAYS.length}`;
  if (p.phase === "before") kicker = `Départ dans ${p.countdown} jour${p.countdown > 1 ? "s" : ""}`;
  else if (p.phase === "after") kicker = "Voyage terminé";
  else if (!isToday) kicker = `Jour ${n} · vous regardez un autre jour`;

  const hero = `<div class="hero">
    <div class="kicker">${esc(kicker)}</div>
    <div class="big">${esc(day.title)}</div>
    <div class="when">${esc(day.dow)}</div>
    <div class="city" style="box-shadow:inset 0 0 0 1px ${cityColor(day.city)}55">${esc(day.city)}</div>
    <div class="prog"><i style="width:${total ? Math.round(done / total * 100) : 0}%"></i></div>
    <div class="progtxt">${done} / ${total} étapes faites${shotCount(day) ? ` · ${shotCount(day)} photo${shotCount(day) > 1 ? "s" : ""}` : ""}</div>
  </div>`;

  const kpis = `<div class="kpis">${day.stats.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>`;
  const nav = `<div class="row" style="gap:8px;margin:10px 0">
    <button class="btn sm grow" data-action="day-prev" ${n <= 1 ? "disabled" : ""}>${n <= 1 ? "‹" : "‹ J" + (n - 1)}</button>
    ${store.getPinnedDay() ? `<button class="btn sm primary grow" data-action="unpin">Revenir à aujourd'hui</button>` : ""}
    <button class="btn sm grow" data-action="day-next" ${n >= DAYS.length ? "disabled" : ""}>${n >= DAYS.length ? "›" : "J" + (n + 1) + " ›"}</button>
  </div>`;

  return `<header class="head">
      <div><div class="eyebrow">Carnet de route</div><h1>${esc(TRIP.title)}</h1></div>
      <button class="link" data-action="search">🔍</button>
    </header>
    <div class="scroll">
      ${hero}${kpis}${alertsHTML(day)}${nav}
      ${dayBodyHTML(day, m)}
      <div class="pad"></div>
    </div>`;
}

// Réservations dont l'échéance tombe aujourd'hui ou est déjà passée sans être cochée.
function alertsHTML(day) {
  const open = TODOS.filter(t => !store.isTodoDone(t.id) && daysBetween(t.date, day.date) >= 0);
  if (!open.length) return "";
  const today = open.filter(t => daysBetween(t.date, day.date) === 0);
  const late = open.filter(t => daysBetween(t.date, day.date) > 0);
  const cards = today.map(t => `<div class="alert" data-action="todo" data-id="${t.id}">
      <h3>À réserver · c'est aujourd'hui</h3>
      <p><b>${esc(t.title)}</b><br><span class="sub">${esc(t.where)}</span></p></div>`).join("");
  const rest = late.length ? `<div class="alert" data-action="todo">
      <h3>${late.length} réservation${late.length > 1 ? "s" : ""} non cochée${late.length > 1 ? "s" : ""}</h3>
      <p class="sub">${late.map(t => esc(t.title)).join(" · ")}</p></div>` : "";
  return cards + rest;
}

// Les photos prises sur cette étape, en bande sous le texte.
function shotsHTML(stepId) {
  const list = photos.forStep(stepId);
  if (!list.length) return "";
  return `<div class="shots">${list.map(ph =>
    `<img class="shot" src="${ph.url}" alt="" loading="lazy" data-action="viewphoto" data-id="${ph.id}">`).join("")}</div>`;
}

function dayBodyHTML(day, m) {
  const tips = day.tips.map(t => `<div class="tip"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div>`).join("");
  const steps = day.items.map(it => {
    const done = store.isDone(it.id);
    const cls = done ? "done" : (it.id === m.now ? "now" : (it.id === m.next ? "next" : ""));
    const flag = !done && it.id === m.now ? `<div class="flag">Maintenant</div>`
      : !done && it.id === m.next ? `<div class="flag">À suivre</div>` : "";
    return `<div class="step ${cls}">
      <div class="when">${esc(stepLabel(it))}</div><div class="dot"></div>
      <div class="body" data-action="step" data-id="${it.id}">
        <div class="row">
          <div class="grow">${flag}<div class="title">${esc(it.title)}</div>
            ${it.tag ? `<div style="margin-top:5px">${tagHTML(it.tag)}</div>` : ""}</div>
          <div class="acts">
            ${it.place ? `<a class="pin" href="${mapsURL(it.place)}" target="_blank" rel="noopener" data-action="map" title="Ouvrir dans Plans">📍</a>` : ""}
            <button class="pin cam" data-action="addphoto" data-id="${it.id}" data-date="${day.date}" title="Ajouter une photo">📷</button>
            <button class="tick ${done ? "on" : ""}" data-action="tick" data-id="${it.id}">✓</button>
          </div>
        </div>
        ${shotsHTML(it.id)}
        <div class="text${it.id === m.now || it.id === m.next ? "" : " clamp"}">${esc(it.text)}</div>
      </div></div>`;
  }).join("");
  const note = store.getNote(day.date);
  return `${tips ? `<h2>À savoir</h2>${tips}` : ""}
    <h2>Le programme</h2><div class="tl">${steps}</div>
    <h2>Mes notes</h2>
    <textarea class="field" id="note" data-date="${day.date}" placeholder="Ce qu'on a vu, ce qu'on a payé, l'adresse qu'on veut retenir…">${esc(note)}</textarea>`;
}

// ---------- JOURS ----------
function viewDays() {
  const cur = currentDay();
  const cards = DAYS.map(d => {
    const done = d.items.filter(i => store.isDone(i.id)).length;
    const cls = d.n === cur ? "today" : (d.n < cur ? "past" : "");
    return `<div class="daycard ${cls}" data-action="goday" data-n="${d.n}">
      <div class="num" style="box-shadow:inset 0 0 0 2px ${cityColor(d.city)}"><b>J${d.n}</b></div>
      <div class="grow"><div class="ttl">${esc(d.title)}</div>
        <div class="sub"><i class="cdot" style="background:${cityColor(d.city)}"></i>${esc(d.city)} · ${esc(d.dow)} · ${done}/${d.items.length}</div></div>
      <span class="chev">›</span></div>`;
  }).join("");
  return `<header class="head"><div><div class="eyebrow">${esc(TRIP.dates)}</div><h1>Les 15 jours</h1></div>
      <button class="link" data-action="search">🔍</button></header>
    <div class="scroll"><p class="sub" style="margin:2px 4px 10px">${esc(TRIP.hero)}</p>${cards}<div class="pad"></div></div>`;
}

// ---------- VILLES (à la carte) ----------
function viewGuides() {
  const g = GUIDES[state.guide];
  const seg = GUIDES.map((x, i) => `<button class="${i === state.guide ? "on" : ""}" data-action="guide" data-i="${i}">${esc(x.city)}</button>`).join("");
  const table = g.table ? `<h2>Sites, tarifs et horaires</h2>${listRows(g.table.rows)}` : "";
  const secs = g.sections.map(s => `<h2>${esc(s.h)}</h2><div class="card">${s.items.map(([t, txt], i) =>
    `<div style="${i ? "border-top:1px solid var(--line);margin-top:11px;padding-top:11px" : ""}">
      <div class="title" style="font-size:15px">${esc(t)}</div>
      <div class="sub" style="margin-top:4px;line-height:1.5">${esc(txt)}</div></div>`).join("")}</div>`).join("");
  return `<header class="head"><div><div class="eyebrow">À la carte</div><h1>${esc(g.city)}</h1></div>
      <button class="link" data-action="search">🔍</button></header>
    <div class="scroll"><div class="seg">${seg}</div>
      <p class="sub" style="margin:2px 4px 12px;line-height:1.5">${esc(g.intro)}</p>
      ${table}${secs}<div class="pad"></div></div>`;
}

// ---------- PRATIQUE ----------
function viewPrep() {
  const todos = TODOS.map(t => {
    const done = store.isTodoDone(t.id);
    return `<div class="card sm" style="${done ? "opacity:.5" : ""}">
      <div class="row"><div class="grow">
        <div class="title" style="font-size:15px;${done ? "text-decoration:line-through" : ""}">${esc(t.title)}</div>
        <div class="sub" style="margin-top:4px">${tagHTML(t.level)} ${esc(t.where)}</div></div>
        <button class="tick ${done ? "on" : ""}" data-action="tick-todo" data-id="${t.id}">✓</button></div>
      <div class="sub" style="margin-top:8px;line-height:1.5">${esc(t.detail)}</div></div>`;
  }).join("");
  const booked = listRows(BOOKED);
  const prep = PREP.map(p => `<div class="card sm">
    <div class="title" style="font-size:15px">${p.icon} ${esc(p.title)}</div>
    <div class="sub" style="margin-top:5px;line-height:1.5">${esc(p.text)}</div></div>`).join("");
  const choices = CHOICES.map(c => `<div class="card">
    <div class="title" style="font-size:15px">${c.n}. ${esc(c.title)}</div>
    ${c.opts.map(([t, txt]) => `<div style="margin-top:10px"><b style="font-size:14px">${esc(t)}</b>
      <div class="sub" style="margin-top:3px;line-height:1.5">${esc(txt)}</div></div>`).join("")}
    <div class="tip" style="margin-bottom:0"><h3>Ce que je ferais</h3><p>${esc(c.verdict)}</p></div></div>`).join("");
  const shop = SHOPPING.map(s => `<div class="card sm">
    <div class="title" style="font-size:15px">${esc(s.title)}</div>
    <div class="sub" style="margin-top:5px;line-height:1.5;white-space:pre-line">${esc(s.text)}</div></div>`).join("");
  const budget = `<div class="card"><div class="tblwrap"><table class="tbl">
      <thead><tr><th>Poste</th><th>CNY</th><th>≈ EUR</th></tr></thead>
      <tbody>${BUDGET.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}
      <tr><td><b>${esc(BUDGET.total[0])}</b></td><td></td><td><b style="color:var(--gold)">${esc(BUDGET.total[1])}</b></td></tr>
      </tbody></table></div><div class="dim" style="margin-top:10px;line-height:1.5">${esc(BUDGET.foot)}</div></div>
    ${BUDGET.notes.map(([t, x]) => `<div class="card sm"><div class="title" style="font-size:15px">${esc(t)}</div>
      <div class="sub" style="margin-top:5px;line-height:1.5">${esc(x)}</div></div>`).join("")}`;

  return `<header class="head"><div><div class="eyebrow">Le dossier</div><h1>Pratique</h1></div>
      <button class="link" data-action="search">🔍</button></header>
    <div class="scroll">
      <h2>Réservations à prendre</h2>
      <p class="sub" style="margin:-2px 4px 8px">Déjà réservé de votre côté ? Touchez le ✓ : la ligne se barre et l'alerte rouge de l'écran « Aujourd'hui » disparaît.</p>${todos}
      <h2>Avant de partir</h2>${prep}
      <h2>Ce qui est verrouillé</h2>${booked}
      <h2>Les choix à faire</h2>${choices}
      <h2>Shopping</h2>${shop}
      <h2>Budget</h2>${budget}
      <h2>Sauvegarde</h2>
      <div id="storage" class="dim" style="margin:-2px 4px 8px"></div>
      <div class="card"><div class="sub" style="line-height:1.5">Vos coches, vos notes et vos photos vivent sur cet iPhone. Exportez de temps en temps dans Fichiers ou iCloud — le fichier contient les photos, il peut donc peser lourd.</div>
        <button class="btn big" data-action="export">Exporter mes notes</button>
        <button class="btn big" data-action="import">Importer une sauvegarde</button>
        <div class="dim" style="margin:-4px 4px 4px">Vous pourrez choisir de fusionner avec vos données ou de les remplacer.</div>
        <input type="file" id="importfile" accept="application/json,.json" hidden/>
        <button class="link danger" style="width:100%;margin-top:4px" data-action="reset">Tout effacer</button>
        <div class="dim" style="text-align:center;margin-top:8px">Carnet ${esc(BUILD)} · ${esc(TRIP.dates)}</div></div>
      <div class="pad"></div></div>`;
}

// ---------- À MONTRER ----------
function viewPhrases() {
  const body = PHRASES.map(g => `<h2>${esc(g.group)}</h2>${g.items.map(p =>
    `<div class="phrase" data-action="show" data-han="${esc(p.han)}" data-fr="${esc(p.fr)}" data-sub="${esc(p.sub)}">
      <div class="grow"><div class="han">${esc(p.han)}</div><div class="fr">${esc(p.fr)}</div>
        <div class="sub">${esc(p.sub)}</div></div><span class="chev">⤢</span></div>`).join("")}`).join("");
  return `<header class="head"><div><div class="eyebrow">Si les mots manquent</div><h1>À montrer</h1></div>
      <button class="link" data-action="search">🔍</button></header>
    <div class="scroll"><p class="sub" style="margin:2px 4px 10px;line-height:1.5">
      Touchez une carte : elle s'affiche en plein écran, assez gros pour être lue par un chauffeur.
      « Copier » met les caractères dans le presse-papier pour les coller dans Amap.</p>
      ${body}<div class="pad"></div></div>`;
}

function showCard(han, fr, sub) {
  const m = document.createElement("div"); m.className = "show"; m.id = "showcard";
  m.innerHTML = `<button class="close" data-action="close-show">Fermer</button>
    <div class="han">${esc(han)}</div><div class="fr">${esc(fr)}</div><div class="sub">${esc(sub)}</div>
    <div class="showacts">
      <a class="copy" href="${mapsURL(han)}" target="_blank" rel="noopener" data-action="map">📍 Plans</a>
      <button class="copy" data-action="copy" data-han="${esc(han)}">Copier pour Amap</button></div>`;
  document.body.appendChild(m);
}

// ---------- RECHERCHE ----------
// Un seul index à plat sur tout le carnet : c'est ce qui remplace le feuilletage du PDF.
let INDEX = null;
function buildIndex() {
  if (INDEX) return INDEX;
  const ix = [];
  DAYS.forEach(d => {
    ix.push({ where: `Jour ${d.n} · ${d.dow}`, title: d.title, text: d.tips.map(t => t.title + " " + t.text).join(" "), go: () => goDay(d.n) });
    d.items.forEach(it => ix.push({ where: `J${d.n} · ${stepLabel(it)} · ${d.city}`, title: it.title, text: it.text, go: () => goDay(d.n) }));
  });
  GUIDES.forEach((g, i) => g.sections.forEach(s => s.items.forEach(([t, txt]) =>
    ix.push({ where: g.city, title: t, text: txt, go: () => { state.tab = "guides"; state.guide = i; render(); } }))));
  GUIDES.forEach((g, i) => (g.table ? g.table.rows : []).forEach(r =>
    ix.push({ where: `${g.city} · tarifs`, title: r[0], text: r.slice(1).join(" · "), go: () => { state.tab = "guides"; state.guide = i; render(); } })));
  PREP.forEach(p => ix.push({ where: "Avant de partir", title: p.title, text: p.text, go: () => { state.tab = "prep"; render(); } }));
  TODOS.forEach(t => ix.push({ where: "À réserver", title: t.title, text: t.where + " " + t.detail, go: () => { state.tab = "prep"; render(); } }));
  BOOKED.forEach(r => ix.push({ where: "Réservé", title: r[0], text: r[1] + " · " + r[2], go: () => { state.tab = "prep"; render(); } }));
  SHOPPING.forEach(s => ix.push({ where: "Shopping", title: s.title, text: s.text, go: () => { state.tab = "prep"; render(); } }));
  CHOICES.forEach(c => ix.push({ where: "Les choix à faire", title: c.title, text: c.opts.map(o => o.join(" ")).join(" ") + " " + c.verdict, go: () => { state.tab = "prep"; render(); } }));
  PHRASES.forEach(g => g.items.forEach(p =>
    ix.push({ where: `À montrer · ${g.group}`, title: `${p.han} — ${p.fr}`, text: p.sub, go: () => { state.tab = "phrases"; render(); } })));
  INDEX = ix;
  return ix;
}
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
function hilite(s, q) {
  const i = norm(s).indexOf(q);
  if (i < 0) return esc(s);
  return esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length));
}
function openSearch() {
  const m = document.createElement("div"); m.className = "modal"; m.dataset.action = "close-modal";
  m.innerHTML = `<div class="sheet" data-action="stop" style="height:88vh">
    <div class="row"><input id="q" class="field grow" placeholder="Chercher : hot pot, passeport, Wulong…" autocomplete="off"/>
      <button class="link strong" data-action="close-modal">OK</button></div>
    <div id="hits"><p class="dim" style="margin-top:20px">Tapez deux lettres. La recherche couvre les 15 jours, les pages par ville, le pratique et les cartes à montrer.</p></div></div>`;
  document.body.appendChild(m);
  const input = $("#q"); input.focus();
  input.addEventListener("input", () => runSearch(input.value));
}
let hits = [];
function runSearch(q) {
  const box = $("#hits"); if (!box) return;
  const nq = norm(q.trim());
  if (nq.length < 2) { hits = []; box.innerHTML = `<p class="dim" style="margin-top:20px">Tapez deux lettres.</p>`; return; }
  hits = buildIndex().filter(e => norm(e.title).includes(nq) || norm(e.text).includes(nq)).slice(0, 60);
  box.innerHTML = hits.length
    ? hits.map((h, i) => `<div class="hit" data-action="hit" data-i="${i}">
        <div class="where">${esc(h.where)}</div>
        <div class="title">${hilite(h.title, nq)}</div>
        <div class="text">${hilite(h.text, nq)}</div></div>`).join("")
    : `<p class="dim" style="margin-top:20px">Rien pour « ${esc(q)} ».</p>`;
}

function goDay(n) { state.tab = "today"; store.setPinnedDay(n === currentDayAuto() ? null : n); render(); }
function currentDayAuto() { const p = tripPosition(); return p.phase === "during" ? p.day : (p.phase === "before" ? 1 : DAYS.length); }

// ---------- événements ----------
document.addEventListener("click", e => {
  const tab = e.target.closest("[data-tab]");
  if (tab) { state.tab = tab.dataset.tab; return render(); }
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const a = el.dataset.action, id = el.dataset.id;

  if (a === "stop") return;
  if (a === "map") { e.stopPropagation(); return; }   // laisse l'ancre ouvrir Plans
  if (a === "close-modal") return document.querySelector(".modal")?.remove();
  if (a === "close-show") return document.getElementById("showcard")?.remove();
  if (a === "search") return openSearch();
  if (a === "hit") { const h = hits[+el.dataset.i]; document.querySelector(".modal")?.remove(); return h && h.go(); }
  if (a === "show") { e.stopPropagation(); return showCard(el.dataset.han, el.dataset.fr, el.dataset.sub); }
  if (a === "copy") {
    const txt = el.dataset.han;
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
      .then(() => toast("Copié — collez dans Amap")).catch(() => toast("Copie impossible : recopiez à la main"));
    return;
  }
  if (a === "tick") { e.stopPropagation(); store.toggleDone(id); return render(); }
  if (a === "tick-todo") { e.stopPropagation(); store.toggleTodo(id); return render(); }
  if (a === "todo") { state.tab = "prep"; return render(); }
  if (a === "step") return openStep(id);
  if (a === "addphoto") { e.stopPropagation(); return pickPhoto(id, el.dataset.date); }
  if (a === "viewphoto") { e.stopPropagation(); return viewPhoto(id); }
  if (a === "delphoto") {
    if (!confirm("Supprimer cette photo ?")) return;
    return photos.remove(id).then(() => { document.getElementById("photoview")?.remove(); photos.releaseFull(); render(); toast("Photo supprimée"); });
  }
  if (a === "close-photo") { document.getElementById("photoview")?.remove(); return photos.releaseFull(); }
  if (a === "goday") return goDay(+el.dataset.n);
  if (a === "guide") { state.guide = +el.dataset.i; return render(); }
  if (a === "day-prev") return goDay(Math.max(1, currentDay() - 1));
  if (a === "day-next") return goDay(Math.min(DAYS.length, currentDay() + 1));
  if (a === "unpin") { store.setPinnedDay(null); return render(); }
  if (a === "export") return doExport();
  if (a === "import") return $("#importfile").click();
  if (a === "import-merge") return appliquerImport("merge");
  if (a === "import-replace") {
    if (!confirm("Remplacer vos coches et vos notes par celles du fichier ? Vos données actuelles seront perdues.")) return;
    return appliquerImport("replace");
  }
  if (a === "reset") {
    if (confirm("Effacer vos coches, vos notes et vos photos ? Le carnet lui-même reste intact.")) {
      store.reset();
      photos.clear(TRIP.id).then(() => { render(); toast("Remis à zéro"); });
    }
    return;
  }
});

// Fiche détaillée d'une étape : le texte entier plus la case à cocher, sans quitter la timeline.
function openStep(id) {
  let day = null, it = null;
  for (const d of DAYS) { const f = d.items.find(x => x.id === id); if (f) { day = d; it = f; break; } }
  if (!it) return;
  const done = store.isDone(id);
  const m = document.createElement("div"); m.className = "modal"; m.dataset.action = "close-modal";
  m.innerHTML = `<div class="sheet" data-action="stop">
    <div class="row"><div class="grow"><div class="dim">J${day.n} · ${esc(day.dow)} · ${esc(stepLabel(it))}</div>
      <div class="title">${esc(it.title)}</div></div>
      <button class="link strong" data-action="close-modal">Fermer</button></div>
    ${it.tag ? `<div style="margin-top:8px">${tagHTML(it.tag)}</div>` : ""}
    <p>${esc(it.text)}</p>
    ${it.place ? `<div class="row" style="gap:8px;margin-top:12px">
      <a class="btn primary grow" style="text-align:center;text-decoration:none" href="${mapsURL(it.place)}" target="_blank" rel="noopener" data-action="map">📍 Ouvrir dans Plans</a>
      <button class="btn" data-action="copy" data-han="${esc(it.place)}">Copier</button></div>
      <div class="dim" style="margin-top:6px">Recherché : ${esc(it.place)}</div>` : ""}
    ${shotsHTML(id)}
    <button class="btn big" data-action="addphoto" data-id="${id}" data-date="${day.date}">📷 Ajouter une photo</button>
    <button class="btn big ${done ? "" : "primary"}" data-action="tick" data-id="${id}">${done ? "✓ Fait — décocher" : "Marquer comme fait"}</button>
  </div>`;
  document.body.appendChild(m);
}

// Un <input file> masqué, recréé à chaque fois : sur iOS il propose « Photothèque » et
// « Prendre une photo ». Pas de `capture`, sinon on force l'appareil et on perd la
// possibilité d'ajouter une photo déjà prise.
function pickPhoto(stepId, dayDate) {
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = "image/*"; inp.multiple = true; inp.hidden = true;
  document.body.appendChild(inp);
  inp.addEventListener("change", async () => {
    const files = [...inp.files];
    inp.remove();
    if (!files.length) return;
    toast(files.length > 1 ? `Ajout de ${files.length} photos…` : "Ajout de la photo…");
    let ok = 0, illisible = 0, plein = false;
    for (const f of files) {
      try { await photos.add(TRIP.id, stepId, dayDate, f); ok++; }
      catch (err) {
        if (err && (err.name === "QuotaExceededError" || err.name === "NotEnoughSpace")) { plein = true; break; }
        illisible++;
      }
    }
    document.querySelector(".modal")?.remove();
    render();
    if (plein) toast("Plus de place sur l'appareil. Exportez vos photos, puis effacez-en.");
    else if (illisible) toast(`${illisible} photo(s) illisible(s)${ok ? ` · ${ok} ajoutée(s)` : ""}`);
    else toast(ok > 1 ? `${ok} photos ajoutées` : "Photo ajoutée");
  });
  inp.click();
}

async function viewPhoto(id) {
  const url = await photos.fullURL(id);
  if (!url) return toast("Photo introuvable");
  const v = document.createElement("div"); v.className = "show"; v.id = "photoview";
  v.innerHTML = `<button class="close" data-action="close-photo">Fermer</button>
    <img class="fullshot" src="${url}" alt="">
    <div class="showacts"><button class="copy" data-action="delphoto" data-id="${id}">Supprimer</button></div>`;
  document.body.appendChild(v);
}

document.addEventListener("input", e => {
  if (e.target.id === "note") store.setNote(e.target.dataset.date, e.target.value);
});
let fichierImport = null;   // contenu du fichier choisi, en attente du choix fusionner/remplacer

document.addEventListener("change", e => {
  if (e.target.id === "importfile" && e.target.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      try { proposerImport(r.result, store.inspectJSON(r.result)); }
      catch (err) { toast("Fichier illisible"); }
    };
    r.readAsText(e.target.files[0]);
    e.target.value = "";     // permet de rechoisir le même fichier ensuite
  }
});

// On n'écrase jamais sans demander : un import qui remplace efface les coches et les
// notes de celui qui importe, ce qui est exactement l'inverse du but quand on tient le
// carnet à deux.
function proposerImport(txt, info) {
  fichierImport = txt;
  const m = document.createElement("div"); m.className = "modal"; m.dataset.action = "close-modal";
  const quand = info.date ? new Date(info.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : null;
  m.innerHTML = `<div class="sheet" data-action="stop">
    <div class="row"><div class="grow"><div class="title">Importer cette sauvegarde</div>
      ${quand ? `<div class="dim">Exportée le ${esc(quand)}</div>` : ""}</div>
      <button class="link strong" data-action="close-modal">Annuler</button></div>
    <p class="sub">Le fichier contient <b>${info.coches} étape(s) cochée(s)</b>, ${info.resas} réservation(s),
      ${info.notes} note(s) et <b>${info.photos} photo(s)</b>.</p>
    <button class="btn big primary" data-action="import-merge">Fusionner avec mes données</button>
    <div class="dim" style="margin:-4px 4px 10px">Additionne les deux carnets. Les coches s'ajoutent, les notes d'un même jour sont conservées toutes les deux, les photos se cumulent. À utiliser pour mettre en commun deux téléphones.</div>
    <button class="btn big" data-action="import-replace">Remplacer mes données</button>
    <div class="dim" style="margin:-4px 4px 0">Efface vos coches et vos notes actuelles. À utiliser pour restaurer une sauvegarde sur un appareil neuf.</div>
  </div>`;
  document.body.appendChild(m);
}

async function appliquerImport(mode) {
  if (!fichierImport) return;
  const txt = fichierImport; fichierImport = null;
  document.querySelector(".modal")?.remove();
  try {
    const shots = store.importJSON(txt, mode);
    if (shots.length) toast(`Import de ${shots.length} photo(s)…`);
    await photos.importAll(shots);
    await photos.init(TRIP.id);
    render();
    toast(mode === "merge" ? "Carnets fusionnés" : "Sauvegarde restaurée");
  } catch (err) {
    toast(err && err.name === "QuotaExceededError" ? "Plus de place pour les photos importées" : "Import impossible");
  }
}
async function doExport() {
  if (photos.total()) toast("Préparation de l'export…");
  let shots = [];
  try { shots = await photos.exportAll(TRIP.id); } catch (e) { toast("Photos illisibles, export des notes seules"); }
  const blob = new Blob([store.exportJSON(shots)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `carnet-chine-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  const mo = (blob.size / 1048576).toFixed(1);
  toast(`Export prêt (${mo} Mo) — enregistrez-le dans Fichiers`);
}
// De retour au premier plan : l'heure a pu changer de créneau, voire de jour.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.tab === "today" && !document.querySelector(".modal")) render();
});
setInterval(() => {
  if (state.tab !== "today") return;
  if (document.querySelector(".modal") || document.getElementById("showcard")) return;
  if (document.activeElement && document.activeElement.id === "note") return;  // on écrit : on ne redessine pas
  render();
}, 60000);

// L'espace restant se lit de façon asynchrone : on l'écrit dans l'onglet Pratique
// après coup, plutôt que de retarder tout le rendu pour une ligne d'information.
async function refreshStorageLine() {
  const el = $("#storage"); if (!el) return;
  const e = await photos.estimate();
  const n = photos.total();
  const parts = [`${n} photo${n > 1 ? "s" : ""} sur cet appareil`];
  if (e && e.quota) parts.push(`${(e.usage / 1048576).toFixed(0)} Mo utilisés · encore ~${e.reste} photos`);
  el.textContent = parts.join(" · ");
}

// ---------- démarrage ----------
// On charge les vignettes avant de dessiner, pour que le rendu reste synchrone ensuite.
// Si IndexedDB est indisponible (mode privé), on dessine quand même : l'app marche sans photos.
photos.requestPersist();
photos.init(TRIP.id).catch(() => {}).then(render);
// Même schéma que Muscu : dès qu'un nouveau service worker prend la main, on recharge une
// fois — sinon la PWA iOS reste collée à l'ancienne version. Pas de reload à la 1re install.
if ("serviceWorker" in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing || !hadController) return;
    refreshing = true; location.reload();
  });
  navigator.serviceWorker.register("./sw.js").then(reg => { try { reg.update(); } catch (e) {} }).catch(() => {});
}
