window.tryGeolocation = function (onReady) {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    p => {
      window.coords = { lat: p.coords.latitude, lon: p.coords.longitude };
      console.log("📍 Ubicación por GPS:", window.coords);
      if (typeof onReady === 'function') onReady();
    },
    err => {
      console.warn("⚠️ GPS falló:", err);
      if (typeof onReady === 'function') onReady();
    }
  );
};

window.fetchIPLocation = function (onReady) {
  // Timeout rápido para evitar demoras si el servicio está lento
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 1500);
  fetch("https://ipwho.is/", { signal: controller.signal })
    .then(res => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))
    .then(data => {
      clearTimeout(t);
      if (data && data.success && data.latitude && data.longitude && data.timezone && data.timezone.id) {
        window.coords = { lat: data.latitude, lon: data.longitude };
        const tzSelect = document.getElementById('tz');
        if (tzSelect) tzSelect.value = data.timezone.id;
        console.log("🌍 IP-based location detected:", window.coords, data.timezone.id);
        if (typeof onReady === 'function') onReady();
      } else {
        console.warn("❌ IPWho.is no entregó datos válidos. Intentando GPS...");
        window.tryGeolocation(onReady);
      }
    })
    .catch(err => {
      clearTimeout(t);
      console.warn("❌ Error/timeout en IPWho.is:", err && err.message ? err.message : err);
      // Fallback rápido a GPS; si no hay permisos, el callback igual continúa
      window.tryGeolocation(onReady);
    });
};
