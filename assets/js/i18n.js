/* assets/js/i18n.js — Lightweight i18n (es/en) with persistence */
(function () {
  const dict = {
    es: {
      'doc.title': '72 Nombres de אל – Jesed',
      'og.title': '72 Nombres de Dios - Meditaciones de Luz',
      'og.description': 'Explora los 72 Nombres de Dios según la Kabaláh. Calcula cuál te corresponde ahora, según tu ubicación y hora exacta del amanecer.',

      'ui.language': 'Idioma:',
      'ui.timezone': 'Zona horaria:',
      'ui.sunrise': 'Amanecer:',
      'ui.use_gps': '📍 Usar GPS',
      'ui.use_gps_label': 'Usar GPS',
      'ui.use_gps_title': 'Usar GPS para mayor precisión',

      'header.h1_prefix': '72 Nombres de',
      'header.h1_suffix': '– Jesed: Bondad Pura',

      'current.title': '🕯️ Energía disponible en este momento',
      'current.before_ord': '',
      'current.after_ord': 'ª Meditación',
      'current.meditation': 'Meditación',

      'labels.gematria': 'Guematría',

      'buttons.guided': '🎵 Meditación guiada',
      'link.next_meditation': '⬇️ Siguiente Meditación',

      'th.start_time': 'Hora de inicio',
      'th.order': 'Orden',
      'th.name': 'Nombre',
      'th.letters': 'Letras',
      'th.gematria': 'Guematría',
      'th.kavanah': 'Kavanah / Bendición',

      'back_to_top': 'Volver arriba',

      'zodiac': ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis']
    },
    en: {
      'doc.title': '72 Names of אל – Chesed',
      'og.title': '72 Names of God - Meditations of Light',
      'og.description': 'Explore the 72 Names of God according to Kabbalah. Calculate which one corresponds to you now, based on your location and precise sunrise time.',

      'ui.language': 'Language:',
      'ui.timezone': 'Time zone:',
      'ui.sunrise': 'Sunrise:',
      'ui.use_gps': '📍 Use GPS',
      'ui.use_gps_label': 'Use GPS',
      'ui.use_gps_title': 'Use GPS for better accuracy',

      'header.h1_prefix': '72 Names of',
      'header.h1_suffix': '– Chesed: Pure Kindness',

      'current.title': '🕯️ Available energy right now',
      'current.before_ord': 'Meditation #',
      'current.after_ord': '',
      'current.meditation': 'Meditation',

      'labels.gematria': 'Gematria',

      'buttons.guided': '🎵 Guided meditation',
      'link.next_meditation': '⬇️ Next Meditation',

      'th.start_time': 'Start time',
      'th.order': 'Order',
      'th.name': 'Name',
      'th.letters': 'Letters',
      'th.gematria': 'Gematria',
      'th.kavanah': 'Kavanah / Blessing',

      'back_to_top': 'Back to top',

      'zodiac': ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
    }
  };

  // Preference: saved → es (default)
  let lang = (function () {
    try {
      const saved = localStorage.getItem('lang');
      if (saved && (saved === 'es' || saved === 'en')) return saved;
    } catch (_) {}
    return 'es';
  })();

  // If no saved preference, try to infer from browser language
  try {
    const saved = localStorage.getItem('lang');
    const hasSaved = (saved === 'es' || saved === 'en');
    if (!hasSaved) {
      const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      if (/^es/i.test(navLang)) lang = 'es';
      else if (/^en/i.test(navLang)) lang = 'en';
      else lang = 'es';
    }
  } catch (_) {}

  function t(key) {
    return (dict[lang] && dict[lang][key]) || key;
  }

  function apply() {
    // html lang
    document.documentElement.setAttribute('lang', lang);

    // Doc + OG
    document.title = t('doc.title');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc  = document.querySelector('meta[property="og:description"]');
    const ogURL   = document.querySelector('meta[property=\"og:url\"]');
    if (ogTitle) ogTitle.setAttribute('content', t('og.title'));
    if (ogDesc)  ogDesc.setAttribute('content',  t('og.description'));
    if (ogURL) {
      const baseURL = (lang === 'es') ? 'https://www.sabiduriaholistica.org/' : 'https://psyhackers.org/';
      ogURL.setAttribute('content', baseURL);
    }

    // Update header links (logo and title) by language
    const headerURL = (lang === 'es') ? 'https://www.sabiduriaholistica.org/' : 'https://psyhackers.org/';
    const siteLink = document.getElementById('siteLink');
    const titleLink = document.getElementById('titleLink');
    if (siteLink) siteLink.setAttribute('href', headerURL);
    if (titleLink) titleLink.setAttribute('href', headerURL);

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    // Attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (key) el.setAttribute('aria-label', t(key));
    });

    // Swap meditation intention (significado) per row if EN available
    try {
      const useEN = (lang === 'en' && Array.isArray(window.descs_en) && window.descs_en.length === 72);
      const src = useEN ? window.descs_en : window.descs;
      if (Array.isArray(src)) {
        document.querySelectorAll('#shemotTable tbody tr').forEach(tr => {
          const ord = parseInt(tr.getAttribute('data-ord') || '0', 10);
          if (!ord || ord < 1 || ord > 72) return;
          const td = tr.children[6];
          if (!td) return;
          const text = src[ord - 1] || '';
          // Preserve any nested controls; replace only text content
          // Safer: clear and set plain text
          td.textContent = text;
        });
      }
    } catch (_) {}

    // Zodiac titles in table
    const names = dict[lang]['zodiac'] || [];
    document.querySelectorAll('.zodiac').forEach((el, i) => {
      const idx = Math.floor(((parseInt(el.closest('tr')?.dataset?.ord || '1', 10) - 1) / 6));
      el.setAttribute('title', names[idx] || '');
      el.setAttribute('aria-label', names[idx] || '');
    });

    // Ensure selector reflects value
    const sel = document.getElementById('lang');
    if (sel) sel.value = lang;

    // If app has dynamic heading or tooltips, re-render
    if (window.fullUpdate) {
      try { window.fullUpdate(); } catch (_e) {}
    }
  }

  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    lang = next;
    try { localStorage.setItem('lang', lang); } catch (_) {}
    apply();
  }

  function getLang() { return lang; }

  // Wire selector
  window.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('lang');
    if (sel) {
      sel.value = lang;
      sel.addEventListener('change', () => setLang(sel.value));
    }
    apply();
  });

  // Expose minimal API
  window.I18N = {
    t, apply, setLang, getLang,
    zodiacNames: { es: dict.es.zodiac, en: dict.en.zodiac }
  };
})();




