<?php
/* fetch_videos.php
   Descarga los 72 IDs de video del playlist
   y crea assets/js/videos.json  (índice 1-72 → videoId).

   USO:  php fetch_videos.php
------------------------------------------------------------------- */
$playlist = 'PLY6hMbYNKkn1FCUrk9gEMKY9i_wgww5m9';

/* 🔑  TU API KEY  */
$key = 'AIzaSyCJspTg8Rg4r2MpYwlIYa3m94vO-o45ZCM';

$next  = '';
$order = 1;
$map   = [];

do {
    $url = "https://www.googleapis.com/youtube/v3/playlistItems"
         . "?part=contentDetails&maxResults=50"
         . "&playlistId=$playlist&key=$key"
         . ($next ? "&pageToken=$next" : '');

    $json = json_decode(file_get_contents($url), true);
    if (!isset($json['items'])) {
        exit("❌ Error llamando a YouTube API\n");
    }
    foreach ($json['items'] as $it) {
        $map[$order++] = $it['contentDetails']['videoId'];
        if ($order > 72) break 2;          // solo necesitamos 72
    }
    $next = $json['nextPageToken'] ?? '';
} while ($next && $order <= 72);

/* Guarda videos.json */
file_put_contents(__DIR__ . '/assets/js/videos.json',
                  json_encode($map, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));

echo "✅  Guardado assets/js/videos.json con " . count($map) . " IDs\n";
?>
