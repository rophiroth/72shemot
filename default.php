<?php
/* ---------- LOG ---------- */
ini_set('display_errors', 0);
ini_set('log_errors',    1);
ini_set('error_log', __DIR__ . '/php_error.log');
/* ------------------------- */

require_once __DIR__ . '/data/shemot_data.php';
$rows = get72ShemotData();        // 72 filas

// Optional English dataset (if present)
$rows_en = null;
$en_file = __DIR__ . '/data/shemot_data_en.php';
if (file_exists($en_file)) {
  require_once $en_file;
  if (function_exists('get72ShemotDataEN')) {
    $rows_en = get72ShemotDataEN();
  }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <!-- Open Graph meta tags para compartir en redes -->
<meta property="og:title" content="72 Nombres de Dios - Meditaciones de Luz" />
<meta property="og:description" content="Explora los 72 Nombres de Dios según la Kabaláh. Calcula cuál te corresponde ahora, según tu ubicación y hora exacta del amanecer." />
<meta property="og:image" content="https://72.psyhackers.org/assets/img/Logo.png" />
<meta property="og:url" content="https://72.psyhackers.org/" />
<meta property="og:type" content="website" />
  <title>72 Nombres de אל – Jesed</title>

  <!-- CSS -->
    <link rel="stylesheet" href="assets/css/style.css?v=<?= time() ?>">
    <link rel="icon" type="image/png" href="assets/img/favicon.png">
    <link rel="icon" type="image/png"
 sizes="192x192" href="assets/img/icon-192x192.png" style="width: 192px; height: 192px;">
     <link rel="icon" type="image/png"
 sizes="512x512" href="assets/img/icon-512x512.png" style="width: 512px; height: 512px;">
  <!-- Fuentes locales -->
  <style>
    @font-face{font-family:"StamAshkenazCLM";src:url("assets/fonts/StamAshkenazCLM.ttf") format("truetype");}
    @font-face{font-family:"Metatron";src:url("assets/fonts/Metatron-Regular.ttf") format("truetype");}
  </style>
</head>
<body class="no-show">
<div id="header-bar">
    <a id="siteLink" href="https://www.sabiduriaholistica.org/" target="_blank" rel="noopener">
      <img src="assets/img/logo.png" alt="PsyHackers logo" />
    </a>
    <h1>
      <a id="titleLink" href="https://www.sabiduriaholistica.org/" target="_blank" rel="noopener">
      <span data-i18n="header.h1_prefix">72 Nombres de</span>
      <span class="stam">אל</span>
      <span class="h1-suffix" data-i18n="header.h1_suffix">- Jesed: Bondad Pura</span>
      </a>
    </h1>

    <div class="lang-switch">
      <label for="lang" class="sr-only" data-i18n="ui.language">Idioma:</label>
      <select id="lang" aria-label="Language">
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
</div>
<!-- MENÚ DE OPCIONES -->
<div id="options-bar">
  <button id="menuBtn" class="menu-btn" aria-haspopup="true" aria-controls="optionsPanel" aria-expanded="false" title="Opciones">
    <span class="menu-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="24" height="24" role="img" focusable="false">
        <rect x="3" y="6" width="18" height="2" fill="currentColor"/>
        <rect x="3" y="11" width="18" height="2" fill="currentColor"/>
        <rect x="3" y="16" width="18" height="2" fill="currentColor"/>
      </svg>
    </span>
  </button>
  <div id="optionsPanel" class="options-panel" hidden>
    <div id="timezone-box" class="cur-box options-section">
      <label for="tz" class="tz-label">
        <span class="label-long" data-i18n="ui.timezone">Zona horaria:</span>
        <span class="label-short" aria-hidden="true">TZ</span>
      </label>
      <select id="tz"></select>

      <label for="sunrise" class="sunrise-label">
        <span class="label-long" data-i18n="ui.sunrise">Amanecer:</span>
        <span class="label-short" aria-hidden="true">🌅</span>
      </label>
  <input type="time" id="sunrise" step="1" value="06:00:00">
      <button id="gpsBtn" class="gps-btn" data-i18n-title="ui.use_gps_title" data-i18n-aria-label="ui.use_gps_title" title="Usar GPS para mayor precisión" aria-label="Usar GPS para mayor precisión">
        <span class="gps-btn__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" />
          </svg>
        </span>
        <span class="gps-btn__text" data-i18n="ui.use_gps_label">Usar GPS</span>
      </button>
    </div>
    <div class="options-section toggles">
      <span class="twelve-mode-wrap">
        <input type="checkbox" id="twelveToggle" class="twelve-toggle" aria-label="Modo 12 horas (10 min)" />
        <label for="twelveToggle" class="twelve-label" title="12h (10 min) Noche: normal · Día: invertido" data-i18n-title="twelve.hint">🔄</label>
      </span>
      <span class="anchor-mode-wrap">
        <input type="checkbox" id="anchorSun" class="anchor-toggle" aria-label="Arrancar desde el atardecer" />
        <label for="anchorSun" class="anchor-label" title="Activado: atardecer · Desactivado: amanecer">🌅/🌇</label>
      </span>
      <span class="solar-mode-wrap">
        <input type="checkbox" id="solarAdjust" class="solar-toggle" aria-label="Ajuste solar proporcional" />
        <label for="solarAdjust" class="solar-label" title="⏳ Ajusta día/noche para que 36/36 o 72/72 cubran exactamente la duración real">⏳</label>
      </span>
      <!-- Latitud compacta (visible cuando ⏳ está activo) -->
      <span class="latdeg-wrap" id="latDegWrap" hidden>
        <label for="latDeg" class="latdeg-label" title="Latitud geográfica (grados). Norte positivo, Sur negativo.">φ</label>
        <input type="number" id="latDeg" class="latdeg-input" min="-90" max="90" step="0.1" placeholder="0" aria-label="Latitud (°)" />
      </span>
    </div>
  </div>
</div>

<!-- CURRENT -->
<div id="current" class="cur-box">
<div class="cur-name-row">
  <!-- TÍTULO -->
  <h2 data-i18n="current.title">🕯️ Energía disponible en este momento</h2>
    <!-- Hora + orden -->
    <div class="cur-info-col">
      <div class="cur-time">⏰ <span id="curTime">--:--</span> · ⏳ <span id="curDur" title="Duración del bloque">--′</span></div>
      <div class="cur-heading">
        <span id="curHeading">--</span>
        <span id="curOrd" style="display:none">--</span>
        &nbsp;·&nbsp;
        <span id="curZod" class="zodiac-badge">--</span>
      </div>
    </div>
</div>
  <!-- Nombre en el centro -->
  <div class="cur-name-center">

    <!-- Letras hebreas y metatrónicas -->
    <div class="cur-name-row">
      <div id="curStam" class="cur-stam">
        <!-- Ej: <span>ד</span><span>נ</span><span>ל</span> -->
      </div>
      <div id="curMeta" class="cur-meta">
        <!-- Ej: <span>ד</span><span>נ</span><span>ל</span> -->
      </div>
    </div>

    <!-- Fonética centrada, pegada al hebreo -->
    <div id="curLet" class="cur-fonetic-row">
      <!-- Ej: dalet nun lamed -->
    </div>

  </div>

  <!-- Bloque inferior alineado horizontalmente -->
  <div class="cur-info-bottom">



    <!-- Guematría -->
    <div class="cur-gematria">
      <span data-i18n="labels.gematria">Guematría</span> <span id="curGem">--</span>
    </div>

    <!-- Descripción -->
    <div id="curDesc" class="cur-desc">
      Mensaje del Nombre...
    </div>

  </div>

  <!-- BOTÓN -->
  <div class="cur-action">
    <button id="curBtn" class="med-btn" data-i18n="buttons.guided">🎵 Meditación guiada</button>
    <span class="next-meditation-link" data-i18n="link.next_meditation" onclick="goToCurrentRow()">⬇️ Siguiente Meditación</span>
  </div>

</div>




<!-- TABLA -->
<table id="shemotTable">
  <thead>
    <tr>
      <th></th>
      <th data-i18n="th.start_time">Hora de inicio</th>
      <th data-i18n="th.order">Orden</th>
      <th data-i18n="th.name">Nombre</th>
      <th data-i18n="th.letters">Letras</th>
      <th data-i18n="th.gematria">Guematría</th>
      <th data-i18n="th.kavanah">Kavanah / Bendición</th>
    </tr>
  </thead>
  <tbody>
    <?php 
      $zodiacNames = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
      $zodiacEmoji = ['♈︎','♉︎','♊︎','♋︎','♌︎','♍︎','♎︎','♏︎','♐︎','♑︎','♒︎','♓︎'];
      foreach ($rows as $r): ?>
    <tr data-ord="<?= $r['orden'] ?>">
      <td class="btn-cell">
        <button class="med-btn" onclick="event.stopPropagation();openMedit(<?= $r['orden'] ?>)">🎵</button>
      </td>
      <td class="hora">--:--</td>
      <td class="ord">
        <span class="ord-num"><?= $r['orden'] ?></span>
        <?php $zIdx = (int)floor((($r['orden'] ?? 1) - 1) / 6); ?>
        <span class="zodiac" title="<?= $zodiacNames[$zIdx] ?? '' ?>">
          <?= $zodiacEmoji[$zIdx] ?? '' ?>
        </span>
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
        <!-- botón pequeño dentro de la celda -->
        
      </td>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>

<!-- EXPORTAR DATOS A JS -->
<script>
  window.names = <?= json_encode(array_column($rows,'nombre')); ?>;
  window.descs = <?= json_encode(array_column($rows,'significado')); ?>;
  window.descs_en = <?= json_encode($rows_en ? array_column($rows_en,'significado') : null); ?>;
</script>

<!-- BOTÓN PARA SUBIR AL TOPE -->
<a href="#" class="back-to-top" data-i18n-title="back_to_top" title="Volver arriba">↑</a>

<!-- SCRIPTS -->
<script src="assets/js/i18n.js?v=<?= time() ?>"></script>
<script src="assets/js/geo-ip.js?v=<?= time() ?>" defer></script>
<script src="assets/js/tz-select.js"></script>
<script src="assets/js/app.js?v=<?= time() ?>" defer></script>
<script>
  window.addEventListener('load', () => {
    document.body.classList.remove('no-show');
  });
</script>
</body>
</html>


