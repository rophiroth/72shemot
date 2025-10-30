/* -----------------------------------------------------------
   assets/js/app.js
   Lógica de:
   • cálculo de horario desde amanecer
   • tabla de 72 nombres
   • caja “Nombre actual” (fila resumida completa)
   • enlaces directos a YouTube (videoMap)
   • botón y fila clickeable
----------------------------------------------------------- */
(() => {
  // Evitar parpadeo inicial: no renderizar hasta tener amanecer/ubicación
  let bootReady = false;
  /* ---------- 1. Mapa de IDs de video (72) ---------- */
  const videoMap = {
    1:"AxAkSi2HzMA", 2:"AS8WljNP97k", 3:"uDut85DYlFY", 4:"E3ifDBHTQGA", 5:"T8-nqb2riAc",
   6:"UVX1qBn84DQ", 7:"Ai_qEFvi0oY", 8:"ZwEet6qQ4BM", 9:"gaPuaCyHd6A", 10:"FIJYjTlYjgQ",
   11:"WrhDNbfsWRI", 12:"Yns_Q93sMKU", 13:"TU08hBsH5Z4", 14:"CY54pA7vJQ8", 15:"xO5s6yXJ5cc",
   16:"FOdiWQr7i3w", 17:"Losvwml-EWU", 18:"UrVhiVEh0FA", 19:"pu_e_OF_x18", 20:"ep784S2tLL8",
   21:"0ijRC6ruWiM", 22:"gi8_ZXjL7sw", 23:"zSMbhmoplxE", 24:"LRkbakNZLrA", 25:"H2tuqcY3Gi0",
   26:"U5rk3XFIRUw", 27:"_EIicTeFPZk", 28:"FftcBtq1z1A", 29:"GAkuDtVY6Ho", 30:"54RmhPuuEm4",
   31:"U-hfaoEPOz8", 32:"m22NW2WGKr0", 33:"3P7x4UQ0mfM", 34:"h0L7dCI5Dpk", 35:"vT1-0Ps_jCI",
   36:"gGZXSBRGwqg", 37:"zd7wdVYvrog", 38:"LQdnyajTccM", 39:"juYFQfMh_Wc", 40:"ltXRerbqI4w",
   41:"HvYhDwZ6W5E", 42:"khmNEqrsAlw", 43:"brmY8V8VP50", 44:"L5zofvENPIk", 45:"vC72_Qn4ZR4",
   46:"qGeGk5GXrnA", 47:"cDYNCfQVwIc", 48:"Er9B_swvRQE", 49:"u_uRj0D6O9Q", 50:"SU5CGmwj_1k",
   51:"zlDV-11IAs4", 52:"5EMq4hvhxRQ", 53:"aZAFzNWt484", 54:"AaZKP-D14OM", 55:"Jomb3_GEs6U",
   56:"0aHtQOOSA6k", 57:"84W0E-aO-KE", 58:"WQI8sQ2_RMY", 59:"afie00e87QQ", 60:"SxiWaplWJ0E",
   61:"NlQUyxCThe8", 62:"SgMB7GQZ8c0", 63:"Zd3l2VEVXJ4", 64:"vr7TH0y6XdY", 65:"SD0TkfPD72U",
   66:"JvQhqbXL83M", 67:"x3kcQVtUy7Q", 68:"aywriayaBUU", 69:"61jumO-NcNA", 70:"99GJP3mttqM",
   71:"Cs2nzAiftw0", 72:"ldzNG7whB9w"
  };
  const linkFor = i => `https://www.youtube.com/watch?v=${videoMap[i]}`;

  // Try to load updated video IDs from JSON (keeps code decoupled from content)
  try {
    fetch('assets/js/videos.json?v=' + Date.now())
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!j) return;
        Object.keys(j).forEach(k => {
          const idx = parseInt(k, 10);
          if (!isNaN(idx) && j[k]) videoMap[idx] = j[k];
        });
        console.log('🎬 Video map loaded from videos.json');
      })
      .catch(err => console.warn('⚠️ Could not load videos.json', err));
  } catch (e) {
    console.warn('⚠️ videos.json preload failed', e);
  }

  /* ---------- 2. DOM references ---------- */
  const tzSel   = document.getElementById('tz');
  const sunrise = document.getElementById('sunrise');
  // Note: do not cache time cells; table can change with 12h mode
  const menuBtn  = document.getElementById('menuBtn');
  const optionsPanel = document.getElementById('optionsPanel');

  const curTime = document.getElementById('curTime');
  const curName = document.getElementById('curName');
  const curDesc = document.getElementById('curDesc');
  const curBtn  = document.getElementById('curBtn');
  const curOrd  = document.getElementById('curOrd');
  const curHeading = document.getElementById('curHeading');
  const curStam = document.getElementById('curStam');
  const curMeta = document.getElementById('curMeta');
  const curLet  = document.getElementById('curLet');
  const curGem  = document.getElementById('curGem');
  const curZod  = document.getElementById('curZod');
  const curDur  = document.getElementById('curDur');
  // 12h mode control (checkbox, hidden) and anchor-at-sunrise (visible)
  const twelveToggle = document.getElementById('twelveToggle');
  const anchorToggle  = document.getElementById('anchorSun');
  const solarToggle   = document.getElementById('solarAdjust');
  const latDegWrap    = document.getElementById('latDegWrap');
  const latDegInput   = document.getElementById('latDeg');

  // Keep sunrise/sunset minutes (local TZ minutes since 00:00)
  const sun = { sunriseMin: null, sunsetMin: null, nextSunriseMin: null, nextSunsetMin: null };

  // Preferences per-tab: use sessionStorage for active tab, fall back to localStorage for initial default
  const getPref12 = () => {
    try {
      const s = sessionStorage.getItem('mode12');
      if (s !== null) return s === '1';
      const l = localStorage.getItem('mode12');
      return l === '1';
    } catch (_) { return false; }
  };
  const setPref12 = (v) => { try { sessionStorage.setItem('mode12', v ? '1' : '0'); } catch (_) {} };
  const getAnchorPref = () => {
    try {
      const s = sessionStorage.getItem('anchorSunrise');
      if (s !== null) return s === '1';
      const l = localStorage.getItem('anchorSunrise');
      return l === '1';
    } catch (_) { return false; }
  };
  const setAnchorPref = (v) => { try { sessionStorage.setItem('anchorSunrise', v ? '1' : '0'); } catch (_) {} };
  const getSolarPref = () => {
    try {
      const s = sessionStorage.getItem('solarAdjust');
      if (s !== null) return s === '1';
      const l = localStorage.getItem('solarAdjust');
      return l === '1';
    } catch (_) { return false; }
  };
  const setSolarPref = (v) => { try { sessionStorage.setItem('solarAdjust', v ? '1' : '0'); } catch (_) {} };
  let timeline = null; // computed starts per slot when solar adjust is ON

  function ensureCoords() {
    if (!window.coords) window.coords = { lat: 0, lon: 0 };
    return window.coords;
  }

  function syncLatUIFromCoords() {
    if (!latDegInput) return;
    const c = ensureCoords();
    if (typeof c.lat === 'number' && !isNaN(c.lat)) {
      latDegInput.value = (Math.round(c.lat * 10) / 10).toString();
    }
  }

  /* ---------- 3. Safe access to data from PHP ---------- */
  const n = window.names || [];
  const d = window.descs || [];

  /* ---------- 4. Helpers ---------- */
  const two = n => n.toString().padStart(2, '0');
  const mins = (h, m) => (h * 60 + m) % 1440;
  const formatTime = (totalMin, withSeconds) => {
    // Normalize and convert to whole seconds
    let tMin = ((totalMin % 1440) + 1440) % 1440;
    let totalSec = Math.round(tMin * 60);
    totalSec = ((totalSec % 86400) + 86400) % 86400;
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = totalSec % 60;
    return withSeconds ? `${two(hh)}:${two(mm)}:${two(ss)}` : `${two(hh)}:${two(mm)}`;
  };
  const hmToMins = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string') return null;
    // Normalize possible "HH:MM SS" (space) into "HH:MM:SS"
    const norm = hhmm.replace(/\s+/, ':').trim();
    const parts = norm.split(':').map(Number);
    const h = parts[0], m = parts[1], s = (parts.length > 2 ? parts[2] : 0) || 0;
    if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
    const total = (h * 60) + m + (s / 60);
    return ((total % 1440) + 1440) % 1440;
  };
  const inWindow = (nowMin, startMin, dur) => {
    // checks if now in [start, start+dur) modulo 1440
    const end = (startMin + dur) % 1440;
    if (dur >= 1440) return true;
    return startMin <= end
      ? (nowMin >= startMin && nowMin < end)
      : (nowMin >= startMin || nowMin < end);
  };
  // Hebrew-aware reverse: handle final (sofit) letter forms correctly
  // Base → Final map and reverse (Final → Base)
  const HEB_FINALS = { 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' };
  const HEB_FINALS_REV = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
  const isHebLetter = ch => /[\u0590-\u05FF]/.test(ch);
  const toBaseForm = ch => HEB_FINALS_REV[ch] || ch;
  const toFinalIfPossible = ch => (HEB_FINALS[ch] || ch);
  const reverseHeb = s => {
    if (typeof s !== 'string' || !s) return s;
    // Split by whitespace to handle per-token finalization, then rejoin
    return s.split(/(\s+)/).map(token => {
      if (!token.trim()) return token; // keep spaces as-is
      // Normalize any final letters to base, then reverse
      const baseChars = Array.from(token).map(toBaseForm);
      const rev = baseChars.reverse();
      // Apply final form to the last Hebrew letter in this reversed token
      for (let i = rev.length - 1; i >= 0; i--) {
        if (isHebLetter(rev[i])) {
          rev[i] = toFinalIfPossible(rev[i]);
          break;
        }
      }
      return rev.join('');
    }).join('');
  };
  const reverseWords = s => (typeof s === 'string') ? s.split(/\s+/).reverse().join(' ') : s;

  const formatDuration = (minsVal) => {
    const lang = (window.I18N && window.I18N.getLang && window.I18N.getLang()) || 'es';
    const val = Math.round(minsVal * 10) / 10; // 1 decimal
    if (lang === 'en') {
      return `${val.toFixed(1)} min`;
    }
    // ES default: decimal comma and prime for minutes
    return `${val.toFixed(1).replace('.', ',')}′`;
  };

  function isTwelveMode() { return getPref12(); }

  function getNowLocalHM() {
    const tz = (tzSel && tzSel.value) ? tzSel.value : (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    const nowStr = new Date().toLocaleString('en-US', {
      timeZone: tz,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const parts = nowStr.split(':').map(Number);
    const h = parts[0], m = parts[1], s = (parts.length > 2 ? parts[2] : 0) || 0;
    const baseMin = mins(h, m);
    const nowMin = baseMin + (isNaN(s) ? 0 : (s / 60));
    return { h, m, nowMin };
  }

  function getSchedule() {
    // recompute sunriseMin from input value (user may edit)
    const sr = hmToMins(sunrise.value);
    if (sr != null) sun.sunriseMin = sr;
    const nightBaseFallback = sun.sunriseMin != null ? (sun.sunriseMin + 720) % 1440 : null;
    const baseSunset = (sun.sunsetMin != null) ? sun.sunsetMin : nightBaseFallback;
    if (isTwelveMode() && sun.sunriseMin != null && baseSunset != null) {
      const base = getAnchorPref() ? baseSunset : sun.sunriseMin; // ✅ checked=🌇 (sunset), unchecked=🌅 (sunrise)
      return { mode: 'ten', base, delta: 10 };
    }
    // Classic 20-min mode; allow anchor toggle to pick base (sunrise or sunset)
    let base;
    if (getAnchorPref()) {
      // ✅ checked = sunset as base
      base = (baseSunset != null) ? baseSunset : (nightBaseFallback != null ? nightBaseFallback : hmToMins('18:00'));
    } else {
      // unchecked = sunrise as base
      base = (sun.sunriseMin != null) ? sun.sunriseMin : hmToMins('06:00');
    }
    return { mode: 'twenty', base, delta: 20 };
  }

  function buildTimeline() {
    timeline = null;
    if (!getSolarPref()) return;
    const haveSun = (sun.sunriseMin != null && sun.sunsetMin != null);
    const haveNext = (sun.nextSunriseMin != null && sun.nextSunsetMin != null);
    if (!haveSun || !haveNext) return;
    const useTen = isTwelveMode();
    const anchorSunset = getAnchorPref();

    const dayStart = sun.sunriseMin, dayEnd = sun.sunsetMin;
    const nightStart = sun.sunsetMin, nightEnd = sun.nextSunriseMin;
    const dayDur = (dayEnd - dayStart + 1440) % 1440;
    const nightDur = (nightEnd - nightStart + 1440) % 1440;

    if (useTen) {
      const daySlots = 72, nightSlots = 72;
      const dayStep = dayDur / daySlots;
      const nightStep = nightDur / nightSlots;
      const arr = [];
      if (anchorSunset) {
        for (let i = 0; i < nightSlots; i++) arr.push((nightStart + i * nightStep) % 1440);
        for (let i = 0; i < daySlots; i++) arr.push((dayStart + i * dayStep) % 1440);
      } else {
        for (let i = 0; i < daySlots; i++) arr.push((dayStart + i * dayStep) % 1440);
        for (let i = 0; i < nightSlots; i++) arr.push((nightStart + i * nightStep) % 1440);
      }
      timeline = arr;
    } else {
      const daySlots = 36, nightSlots = 36;
      const dayStep = dayDur / daySlots;
      const nightStep = nightDur / nightSlots;
      const arr = [];
      if (anchorSunset) {
        for (let i = 0; i < nightSlots; i++) arr.push((nightStart + i * nightStep) % 1440);
        for (let i = 0; i < daySlots; i++) arr.push((dayStart + i * dayStep) % 1440);
      } else {
        for (let i = 0; i < daySlots; i++) arr.push((dayStart + i * dayStep) % 1440);
        for (let i = 0; i < nightSlots; i++) arr.push((nightStart + i * nightStep) % 1440);
      }
      timeline = arr;
    }
  }
  const zodiacEmoji = ['♈︎','♉︎','♊︎','♋︎','♌︎','♍︎','♎︎','♏︎','♐︎','♑︎','♒︎','♓︎'];

  function openMedit(i) {
    window.open(linkFor(i), '_blank');
  }
  window.openMedit = openMedit;

  /* ---------- 5. Rendering ---------- */
  // Manage 72 vs 144 rows depending on mode
  function ensureRowsForMode() {
    const tbody = document.querySelector('#shemotTable tbody');
    if (!tbody) return;
    const tenMode = isTwelveMode();
    // Always consider the first 72 non-extra rows as base
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const extras = rows.filter(r => r.classList.contains('extra-half'));
    const baseRows = rows.filter(r => !r.classList.contains('extra-half')).slice(0, 72);
    // Mark base rows as night half for disambiguation
    baseRows.forEach(r => { if (!r.dataset.half) r.dataset.half = 'night'; });
    if (tenMode) {
      if (extras.length === 0) {
        // Clone base 72 rows to make day half
        baseRows.forEach(r => {
          const clone = r.cloneNode(true);
          clone.classList.add('extra-half');
          clone.dataset.half = 'day';
          // Keep same data-ord to preserve ord display; differentiate only by position
          // Add row click handler like originals
          clone.addEventListener('click', () => {
            const ord = parseInt(clone.getAttribute('data-ord') || '0', 10);
            if (ord) openMedit(ord);
          });
          tbody.appendChild(clone);
        });
        try { console.log(`➕ Duplicadas filas para 10-min: base=${baseRows.length}, total=${tbody.querySelectorAll('tr').length}`); } catch(_) {}
      }
    } else {
      // Remove extra half if present
      extras.forEach(r => r.remove());
      try { console.log(`➖ Removidas filas extra. Total ahora=${tbody.querySelectorAll('tr').length}`); } catch(_) {}
    }
  }

  function renderTable(_baseIgnored) {
    ensureRowsForMode();
    const sched = getSchedule();
    const rows = Array.from(document.querySelectorAll('#shemotTable tbody tr'));
    const base = sched.base;
    const delta = sched.delta;
    const showSeconds = getSolarPref() && Array.isArray(timeline) && timeline.length >= rows.length;

    rows.forEach((tr, i) => {
      const useSolar = getSolarPref() && Array.isArray(timeline) && timeline.length >= rows.length;
      const t = useSolar ? timeline[i] : (base + i * delta) % 1440;
      const durMin = useSolar
        ? ((timeline[(i + 1) % rows.length] - t + 1440) % 1440)
        : delta;
      const ordNum = (i % 72) + 1;
      const idxName = ordNum - 1;
      const reverseLetters = (sched.mode === 'ten') && (sun.sunriseMin != null)
        ? inWindow(t, sun.sunriseMin, 720)
        : false;

      // Hora de inicio en 2 líneas: hora arriba, duración abajo
      const tdTime = tr.children[1];
      tdTime.innerHTML = `${formatTime(t, showSeconds)}<br><span class="slot-dur">⏳ ${formatDuration(durMin)}</span>`;

      // Nombre hebreo (stam + meta)
      const baseName = n[idxName] || '';
      const displayName = reverseLetters ? reverseHeb(baseName) : baseName;
      const stamEl = tr.querySelector('.hebrew-box .stam');
      const metaEl = tr.querySelector('.hebrew-box .meta');
      if (stamEl) stamEl.textContent = displayName;
      if (metaEl) metaEl.textContent = displayName;

      // Fonética (invertida en día)
      const phonEl = tr.querySelector('.phonetic');
      if (phonEl) {
        const basePhon = phonEl.dataset.base || phonEl.textContent;
        phonEl.dataset.base = basePhon;
        phonEl.textContent = reverseLetters ? reverseWords(basePhon) : basePhon;
      }

      // Orden visible + Zodíaco
      const ordNumEl = tr.querySelector('.ord .ord-num');
      if (ordNumEl) ordNumEl.textContent = ordNum;
      const zEl = tr.querySelector('.ord .zodiac');
      if (zEl) {
        const zIdx = Math.floor((ordNum - 1) / 6);
        const zEmoji = ['♈︎','♉︎','♊︎','♋︎','♌︎','♍︎','♎︎','♏︎','♐︎','♑︎','♒︎','♓︎'];
        zEl.textContent = zEmoji[zIdx] || '';
        try {
          const lang = (window.I18N && window.I18N.getLang && window.I18N.getLang()) || 'es';
          const names = (window.I18N && window.I18N.zodiacNames && window.I18N.zodiacNames[lang]) || [];
          zEl.setAttribute('title', names[zIdx] || '');
          zEl.setAttribute('aria-label', names[zIdx] || '');
        } catch (_) {}
      }
    });
  }


    function renderCurrent(_baseIgnored) {
      const { nowMin } = getNowLocalHM();
      const sched = getSchedule();
      const base = sched.base;
      const delta = sched.delta;
      let pos;
      if (getSolarPref() && Array.isArray(timeline) && timeline.length) {
        // Estimate position by scanning timeline for last start <= now, considering wrap
        const idx = (() => {
          let best = 0; let bestDiff = 1e9;
          for (let i = 0; i < timeline.length; i++) {
            const t = timeline[i];
            let diff = (nowMin - t + 1440) % 1440;
            if (diff < bestDiff) { bestDiff = diff; best = i; }
          }
          return best;
        })();
        pos = idx;
      } else {
        pos = Math.floor(((nowMin - base + 1440) % 1440) / delta);
      }
      const ord = (pos % 72) + 1;
      const idx = ord - 1;
      const reverseLetters = (sched.mode === 'ten') && (sun.sunriseMin != null)
        ? inWindow(nowMin, sun.sunriseMin, 720)
        : false;
      const useSolar = getSolarPref() && Array.isArray(timeline) && timeline.length;
      const start = useSolar ? timeline[pos % timeline.length] : (base + pos * delta) % 1440;
      // Compute slot duration in minutes (may be fractional when solar adjust is ON)
      let durMin;
      if (useSolar) {
        const next = timeline[(pos + 1) % timeline.length];
        durMin = ((next - start + 1440) % 1440);
      } else {
        durMin = delta;
      }
      const rowIndex = pos;
      // Save current row index for navigation
      try { window.__currentRowIndex = rowIndex; } catch(_) {}
    
      // Mostrar hora de inicio
      curTime.textContent = formatTime(start, getSolarPref());
      if (curDur) {
        curDur.textContent = formatDuration(durMin);
        const hint = (window.I18N && I18N.t) ? I18N.t('labels.duration_hint') : 'Duración del bloque';
        curDur.title = hint;
      }
      curOrd.textContent = ord;
      if (curHeading) {
        const lang = (window.I18N && window.I18N.getLang && window.I18N.getLang()) || 'es';
        if (lang === 'en') {
          curHeading.textContent = `Meditation ${ord}`;
        } else {
          curHeading.textContent = `${ord}ª Meditación`;
        }
      }
      if (curZod) {
        const zIdx = Math.floor((ord - 1) / 6);
        const zNames = (window.I18N && window.I18N.zodiacNames && window.I18N.zodiacNames[window.I18N.getLang() || 'es']) || [];
        curZod.textContent = zodiacEmoji[zIdx] || '';
        const zName = zNames[zIdx] || '';
        curZod.title = zName;
        curZod.setAttribute('aria-label', zName);
      }
      const name = n[idx % 72] || '';
      const disp = reverseLetters ? reverseHeb(name) : name;
      curStam.textContent = disp;
      curMeta.textContent = disp;
    
      const allRows = Array.from(document.querySelectorAll('#shemotTable tbody tr'));
      const row = allRows[(rowIndex ?? 0) % (allRows.length || 1)] || null;
      if (row) {
        const letTxt = row.children[4].textContent;
        curLet.textContent = reverseLetters ? reverseWords(letTxt) : letTxt;
        curGem.textContent = row.children[5].textContent;
        curDesc.textContent = row.children[6].textContent;
      } else {
        curLet.textContent = curGem.textContent = curDesc.textContent = '';
      }
    
      curBtn.onclick = () => openMedit(ord);
    }


  function fullUpdate() {
    // No mostrar hasta que tengamos datos iniciales listos
    if (!bootReady) return;
    if (!sunrise.value) sunrise.value = '06:00';
    const sr = hmToMins(sunrise.value);
    if (sr == null) return;
    sun.sunriseMin = sr;
    // Rebuild solar timeline if needed
    buildTimeline();
    ensureRowsForMode();
    renderTable(sr);
    renderCurrent(sr);
    scheduleNextUpdate();
  }

  // Expose for i18n to re-render when language changes
  window.fullUpdate = fullUpdate;

  /* ---------- 6. Sunrise fetch ---------- */
  //let coords = null;
function fetchSun() {
  if (!window.coords) {
    console.warn("⚠️ No hay coordenadas aún.");
    fullUpdate();
    return;
  }

  console.log("📡 Llamando a sunrise.php con:", window.coords);

  fetch(`sunrise.php?lat=${window.coords.lat}&lng=${window.coords.lon}&tz=${encodeURIComponent(tzSel.value)}`)
    .then(r => r.json())
    .then(j => {
      console.log("🌅 sunrise.php dijo:", j);

      if (j.sunrise) {
        const sunriseInput = document.getElementById('sunrise');
        if (!sunriseInput) {
          console.error("❌ sunrise input no encontrado en el DOM");
        } else {
          // Normalize space separator to colon for <input type="time">
          sunriseInput.value = (j.sunrise || '').replace(/\s+/, ':');
          console.log("✅ sunrise.value seteado a", j.sunrise);

          // Forzar eventos por si acaso
          sunriseInput.dispatchEvent(new Event('input'));
          sunriseInput.dispatchEvent(new Event('change'));
        }
        sun.sunriseMin = hmToMins(j.sunrise);
      } else {
        console.warn("❌ Respuesta inválida de sunrise.php");
      }
      if (j.sunset) {
        sun.sunsetMin = hmToMins(j.sunset);
        console.log("🌇 sunset (local) es:", j.sunset, sun.sunsetMin);
      }
      if (j.next_sunrise) {
        sun.nextSunriseMin = hmToMins(j.next_sunrise);
      }
      if (j.next_sunset) {
        sun.nextSunsetMin = hmToMins(j.next_sunset);
      }
      // Update lat UI after we have coords and times
      try { syncLatUIFromCoords(); } catch(_) {}
    })
    .finally(() => {
      console.log("🔁 Forzando fullUpdate()");
      fullUpdate();
    });
}

  window.fetchSun = fetchSun;

let updateScheduled = false;
function scheduleNextUpdate() {
  if (updateScheduled) return; // ya programada
  updateScheduled = true;
  // Calcular próximo umbral en la TZ seleccionada, sin depender del Date local
  const { nowMin } = getNowLocalHM();
  const sched = getSchedule();
  const useSolar = getSolarPref() && Array.isArray(timeline) && timeline.length;
  let nextStartMin = null;
  if (useSolar) {
    let ahead = Infinity;
    for (let i = 0; i < timeline.length; i++) {
      const t = timeline[i];
      const a = (t - nowMin + 1440) % 1440;
      if (a > 0 && a < ahead) ahead = a;
    }
    if (ahead === Infinity || ahead === 0) ahead = 0.01; // ~0.6s
    nextStartMin = (nowMin + ahead) % 1440;
  } else {
    const base = sched.base;
    const delta = sched.delta;
    const pos = Math.floor(((nowMin - base + 1440) % 1440) / delta);
    nextStartMin = (base + (pos + 1) * delta) % 1440;
  }
  const diffMin = (nextStartMin - nowMin + 1440) % 1440;
  let delay = Math.max(0, Math.round(diffMin * 60000));
  if (delay === 0) delay = 500; // seguridad
  console.log("⏱️ Próxima actualización en:", Math.round(delay / 1000), "segundos");
  setTimeout(() => {
    console.log("🔁 Ejecutando actualización programada");
    fullUpdate();
    updateScheduled = false;
    scheduleNextUpdate();
  }, delay);
}

  /* ---------- 7. Events ---------- */
  document.querySelectorAll('#shemotTable tbody tr').forEach(tr => {
    tr.addEventListener('click', () => openMedit(parseInt(tr.dataset.ord)));
  });
  tzSel.addEventListener('change', fetchSun);
  sunrise.addEventListener('input', () => { bootReady = true; fullUpdate(); });
  sunrise.addEventListener('change', () => { bootReady = true; fullUpdate(); });
  // 12h toggle wiring
  if (twelveToggle) {
    twelveToggle.checked = getPref12();
    twelveToggle.addEventListener('change', () => {
      setPref12(twelveToggle.checked);
      bootReady = true;
      fullUpdate();
    });
  }
  // Anchor-at-sunrise wiring (visible)
  if (anchorToggle) {
    anchorToggle.checked = getAnchorPref();
    anchorToggle.addEventListener('change', () => {
      setAnchorPref(anchorToggle.checked);
      bootReady = true;
      fullUpdate();
    });
  }
  // Solar adjust wiring
  if (solarToggle) {
    solarToggle.checked = getSolarPref();
    solarToggle.addEventListener('change', () => {
      setSolarPref(solarToggle.checked);
      bootReady = true;
      if (latDegWrap) latDegWrap.hidden = !solarToggle.checked;
      fullUpdate();
    });
    if (latDegWrap) latDegWrap.hidden = !solarToggle.checked;
  }
  // Latitude input wiring
  if (latDegInput) {
    latDegInput.addEventListener('change', () => {
      const v = parseFloat(latDegInput.value);
      if (isNaN(v)) return;
      const c = ensureCoords();
      c.lat = Math.max(-90, Math.min(90, v));
      fetchSun();
    });
  }
  const attachHintHandlers = (el, anchorEl) => {
    if (!el) return;
    const getHintText = () => {
      const a = anchorEl || el;
      const titleAttr = a && a.getAttribute ? a.getAttribute('title') : '';
      if (titleAttr) return titleAttr;
      // fallback generic text
      return (window.I18N && I18N.t) ? (I18N.t('twelve.hint') || 'Información') : 'Información';
    };
    let hintTimer = null;
    let hintEl = null;
    const showHint = () => {
      if (hintEl) return;
      hintEl = document.createElement('div');
      hintEl.textContent = getHintText();
      hintEl.style.position = 'fixed';
      hintEl.style.zIndex = '9999';
      hintEl.style.background = 'rgba(0,0,0,0.8)';
      hintEl.style.color = '#fff';
      hintEl.style.padding = '6px 8px';
      hintEl.style.borderRadius = '6px';
      hintEl.style.fontSize = '12px';
      const r = (anchorEl || el).getBoundingClientRect();
      hintEl.style.top = Math.max(8, r.bottom + 6) + 'px';
      hintEl.style.left = Math.max(8, Math.min(window.innerWidth - 220, r.left)) + 'px';
      document.body.appendChild(hintEl);
      setTimeout(hideHint, 1800);
    };
    const hideHint = () => { if (hintEl) { hintEl.remove(); hintEl = null; } };
    const startPress = () => { hintTimer = setTimeout(showHint, 600); };
    const endPress = () => { if (hintTimer) clearTimeout(hintTimer); hintTimer = null; hideHint(); };
    el.addEventListener('mousedown', startPress);
    el.addEventListener('touchstart', startPress);
    el.addEventListener('mouseup', endPress);
    el.addEventListener('mouseleave', endPress);
    el.addEventListener('touchend', endPress);
    // Also show on tap/click briefly (Android has no hover)
    el.addEventListener('click', () => { showHint(); setTimeout(hideHint, 1200); });
  };
  if (twelveToggle) {
    const twelveLabel = document.querySelector('label[for="twelveToggle"]');
    attachHintHandlers(twelveToggle, twelveLabel || twelveToggle);
    if (twelveLabel) attachHintHandlers(twelveLabel, twelveLabel);
  }
  if (anchorToggle) {
    const anchorLabel = document.querySelector('label[for="anchorSun"]');
    attachHintHandlers(anchorToggle, anchorLabel || anchorToggle);
    if (anchorLabel) attachHintHandlers(anchorLabel, anchorLabel);
  }
  if (solarToggle) {
    const solarLabel = document.querySelector('label[for="solarAdjust"]');
    attachHintHandlers(solarToggle, solarLabel || solarToggle);
    if (solarLabel) attachHintHandlers(solarLabel, solarLabel);
  }
  // Menu interactions (click/hover)
  if (menuBtn && optionsPanel) {
    const openPanel = () => {
      optionsPanel.hidden = false;
      optionsPanel.classList.add('open');
      menuBtn.setAttribute('aria-expanded','true');
    };
    const closePanel = () => {
      optionsPanel.classList.remove('open');
      optionsPanel.hidden = true;
      menuBtn.setAttribute('aria-expanded','false');
    };
    let hoverTimer = null;
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (optionsPanel.classList.contains('open')) closePanel(); else openPanel();
    });
    menuBtn.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); openPanel(); });
    optionsPanel.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); });
    optionsPanel.addEventListener('mouseleave', () => { hoverTimer = setTimeout(closePanel, 200); });
    document.addEventListener('click', (e) => {
      if (!optionsPanel.contains(e.target) && e.target !== menuBtn) closePanel();
    });
  }
  // Keep UI in sync if another tab updates global defaults in localStorage
  try {
    window.addEventListener('storage', (e) => {
      if (!e || !e.key) return;
      if (e.key === 'mode12' || e.key === 'anchorSunrise' || e.key === 'solarAdjust') {
        if (twelveToggle) twelveToggle.checked = getPref12();
        if (anchorToggle) anchorToggle.checked = getAnchorPref();
        if (solarToggle) {
          solarToggle.checked = getSolarPref();
          if (latDegWrap) latDegWrap.hidden = !solarToggle.checked;
        }
        bootReady = true;
        fullUpdate();
      }
    });
  } catch (_) {}
  // Fallback: si en ~2.5s no hubo datos, renderizar con amanecer por defecto
  setTimeout(() => { if (!bootReady) { bootReady = true; fullUpdate(); } }, 2500);
  // Heartbeat: re-eval current block periodically as safety net
  try {
    if (!window.__heartbeatTimer) {
      window.__heartbeatTimer = setInterval(() => {
        if (!bootReady) return;
        try { renderCurrent(sun.sunriseMin); } catch (_) {}
      }, 5000);
    }
  } catch (_) {}
  // Also refresh when regaining focus or tab becomes visible
  try {
    window.addEventListener('focus', () => { if (bootReady) renderCurrent(sun.sunriseMin); });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && bootReady) renderCurrent(sun.sunriseMin);
    });
  } catch (_) {}
document.getElementById('gpsBtn').addEventListener('click', () => {
  console.log("📡 Forzando GPS...");
      tryGeolocation(fetchSun); // ← usa la función de geo-ip.js con callback
    });
  /* ---------- 8. Init ---------- */
  fetchIPLocation(fetchSun); // ← esta función vive ahora en geo-ip.js
  
  function goToCurrentRow() {
      const rows = Array.from(document.querySelectorAll('#shemotTable tbody tr'));
      const total = rows.length || 72;
      const idx = (window.__currentRowIndex || 0);
      const nextIdx = (idx + 1) % total;
      const row = rows[nextIdx];
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        row.classList.add("highlight");
        setTimeout(() => row.classList.remove("highlight"), 2000);
      }
    }window.goToCurrentRow = goToCurrentRow;

// Selecciona el botón
const btnTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  // Si el usuario bajó más de 100px, mostramos el botón
  if (window.scrollY > 100) {
    btnTop.style.display = 'block';
  } else {
    btnTop.style.display = 'none';
  }
});

// Si quieres reforzar el scroll suave en navegadores que no respeten scroll-behavior
btnTop.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
      
})();

// Mark script as successfully loaded (for fallback loader)
try { window.__APP_JS_LOADED__ = true; } catch (_) {}
