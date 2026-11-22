# Apps

Home Assistant apps (formerly add-ons) installed on the Pi. Versions are left out on purpose: the Supervisor is the source of truth.

## Access and network

| App | Purpose | State |
| --- | --- | --- |
| Nginx Proxy Manager | Reverse proxy and TLS for every `cerbrus.nl` host name | Running |
| Tailscale | Remote administration without open ports | Running |
| Mosquitto broker | MQTT broker, used by DSMR Reader | Running |

### Nginx Proxy Manager theme

The admin interface on `proxy.cerbrus.nl` is styled with the [theme.park](https://theme-park.dev) `organizr` theme. The proxy host's custom Nginx configuration injects the stylesheet into every page:

```nginx
proxy_set_header Accept-Encoding "";
sub_filter
   '</body>'
   '<link rel="stylesheet" type="text/css" href="https://theme-park.dev/css/base/nginx-proxy-manager/organizr.css">
   </body>';
sub_filter_once on;
```

The link goes before `</body>`, not `</head>`. Nginx Proxy Manager loads its Tabler stylesheet from JavaScript, which appends it to the end of `<head>`. A theme link in `<head>` then comes first and loses every rule that uses the same selector, which left modals and dropdown menus see-through. At the end of `<body>` the theme comes last and wins ([ADR-0022](adr/0022-npm-theme-injected-at-end-of-body.md)).

The theme only applies through the proxy host; the direct admin port shows the stock interface.

## Configuration and maintenance

| App | Purpose | State |
| --- | --- | --- |
| Git pull | Pulls this repository into `/config` | Running |
| Studio Code Server | Editor in the browser | Running |
| File editor | Simple editor, also the ingress host for the sidebar shortcuts | Running |
| Advanced SSH & Web Terminal | Shell access | Running |
| Home Assistant Google Drive Backup | Copies backups to Google Drive | Running |

## Energy

| App | Purpose | State |
| --- | --- | --- |
| DSMR Reader | Reads the smart meter's P1 port, publishes to MQTT | Running |
| TimescaleDB | PostgreSQL database that DSMR Reader stores its readings in | Running |
| pgAdmin4 | Database administration | Running |

## Media stack

| App | Purpose | State |
| --- | --- | --- |
| Plex Media Server | Streaming | Running |
| Radarr | Movies | Running |
| Sonarr | TV series | Running |
| Bazarr | Subtitles | Running |
| Prowlarr | Indexer manager | Running |
| FlareSolverr | Cloudflare challenge solver for indexers | Running |
| Transmission | Download client | Running |
| Seerr | Media requests | Running |

### Suggestions

SuggestArr is the one part of the media stack that is not a Home Assistant app: it runs as a Docker Compose project on the server Pi ([ADR-0026](adr/0026-suggestarr-on-the-server-pi.md)). It reads the Plex watch history, finds similar titles on TMDB and requests them in Seerr, from where they follow the normal route through Radarr and Sonarr.

- The compose file pins the image tag and sets a memory limit. To update: change the tag, then `docker compose pull` and `docker compose up -d` in its directory.
- Its configuration, database and log are in `config_files/` next to the compose file. Home Assistant's backups do not cover them.
- It has its own login. Jobs, filters and users are set in its interface, at `suggestions.cerbrus.nl` or through the sidebar ([dashboards.md](dashboards.md)).

### Movie size and quality

Radarr rejects every release above 20 GB (Settings > Indexers > Options > Maximum Size). The `Ultra-HD` profile also allows 1080p (HDTV, WEB, Bluray), so a movie without a 4K release under the limit still gets a 1080p one and upgrades when a smaller 4K release appears. The profile's cutoff is WEB 2160p: once a movie has a 4K web release or better, Radarr stops upgrading it, so a movie is downloaded at most twice. Sonarr has no size limit: season packs are larger than that.

### Fake downloads

Public indexers regularly serve torrents whose content is a Windows executable named after an episode or movie. Every indexer in Radarr and Sonarr therefore has **Fail Downloads** set to `Executables` and `Potentially Dangerous`: such a download is marked as failed, blocklisted and searched again instead of waiting in the queue.

Indexer priority keeps most of them out: The Pirate Bay and Knaben have priority 10, LimeTorrents and TorrentDownload 40, the rest the default 25. Among releases of the same quality the lower number wins before the seeder count is looked at, and the fakes came from the two at 40 with inflated seeder counts. The priority is set in Prowlarr, which syncs it to Radarr and Sonarr.

The option is an advanced setting on the indexer itself (Settings > Indexers, with Show Advanced on). Prowlarr does not manage it and keeps it on a sync. It has no default, and it only acts once the fake has been downloaded completely.

`scripts/arr_guard.py` covers both gaps ([ADR-0025](adr/0025-arr-guard-script-over-cleanuparr.md)). Home Assistant runs it through three automations, see [automations.md](automations.md):

- Every minute it reads the file lists from Transmission. A torrent holding an executable (`.exe`, `.scr`, `.msi`, `.bat`, `.cmd`, `.pif`, `.lnk`, `.vbs`, `.ps1`, `.zipx`, `.arj`) is removed through the Sonarr or Radarr queue with blocklisting, usually within a minute of being added. Torrents that are not in either queue are left alone.
- Once a day it sets Fail Downloads on every indexer that lacks it, so an indexer that Prowlarr adds later is covered.

- Once a week it starts a search for all missing monitored movies and episodes. Radarr and Sonarr only search when something is added; after that they watch the newest uploads, so a release that appears later is easily missed. Public indexers can answer part of a large search with rate-limit errors; what is skipped is searched again the week after.

The script takes the addresses and API keys from the Sonarr, Radarr and Transmission integrations in Home Assistant. `--dry-run` reports without changing anything.
