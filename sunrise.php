<?php
/* sunrise.php
   Retorna {
     "sunrise":"HH:MM",
     "sunset":"HH:MM",
     "next_sunrise":"HH:MM",
     "next_sunset":"HH:MM"
   } para las coords y TZ dadas */
header('Content-Type: application/json; charset=utf-8');

$lat = isset($_GET['lat']) ? floatval($_GET['lat']) : 0.0;
$lng = isset($_GET['lng']) ? floatval($_GET['lng']) : 0.0;
$tz  = $_GET['tz'] ?? 'UTC';

$now = time();
$utc_rise = date_sunrise($now, SUNFUNCS_RET_STRING, $lat, $lng, 90 + 50/60, 0);
$utc_set  = date_sunset($now,  SUNFUNCS_RET_STRING, $lat, $lng, 90 + 50/60, 0);
$tomorrow = $now + 86400;
$utc_rise_next = date_sunrise($tomorrow, SUNFUNCS_RET_STRING, $lat, $lng, 90 + 50/60, 0);
$utc_set_next  = date_sunset($tomorrow,  SUNFUNCS_RET_STRING, $lat, $lng, 90 + 50/60, 0);
if ($utc_rise === false && $utc_set === false) { echo json_encode(['error'=>'no_sun_data']); exit; }

try {
  $tzObj = new DateTimeZone($tz);
  $rise = null; $set = null; $riseN = null; $setN = null;
  if ($utc_rise !== false) {
    $d = DateTime::createFromFormat('H:i', $utc_rise, new DateTimeZone('UTC'));
    if ($d) { $d->setTimezone($tzObj); $rise = $d->format('H:i'); }
  }
  if ($utc_set !== false) {
    $s = DateTime::createFromFormat('H:i', $utc_set, new DateTimeZone('UTC'));
    if ($s) { $s->setTimezone($tzObj); $set = $s->format('H:i'); }
  }
  if ($utc_rise_next !== false) {
    $dn = DateTime::createFromFormat('H:i', $utc_rise_next, new DateTimeZone('UTC'));
    if ($dn) { $dn->setTimezone($tzObj); $riseN = $dn->format('H:i'); }
  }
  if ($utc_set_next !== false) {
    $sn = DateTime::createFromFormat('H:i', $utc_set_next, new DateTimeZone('UTC'));
    if ($sn) { $sn->setTimezone($tzObj); $setN = $sn->format('H:i'); }
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
