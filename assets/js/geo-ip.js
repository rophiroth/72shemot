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
  fetch("https://ipwho.is/")
    .then(res => res.json())
    .then(data => {
      if (data.success && data.latitude && data.longitude && data.timezone?.id) {
        window.coords = {
          lat: data.latitude,
          lon: data.longitude
        };

        const tzSelect = document.getElementById('tz');
        if (tzSelect) {
          tzSelect.value = data.timezone.id;
        }

        console.log("🌍 IP-based location detected:", window.coords, data.timezone.id);

        if (typeof onReady === 'function') onReady();
      } else {
        console.warn("❌ IPWho.is no entregó datos válidos. Intentando GPS...");
        window.tryGeolocation(onReady);
      }
    })
    .catch(err => {
      console.warn("❌ Error en IPWho.is:", err);
      window.tryGeolocation(onReady);
    });
};
