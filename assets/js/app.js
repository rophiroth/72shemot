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
  /* ---------- 1. Mapa de IDs de video (72) ---------- */
  const videoMap = {
    1:"AxAkSi2HzMA",  2:"wrn3FRH72ts", 3:"uDut85DYlFY", 4:"E3ifDBHTQGA", 5:"T8-nqb2riAc",
    6:"UVX1qBn84DQ",  7:"Ai_qEFvi0oY", 8:"ZwEet6qQ4BM", 9:"gaPuaCyHd6A",10:"FIJYjTlYjgQ",
   11:"WrhDNbfsWRI", 12:"Yns_Q93sMKU",13:"TU08hBsH5Z4",14:"HFuSMOs568w",15:"xO5s6yXJ5cc",
   16:"FOdiWQr7i3w", 17:"Losvwml-EWU",18:"UrVhiVEh0FA",19:"pu_e_OF_x18",20:"ep784S2tLL8",
   21:"0ijRC6ruWiM", 22:"Ivv-9mSFMAA",23:"zSMbhmoplxE",24:"LRkbakNZLrA",25:"kHwnQ-eJMgk",
   26:"BDRj2yA6JVk", 27:"_EIicTeFPZk",28:"725_UnF6di0",29:"GAkuDtVY6Ho",30:"54RmhPuuEm4",
   31:"U-hfaoEPOz8", 32:"m22NW2WGKr0",33:"3P7x4UQ0mfM",34:"h0L7dCI5Dpk",35:"vT1-0Ps_jCI",
   36:"gGZXSBRGwqg", 37:"zd7wdVYvrog",38:"LQdnyajTccM",39:"juYFQfMh_Wc",40:"ltXRerbqI4w",
   41:"HvYhDwZ6W5E", 42:"khmNEqrsAlw",43:"brmY8V8VP50",44:"L5zofvENPIk",45:"vC72_Qn4ZR4",
   46:"qGeGk5GXrnA", 47:"cDYNCfQVwIc",48:"Er9B_swvRQE",49:"u_uRj0D6O9Q",50:"5voS-KrTNYE",
   51:"VJ-Y4omHvzw", 52:"5EMq4hvhxRQ",53:"aZAFzNWt484",54:"Lj09gAtR1l4",55:"Jomb3_GEs6U",
   56:"0aHtQOOSA6k", 57:"84W0E-aO-KE",58:"F1aYEvyq97U",59:"afie00e87QQ",60:"SxiWaplWJ0E",
   61:"NlQUyxCThe8", 62:"SgMB7GQZ8c0",63:"Zd3l2VEVXJ4",64:"vr7TH0y6XdY",65:"SD0TkfPD72U",
   66:"JvQhqbXL83M", 67:"x3kcQVtUy7Q",68:"uK7BT2SizoU",69:"61jumO-NcNA",70:"99GJP3mttqM",
   71:"Cs2nzAiftw0", 72:"ldzNG7whB9w"
  };
  const linkFor = i => `https://www.youtube.com/watch?v=${videoMap[i]}`;

  /* ---------- 2. DOM references ---------- */
  const tzSel   = document.getElementById('tz');
  const sunrise = document.getElementById('sunrise');
  const horaEls = [...document.querySelectorAll('.hora')];

  const curTime = document.getElementById('curTime');
  const curName = document.getElementById('curName');
  const curDesc = document.getElementById('curDesc');
  const curBtn  = document.getElementById('curBtn');
  const curOrd  = document.getElementById('curOrd');
  const curStam = document.getElementById('curStam');
  const curMeta = document.getElementById('curMeta');
  const curLet  = document.getElementById('curLet');
  const curGem  = document.getElementById('curGem');

  /* ---------- 3. Safe access to data from PHP ---------- */
  const n = window.names || [];
  const d = window.descs || [];

  /* ---------- 4. Helpers ---------- */
  const two = n => n.toString().padStart(2, '0');
  const mins = (h, m) => (h * 60 + m) % 1440;

  function openMedit(i) {
    window.open(linkFor(i), '_blank');
  }
  window.openMedit = openMedit;

  /* ---------- 5. Rendering ---------- */
  function renderTable(base) {
  const horaEls = [...document.querySelectorAll('#shemotTable tbody tr')]
    .sort((a, b) => Number(a.dataset.ord) - Number(b.dataset.ord))
    .map(tr => tr.children[1]);

  horaEls.forEach((td, i) => {
    const t = (base + i * 20) % 1440;
    td.textContent = `${two(Math.floor(t / 60))}:${two(t % 60)}`;
  });
}


    function renderCurrent(base) {
      const now = new Date().toLocaleString('en-US', {
        timeZone: tzSel.value,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    
      const [h, m] = now.split(':').map(Number);
      const nowMin = mins(h, m);
    
      // encontrar el bloque que ya está en curso
      let idx = Math.floor((nowMin - base + 1440) % 1440 / 20);
      let start = (base + idx * 20) % 1440;
      let ord = idx + 1;
    
      // 🛠️ Ajustar si aún NO hemos entrado en ese bloque
      if (nowMin < start) {
        idx = (idx + 71) % 72;
        start = (base + idx * 20) % 1440;
        ord = idx + 1;
      }
    
      // Mostrar hora de inicio
      curTime.textContent = `${two(Math.floor(start / 60))}:${two(start % 60)}`;
      curOrd.textContent = ord;
      curStam.textContent = n[idx] || '';
      curMeta.textContent = n[idx] || '';
    
      const row = document.querySelector(`#shemotTable tbody tr[data-ord="${ord}"]`);
      if (row) {
        curLet.textContent = row.children[4].textContent;
        curGem.textContent = row.children[5].textContent;
        curDesc.textContent = row.children[6].textContent;
      } else {
        curLet.textContent = curGem.textContent = curDesc.textContent = '';
      }
    
      curBtn.onclick = () => openMedit(ord);
    }


  function fullUpdate() {
    if (!sunrise.value) sunrise.value = '06:00';
    const [h, m] = sunrise.value.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return;
    const base = mins(h, m);
    renderTable(base);
    renderCurrent(base);
    scheduleNextUpdate();
  }

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
          sunriseInput.value = j.sunrise;
          console.log("✅ sunrise.value seteado a", j.sunrise);

          // Forzar eventos por si acaso
          sunriseInput.dispatchEvent(new Event('input'));
          sunriseInput.dispatchEvent(new Event('change'));
        }
      } else {
        console.warn("❌ Respuesta inválida de sunrise.php");
      }
    })
    .finally(() => {
      console.log("🔁 Forzando fullUpdate()");
      fullUpdate();
    });
}

