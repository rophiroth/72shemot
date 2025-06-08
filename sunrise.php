<?php
/* sunrise.php
   Retorna { "sunrise":"HH:MM" } para las coords y TZ dadas */
header('Content-Type: application/json; charset=utf-8');

$lat = isset($_GET['lat']) ? floatval($_GET['lat']) : 0.0;
$lng = isset($_GET['lng']) ? floatval($_GET['lng']) : 0.0;
$tz  = $_GET['tz'] ?? 'UTC';

$now = time();
$utc = date_sunrise($now, SUNFUNCS_RET_STRING, $lat, $lng, 90 + 50/60, 0);
if ($utc === false) { echo json_encode(['error'=>'no_sunrise']); exit; }

try {
  $d = DateTime::createFromFormat('H:i',$utc,new DateTimeZone('UTC'));
  $d->setTimezone(new DateTimeZone($tz));
  echo json_encode(['sunrise'=>$d->format('H:i')]);
} catch(Exception $e) {
  echo json_encode(['error'=>'tz_error']);
}
?>
