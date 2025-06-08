/* tz-select.js — agrupa zonas horarias por GMT ±hh[:mm] */

(() => {
  const sel = document.getElementById('tz');
  if (!sel || !Intl.supportedValuesOf) return;

  /* ---------- helper: diff minutos entre UTC y TZ ---------- */
  function offsetMinutes(tz) {
    const now     = new Date();

    // Hora "ahora" en la zona deseada
    const there   = new Date(now.toLocaleString('en-US', { timeZone: tz }));

    // Hora "ahora" en UTC
    const utc     = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));

    return (there - utc) / 60000;           // diferencia en minutos
  }

  /* ---------- helper: minutos → string GMT ±hh[:mm] ---------- */
  function offsetToLabel(mins) {
    const sign = mins >= 0 ? '+' : '−';
    const abs  = Math.abs(mins);
    const h    = Math.floor(abs / 60).toString().padStart(2,'0');
    const m    = abs % 60;
    return sign + h + (m ? ':' + m.toString().padStart(2,'0') : '');
  }

  /* ---------- construir grupos ---------- */
  const groups = {};
  Intl.supportedValuesOf('timeZone').forEach(tz => {
    const mins  = offsetMinutes(tz);
    const label = offsetToLabel(mins);      // "+05:30", "−04", "0"
    (groups[label] ||= []).push(tz);
  });

  /* ---------- ordenar numéricamente ---------- */
  const order = lbl => {
    const sign = lbl.startsWith('−') ? -1 : 1;
    const [h, m='0'] = lbl.slice(1).split(':');
    return sign * (parseInt(h,10) + parseInt(m,10)/60);
  };

  Object.keys(groups)
    .sort((a,b)=>order(a)-order(b))
    .forEach(label => {
      const og = document.createElement('optgroup');
      og.label = `GMT ${label}`;
      groups[label].forEach(tz => {
        const opt = document.createElement('option');
        opt.value = tz;
        opt.textContent = `${tz.replace(/_/g,' ')} (GMT ${label})`;
        og.appendChild(opt);
      });
      sel.appendChild(og);
    });

  /* ---------- seleccionar TZ del navegador ---------- */
  sel.value = Intl.DateTimeFormat().resolvedOptions().timeZone;

  /* ---------- DEBUG opcional ---------- */
  console.log('Ejemplo offsets:',
    'America/Santiago →', offsetToLabel(offsetMinutes('America/Santiago')),
    'UTC →', offsetToLabel(offsetMinutes('UTC')),
    'Asia/Kolkata →', offsetToLabel(offsetMinutes('Asia/Kolkata'))
  );
})();
