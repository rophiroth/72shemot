<?php
require_once __DIR__ . '/data/shemot_data.php';
$rows = get72ShemotData();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>72 Nombres – Vista Comparativa</title>
  <link rel="icon" type="image/png" href="assets/img/favicon.png">
  <link rel="stylesheet" href="assets/css/style.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="assets/css/styleAll.css?v=<?php echo time(); ?>">
</head>
<body class="all-view">
  <header>
    <h1>72 Nombres – Vista Comparativa</h1>
    <div class="controls">
      <label for="tz">TZ</label>
      <select id="tz"></select>
      <label for="sunrise">Amanecer</label>
      <input type="time" id="sunrise" step="1" value="06:00:00">
      <button id="gpsBtn" title="Usar GPS">📍 GPS</button>
      <span id="nowLbl" class="time"></span>
    </div>
  </header>

  <section class="strip" id="variants">
    <article class="tile" data-key="std">
      <h2>Estándar</h2>
      <div class="cur">
        <div class="row"><span class="time" data-f="time">--:--</span> · <span class="dur" data-f="dur">--'</span> · <span class="ord" data-f="ord">Meditación --</span></div>
        <div class="row hebrew-box"><span class="stam" data-f="stam">---</span><span class="meta" data-f="meta">---</span></div>
        <div class="row"><span class="phon" data-f="phon">---</span> · <span class="gem" data-f="gem">--</span></div>
        <div class="row desc" data-f="desc">---</div>
      </div>
    </article>
    <article class="tile" data-key="std_solar">
      <h2>Estándar + Ajuste solar</h2>
      <div class="cur">
        <div class="row"><span class="time" data-f="time">--:--</span> · <span class="dur" data-f="dur">--'</span> · <span class="ord" data-f="ord">Meditación --</span></div>
        <div class="row hebrew-box"><span class="stam" data-f="stam">---</span><span class="meta" data-f="meta">---</span></div>
        <div class="row"><span class="phon" data-f="phon">---</span> · <span class="gem" data-f="gem">--</span></div>
        <div class="row desc" data-f="desc">---</div>
      </div>
    </article>
    <article class="tile" data-key="solar_dusk">
      <h2>Ajuste solar + Ancla al anochecer</h2>
      <div class="cur">
        <div class="row"><span class="time" data-f="time">--:--</span> · <span class="dur" data-f="dur">--'</span> · <span class="ord" data-f="ord">Meditación --</span></div>
        <div class="row hebrew-box"><span class="stam" data-f="stam">---</span><span class="meta" data-f="meta">---</span></div>
        <div class="row"><span class="phon" data-f="phon">---</span> · <span class="gem" data-f="gem">--</span></div>
        <div class="row desc" data-f="desc">---</div>
      </div>
    </article>
    <article class="tile" data-key="all_on">
      <h2>Todos ON (12h + Ancla + Ajuste solar)</h2>
      <div class="cur">
        <div class="row"><span class="time" data-f="time">--:--</span> · <span class="dur" data-f="dur">--'</span> · <span class="ord" data-f="ord">Meditación --</span></div>
        <div class="row hebrew-box"><span class="stam" data-f="stam">---</span><span class="meta" data-f="meta">---</span></div>
        <div class="row"><span class="phon" data-f="phon">---</span> · <span class="gem" data-f="gem">--</span></div>
        <div class="row desc" data-f="desc">---</div>
      </div>
    </article>
  </section>

    <div class="note">Esta vista compara el "Nombre actual" bajo cuatro configuraciones. Debajo se incluye la tabla completa.</div>
  
    <hr style="opacity:.2;border:0;border-top:1px solid #3a184a;margin:12px 0;">

    <h2 style="text-align:center;color:var(--glow);margin:6px 0 0;">Tabla completa</h2>
    <table id="shemotTable" style="margin-top:8px;">
      <thead>
        <tr>
          <th></th>
          <th>Hora de inicio</th>
          <th>Orden</th>
          <th>Nombre</th>
          <th>Letras</th>
          <th>Guematria</th>
          <th>Kavanah / Bendicion</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $r): ?>
        <tr data-ord="<?= $r['orden'] ?>">
          <td class="btn-cell">
            <button class="med-btn" onclick="event.stopPropagation();">▶</button>
          </td>
          <td class="hora">--:--</td>
          <td class="ord">
            <span class="ord-num"><?= $r['orden'] ?></span>
          </td>
          <td>
            <div class="hebrew-box">
              <span class="stam"><?= $r['nombre'] ?></span>
              <span class="meta"><?= $r['nombre'] ?></span>
            </div>
          </td>
          <td>
            <div class="phonetic-wrap">
              <span class="phonetic"><?= $r['letras'] ?></span>
            </div>
          </td>
          <td class="gem"><?= $r['guematria'] ?></td>
          <td>
            <?= $r['significado'] ?>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <script>
    // Datos desde PHP
    window.NAMES = <?php echo json_encode(array_column($rows,'nombre')); ?>;
    window.PHONS = <?php echo json_encode(array_column($rows,'letras')); ?>;
    window.GEMS  = <?php echo json_encode(array_column($rows,'guematria')); ?>;
    window.DESC  = <?php echo json_encode(array_column($rows,'significado')); ?>;
  </script>
  <script src="assets/js/tz-select.js"></script>
  <script src="assets/js/geo-ip.js?v=<?php echo time(); ?>"></script>
  <script>
    // Utiles
    const two = n => n.toString().padStart(2,'0');
    const mins = (h,m) => (h*60+m)%1440;
    const hmToMins = (s) => { if (!s) return null; const p=s.split(':').map(Number); if (p.length<2) return null; return mins(p[0],p[1]); };
    const formatTime = (t, withSeconds) => {
      const h = Math.floor((t%1440)/60), m = Math.floor(t%60), s = Math.round((t*60)%60);
      return withSeconds ? `${two(h)}:${two(m)}:${two(s)}` : `${two(h)}:${two(m)}`;
    };
    const formatDuration = (v) => `${(Math.round(v*10)/10).toFixed(1).replace('.', ',')}'`;

    // TZ + Amanecer
    const tzSel = document.getElementById('tz');
    const sunriseInput = document.getElementById('sunrise');
    const nowLbl = document.getElementById('nowLbl');
    const gpsBtn = document.getElementById('gpsBtn');

    const sun = { sunriseMin:null, sunsetMin:null, nextSunriseMin:null, nextSunsetMin:null };

    function getNowLocalHM() {
      const tz = (tzSel && tzSel.value) ? tzSel.value : (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
      const now = new Date().toLocaleString('en-US', { timeZone: tz, hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit' });
      const [h,m,s] = now.split(':').map(Number); return { h, m, s, nowMin: mins(h,m) + (isNaN(s)?0:s/60) };
    }

    function buildTimeline(useTwelve, anchorSunset) {
      const haveSun = (sun.sunriseMin!=null && sun.sunsetMin!=null && sun.nextSunriseMin!=null);
      if (!haveSun) return null;
      const dayStart = sun.sunriseMin, dayEnd = sun.sunsetMin;
      const nightStart = sun.sunsetMin, nightEnd = sun.nextSunriseMin;
      const dayDur = (dayEnd - dayStart + 1440) % 1440;
      const nightDur = (nightEnd - nightStart + 1440) % 1440;
      if (useTwelve) {
        const daySlots=72, nightSlots=72; const dayStep=dayDur/daySlots, nightStep=nightDur/nightSlots; const arr=[];
        if (anchorSunset) { for (let i=0;i<nightSlots;i++) arr.push((nightStart+i*nightStep)%1440); for (let i=0;i<daySlots;i++) arr.push((dayStart+i*dayStep)%1440); }
        else { for (let i=0;i<daySlots;i++) arr.push((dayStart+i*dayStep)%1440); for (let i=0;i<nightSlots;i++) arr.push((nightStart+i*nightStep)%1440); }
        return arr;
      } else {
        const daySlots=36, nightSlots=36; const dayStep=dayDur/daySlots, nightStep=nightDur/nightSlots; const arr=[];
        if (anchorSunset) { for (let i=0;i<nightSlots;i++) arr.push((nightStart+i*nightStep)%1440); for (let i=0;i<daySlots;i++) arr.push((dayStart+i*dayStep)%1440); }
        else { for (let i=0;i<daySlots;i++) arr.push((dayStart+i*dayStep)%1440); for (let i=0;i<nightSlots;i++) arr.push((nightStart+i*nightStep)%1440); }
        return arr;
      }
    }

    function computeCurrent(cfg) {
      const { nowMin } = getNowLocalHM();
      const baseSunset = (sun.sunsetMin!=null) ? sun.sunsetMin : (sun.sunriseMin!=null ? (sun.sunriseMin+720)%1440 : null);
      // Schedule base/delta
      let mode='twenty', base=null, delta=20;
      if (cfg.twelve && sun.sunriseMin!=null && baseSunset!=null) { mode='ten'; base = cfg.anchor ? baseSunset : sun.sunriseMin; delta=10; }
      else {
        if (cfg.anchor) base = (baseSunset!=null) ? baseSunset : (sun.sunriseMin!=null ? (sun.sunriseMin+720)%1440 : 1080);
        else base = (sun.sunriseMin!=null) ? sun.sunriseMin : 360;
        mode='twenty'; delta=20;
      }
      // Timeline opcional
      let timeline=null;
      if (cfg.solar && sun.sunriseMin!=null && sun.sunsetMin!=null && sun.nextSunriseMin!=null) {
        timeline = buildTimeline(!!cfg.twelve, !!cfg.anchor);
      }
      // Posición actual y ord
      let pos;
      if (Array.isArray(timeline) && timeline.length) {
        let best=0, bestDiff=1e9; for (let i=0;i<timeline.length;i++){ const t=timeline[i]; const diff=(nowMin - t + 1440)%1440; if (diff<bestDiff){ bestDiff=diff; best=i; } }
        pos = best;
      } else {
        pos = Math.floor(((nowMin - base + 1440) % 1440) / delta);
      }
      const ord = (pos % 72) + 1;
      const idx = ord - 1;
      // Inicio y duración
      const start = (Array.isArray(timeline) && timeline.length) ? timeline[pos % timeline.length] : (base + pos*delta) % 1440;
      const next = (Array.isArray(timeline) && timeline.length) ? timeline[(pos+1)%timeline.length] : (start + delta) % 1440;
      const durMin = (Array.isArray(timeline) && timeline.length) ? ((next - start + 1440)%1440) : delta;
      return { ord, idx, start, durMin };
    }

    function renderAll() {
      // Mostrar hora actual
      const now = new Date().toLocaleString('es-AR', { timeZone: tzSel.value, hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit' });
      nowLbl.textContent = `Ahora: ${now}`;

      const VARS = [
        { key:'std',        cfg:{ twelve:false, solar:false, anchor:false }, label:'Estándar' },
        { key:'std_solar',  cfg:{ twelve:false, solar:true,  anchor:false }, label:'Estándar + Ajuste solar' },
        { key:'solar_dusk', cfg:{ twelve:false, solar:true,  anchor:true  }, label:'Ajuste solar + Ancla al anochecer' },
        { key:'all_on',     cfg:{ twelve:true,  solar:true,  anchor:true  }, label:'Todos ON' }
      ];
      VARS.forEach(v => {
        const box = document.querySelector(`.tile[data-key="${v.key}"]`);
        if (!box) return;
        const res = computeCurrent(v.cfg);
        const name = (window.NAMES[res.idx]||'');
        const phon = (window.PHONS[res.idx]||'');
        const gem  = (window.GEMS[res.idx]||'');
        const desc = (window.DESC[res.idx]||'');
        box.querySelector('[data-f="time"]').textContent = formatTime(res.start, (v.cfg.solar));
        box.querySelector('[data-f="dur"]').textContent  = formatDuration(res.durMin);
        box.querySelector('[data-f="ord"]').textContent  = `Meditación ${res.ord}`;
        const stamEl = box.querySelector('[data-f="stam"]');
        const metaEl = box.querySelector('[data-f="meta"]');
        if (stamEl) stamEl.textContent = name;
        if (metaEl) metaEl.textContent = name;
        box.querySelector('[data-f="phon"]').textContent = phon;
        box.querySelector('[data-f="gem"]').textContent  = gem;
        box.querySelector('[data-f="desc"]').textContent = desc;
      });
      scheduleNext();
    }

    // Siguiente actualización: usa timeline/base de cada variante y toma el mínimo
    let updateTimer = null;
    function scheduleNext() {
      if (updateTimer) { clearTimeout(updateTimer); updateTimer = null; }
      const variants = [
        { twelve:false, solar:false, anchor:false },
        { twelve:false, solar:true,  anchor:false },
        { twelve:false, solar:true,  anchor:true  },
        { twelve:true,  solar:true,  anchor:true  },
      ];
      const { nowMin } = getNowLocalHM();
      let bestMs = Infinity;
      variants.forEach(cfg => {
        let nextStartMin;
        if (cfg.solar) {
          const tl = buildTimeline(!!cfg.twelve, !!cfg.anchor);
          if (Array.isArray(tl) && tl.length) {
            let ahead = Infinity; for (let i=0;i<tl.length;i++){ const t=tl[i]; const a=(t-nowMin+1440)%1440; if (a>0 && a<ahead) ahead=a; }
            if (ahead===Infinity || ahead===0) ahead = 0.01; // ~0.6s
            nextStartMin = (nowMin + ahead) % 1440;
          }
        }
        if (nextStartMin==null) {
          // clásico
          const baseSunset = (sun.sunsetMin!=null) ? sun.sunsetMin : (sun.sunriseMin!=null ? (sun.sunriseMin+720)%1440 : null);
          let base, delta = cfg.twelve ? 10 : 20;
          if (cfg.twelve && sun.sunriseMin!=null && baseSunset!=null) base = cfg.anchor ? baseSunset : sun.sunriseMin;
          else base = cfg.anchor ? (baseSunset??1080) : (sun.sunriseMin??360);
          const pos = Math.floor(((nowMin - base + 1440)%1440)/delta);
          nextStartMin = (base + (pos+1)*delta) % 1440;
        }
        const diffMin = (nextStartMin - nowMin + 1440)%1440;
        const ms = Math.max(0, Math.round(diffMin*60000));
        if (ms < bestMs) bestMs = ms;
      });
      if (bestMs === Infinity) bestMs = 60000;
      if (bestMs === 0) bestMs = 500;
      updateTimer = setTimeout(renderAll, bestMs);
    }

    // Amanecer/Atardecer desde PHP
    function fetchSun() {
      if (!window.coords) { renderAll(); return; }
      const tz = (tzSel && tzSel.value) ? tzSel.value : (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
      fetch(`sunrise.php?lat=${window.coords.lat}&lng=${window.coords.lon}&tz=${encodeURIComponent(tz)}`)
        .then(r=>r.json())
        .then(j => {
          if (j.sunrise) {
            sunriseInput.value = (j.sunrise||'').replace(/\s+/, ':');
            sun.sunriseMin = hmToMins(j.sunrise);
          }
          if (j.sunset) sun.sunsetMin = hmToMins(j.sunset);
          if (j.next_sunrise) sun.nextSunriseMin = hmToMins(j.next_sunrise);
          if (j.next_sunset)  sun.nextSunsetMin  = hmToMins(j.next_sunset);
        })
        .finally(renderAll);
    }

    // Eventos
    tzSel.addEventListener('change', fetchSun);
    sunriseInput.addEventListener('input', () => { const v = hmToMins(sunriseInput.value); if (v!=null) sun.sunriseMin = v; renderAll(); });
    sunriseInput.addEventListener('change', () => { const v = hmToMins(sunriseInput.value); if (v!=null) sun.sunriseMin = v; renderAll(); });
    window.addEventListener('focus', renderAll);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) renderAll(); });
    window.addEventListener('pageshow', renderAll);
    if (gpsBtn) gpsBtn.addEventListener('click', () => { tryGeolocation(fetchSun); });

    // Init: ubicar TZ del navegador ya lo hace tz-select.js. Obtener IP/coords y consultar Sol.
    window.addEventListener('DOMContentLoaded', () => {
      // Si no llega geo rápido, render con hora de entrada
      setTimeout(renderAll, 1500);
    });
    // Usa el helper del proyecto
    // Iniciar geolocalización (espera a que el script esté disponible si carga lento)
    (function startGeo(){
      if (typeof fetchIPLocation === 'function') { fetchIPLocation(fetchSun); }
      else { setTimeout(startGeo, 100); }
    })();
  </script>
</body>
</html>
