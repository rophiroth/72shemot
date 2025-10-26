<?php
/* sunrise.php
   Retorna {
     "sunrise":"HH:MM:SS",
     "sunset":"HH:MM:SS",
     "next_sunrise":"HH:MM:SS",
     "next_sunset":"HH:MM:SS"
   } para las coords y TZ dadas (precisión a segundos) */
header('Content-Type: application/json; charset=utf-8');

$lat = isset($_GET['lat']) ? floatval($_GET['lat']) : 0.0;
$lng = isset($_GET['lng']) ? floatval($_GET['lng']) : 0.0;
$tz  = $_GET['tz'] ?? 'UTC';

$now = time();
$utc_rise = date_sunrise($now, SUNFUNCS_RET_TIMESTAMP, $lat, $lng, 90 + 50/60, 0);
$utc_set  = date_sunset($now,  SUNFUNCS_RET_TIMESTAMP, $lat, $lng, 90 + 50/60, 0);
$tomorrow = $now + 86400;
$utc_rise_next = date_sunrise($tomorrow, SUNFUNCS_RET_TIMESTAMP, $lat, $lng, 90 + 50/60, 0);
$utc_set_next  = date_sunset($tomorrow,  SUNFUNCS_RET_TIMESTAMP, $lat, $lng, 90 + 50/60, 0);
if ($utc_rise === false && $utc_set === false) { echo json_encode(['error'=>'no_sun_data']); exit; }

try {
  $tzObj = new DateTimeZone($tz);
  $rise = null; $set = null; $riseN = null; $setN = null;
  if ($utc_rise !== false) {
    $d = new DateTime('@' . $utc_rise); $d->setTimezone(new DateTimeZone('UTC')); $d->setTimezone($tzObj);
    // Use HH:MM:SS to be compatible with HTML <input type="time">
    $rise = $d->format('H:i:s');
  }
  if ($utc_set !== false) {
    $s = new DateTime('@' . $utc_set); $s->setTimezone(new DateTimeZone('UTC')); $s->setTimezone($tzObj);
    $set = $s->format('H:i:s');
  }
  if ($utc_rise_next !== false) {
    $dn = new DateTime('@' . $utc_rise_next); $dn->setTimezone(new DateTimeZone('UTC')); $dn->setTimezone($tzObj);
    $riseN = $dn->format('H:i:s');
  }
  if ($utc_set_next !== false) {
    $sn = new DateTime('@' . $utc_set_next); $sn->setTimezone(new DateTimeZone('UTC')); $sn->setTimezone($tzObj);
    $setN = $sn->format('H:i:s');
  }
  $out = [];
  if ($rise) $out['sunrise'] = $rise;
  if ($set)  $out['sunset']  = $set;
  if ($riseN) $out['next_sunrise'] = $riseN;
  if ($setN)  $out['next_sunset']  = $setN;
  echo json_encode($out);
} catch(Exception $e) {
  echo json_encode(['error'=>'tz_error']);
}
?>
