#!/usr/bin/env python3
"""
Fetch the latest 72 video IDs from a YouTube playlist and write
assets/js/videos.json as a simple 1..72 → videoId map.

Usage:
  python3 tools/fetch_videos.py [--playlist PLAYLIST_ID] [--key API_KEY]

If not provided via flags, the script falls back to environment
variables YT_PLAYLIST_ID and YT_API_KEY, and finally to the defaults
used in fetch_videos.php to preserve behavior.
"""
import argparse
import json
import os
import sys
from urllib.request import urlopen
from urllib.parse import urlencode


DEFAULT_PLAYLIST = 'PLY6hMbYNKkn1FCUrk9gEMKY9i_wgww5m9'
DEFAULT_KEY = 'AIzaSyCJspTg8Rg4r2MpYwlIYa3m94vO-o45ZCM'


def fetch_page(playlist_id: str, api_key: str, page_token: str = ''):
    params = {
        'part': 'contentDetails',
        'maxResults': 50,
        'playlistId': playlist_id,
        'key': api_key,
    }
    if page_token:
        params['pageToken'] = page_token
    url = 'https://www.googleapis.com/youtube/v3/playlistItems?' + urlencode(params)
    with urlopen(url) as resp:
        return json.loads(resp.read().decode('utf-8'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--playlist', default=os.getenv('YT_PLAYLIST_ID', DEFAULT_PLAYLIST))
    ap.add_argument('--key', default=os.getenv('YT_API_KEY', DEFAULT_KEY))
    ap.add_argument('--limit', type=int, default=72)
    ap.add_argument('--out', default=os.path.join('assets', 'js', 'videos.json'))
    args = ap.parse_args()

    playlist_id = args.playlist
    api_key = args.key
    limit = args.limit

    if not playlist_id or not api_key:
        print('Missing playlist or API key', file=sys.stderr)
        return 2

    order = 1
    mapping = {}
    token = ''
    try:
        while order <= limit:
            page = fetch_page(playlist_id, api_key, token)
            items = page.get('items', [])
            if not items:
                break
            for it in items:
                vid = it.get('contentDetails', {}).get('videoId')
                if vid:
                    mapping[str(order)] = vid
                    order += 1
                    if order > limit:
                        break
            token = page.get('nextPageToken', '')
            if not token:
                break
    except Exception as e:
        print(f'Error fetching playlist: {e}', file=sys.stderr)
        return 1

    out_path = args.out
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)
        f.write('\n')

    print(f'Wrote {len(mapping)} IDs to {out_path}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