window.fetchSun = fetchSun;

let updateScheduled = false;
function scheduleNextUpdate() {
    if (updateScheduled) return; // ⛔ ya fue llamada
  updateScheduled = true;
  const now = new Date();
  const currentIndex = parseInt(curOrd.textContent, 10) - 1;
    const [hh, mm] = horaEls[(currentIndex + 1)].textContent.trim().split(':').map(Number);
    const nextTime = new Date();
    nextTime.setHours(hh, mm, 0, 0);
  const delay = nextTime - now;

  if (delay > 0) {
    console.log("⏱️ Próxima actualización en:", Math.round(delay / 1000), "segundos");
    setTimeout(() => {
      console.log("🔁 Ejecutando actualización programada");
      fullUpdate();         // ⬅️ fuerza render del nombre nuevo
      updateScheduled = false; // 🌀 libera para el próximo ciclo
      scheduleNextUpdate(); // ⬅️ se reprograma sola
    }, delay);
  } else {
    console.warn("⚠️ Tiempo de actualización en el pasado. Ejecutando inmediatamente.");
      console.group("⛔️ Diagnóstico del loop temporal");
      console.log("📛 curOrd.textContent:", curOrd.textContent);
      console.log("🧮 currentIndex:", currentIndex);
      console.log("🔜 nextIndex:", currentIndex+1);
      console.log("🕰️ nextTime (esperado):+", nextTime.toLocaleTimeString());
      console.log("⏳ now:", now.toLocaleTimeString());
      console.log("⌛ delay (ms):", delay);
      console.groupEnd();
    fullUpdate();
    updateScheduled = false; // 🌀 libera para el próximo ciclo
    scheduleNextUpdate();
  }
}

  /* ---------- 7. Events ---------- */
  document.querySelectorAll('#shemotTable tbody tr').forEach(tr => {
    tr.addEventListener('click', () => openMedit(parseInt(tr.dataset.ord)));
  });
  tzSel.addEventListener('change', fetchSun);
  sunrise.addEventListener('input', fullUpdate);
  sunrise.addEventListener('change', fullUpdate);
document.getElementById('gpsBtn').addEventListener('click', () => {
  console.log("📡 Forzando GPS...");
      tryGeolocation(fetchSun); // ← usa la función de geo-ip.js con callback
    });
  /* ---------- 8. Init ---------- */
  fetchIPLocation(fetchSun); // ← esta función vive ahora en geo-ip.js
  
  function goToCurrentRow() {
      const ord = parseInt(document.getElementById("curOrd").textContent, 10);
      const row = document.querySelector(`tr[data-ord="${ord+1}"]`);
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
