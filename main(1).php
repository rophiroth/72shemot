<?php
/* ---------- LOG ---------- */
ini_set('display_errors', 0);
ini_set('log_errors',    1);
ini_set('error_log', __DIR__ . '/php_error.log');
/* ------------------------- */

require_once __DIR__ . '/data/shemot_data.php';
$rows = get72ShemotData();        // 72 filas
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
    <!-- Open Graph meta tags para compartir en redes -->
<meta property="og:title" content="72 Nombres de Dios - Meditaciones de Luz" />
<meta property="og:description" content="Explora los 72 Nombres de Dios según la Kabaláh. Calcula cuál te corresponde ahora, según tu ubicación y hora exacta del amanecer." />
<meta property="og:image" content="https://72.psyhackers.org/assets/img/Logo.png" />
<meta property="og:url" content="https://72.psyhackers.org/" />
<meta property="og:type" content="website" />
  <title>72 Nombres de אל – Jesed</title>

  <!-- CSS -->
    <link rel="stylesheet" href="assets/css/dstyle.css?v=<?= time() ?>">
    <link rel="icon" type="image/png" href="assets/img/favicon.png">
  <!-- Fuentes locales -->
  <style>
    @font-face{font-family:"StamAshkenazCLM";src:url("assets/fonts/StamAshkenazCLM.ttf") format("truetype");}
    @font-face{font-family:"Metatron";src:url("assets/fonts/Metatron-Regular.ttf") format("truetype");}
  </style>
</head>
<body class="no-show">
<div id="header-bar">
    <img src="assets/img/logo.png" alt="PsyHackers logo" />
    <h1>72 Nombres de <span class="stam">אל</span> – Jesed: Bondad Pura</h1>
</div>
<!-- CONTROLES -->
<div id="timezone-box" class="cur-box">
  <label for="tz">Zona horaria:</label>
  <select id="tz"></select>

  <label for="sunrise">Amanecer:</label>
  <input type="time" id="sunrise" step="60" value="06:00">
  <button id="gpsBtn" title="Usar GPS para mayor precisión">📍 Usar GPS</button>

</div>

<!-- CURRENT -->
<div id="current" class="cur-box">

  <!-- TÍTULO -->
  <h2>🕯️ Energía disponible en este momento</h2>

  <!-- BLOQUE SUPERIOR: hora y nombre -->
<div class="cur-name-block">

  <!-- Hora + Orden a la izquierda -->
  <div class="cur-info-col left">
    <div class="cur-time">⏰ <span id="curTime">--:--</span></div>
    <div class="cur-heading">Orden <span id="curOrd">--</span></div>
  </div>

  <!-- Nombre hebreo y metatrónico en una sola línea horizontal -->
  <div class="cur-name-row">
    <div id="curStam" class="cur-stam">
      <!-- Ej: <span>ד</span><span>נ</span><span>ל</span> -->
    </div>
    <div id="curMeta" class="cur-meta">
      <!-- Misma secuencia, fuente Metatron -->
    </div>
  </div>

</div>


  <!-- INFO INFERIOR: guematría + fonética + descripción -->
  <div class="cur-info-bottom">
    <div class="cur-gematria">Guematría <span id="curGem">--</span></div>
    <div id="curLet" class="cur-letters">lamed he jet</div>
    <div id="curDesc" class="cur-desc">Mensaje del Nombre...</div>
  </div>

  <!-- BOTÓN -->
  <div class="cur-action">
    <button id="curBtn" class="med-btn">🎵 Meditación guiada</button>
  </div>

</div>




<!-- TABLA -->
<table id="shemotTable">
  <thead>
    <tr>
      <th></th>
      <th>Hora de inicio</th>
      <th>Orden</th>
      <th>Nombre</th>
      <th>Letras</th>
      <th>Guematría</th>
      <th>Kavanah / Bendición</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($rows as $r): ?>
    <tr data-ord="<?= $r['orden'] ?>">
      <td class="btn-cell">
        <button class="med-btn" onclick="event.stopPropagation();openMedit(<?= $r['orden'] ?>)">🎵</button>
      </td>
      <td class="hora">--:--</td>
      <td><?= $r['orden'] ?></td>
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
</script>

<!-- SCRIPTS -->
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
