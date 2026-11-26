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

### Shared Nginx snippets

Four files in the `nginx/custom` folder of the proxy's configuration are not managed through its interface. They are part of the app's backup and not of this repository.

`server_proxy.conf` is included by every proxy host:

- It answers errors that the proxy itself produces with the matching page of `error.cerbrus.nl`, in place ([ADR-0030](adr/0030-proxy-error-pages-in-place.md)).
- It writes a second access log, `probes_access.log`, and serves that file to the LAN only.

`http_top.conf` defines that log: one JSON line per request that came from an outside address and got a 4xx answer or a redirect for an unmatched host name, with time, address, host name, method, path, status and user agent. The path is the one that was requested, without the query string, also when the proxy answered with its own error page. The app's own log rotation covers the file because its name ends in `_access.log`; it is lost when the app is reinstalled.

Two more snippets log a request that no proxy host matches as it came in, before its redirect ([ADR-0036](adr/0036-log-requests-before-the-redirect.md)):

- `server_redirect.conf` is included by the redirection host for unknown subdomains and writes its requests to the probe log.
- `http.conf` holds a server block that catches every request that no proxy host and no redirection host claims: by address, with a foreign host name or without one. It logs the request and redirects to `https://error.cerbrus.nl/404`. It outranks the Default Site of the proxy's interface, so that setting no longer does anything.

The pages those redirects end on, `404.cerbrus.nl/` and `error.cerbrus.nl/404`, are left out of the log.

`scripts/probe_stats.py` reads the log from the proxy and condenses it into `sensor.proxy_probes_today`; `scripts/probe_bursts.py` groups the same log into bursts per address for `sensor.proxy_probe_bursts`. Both feed the Security view ([dashboards.md](dashboards.md), [ADR-0031](adr/0031-probe-log-and-security-view.md)). It looks up the country and city of the addresses it shows at ip-api.com and caches the answers for 30 days ([ADR-0033](adr/0033-locate-probing-addresses-online.md)). The count is an indication, not a verdict: an own device outside the home that gets a 401 or 404 is counted too. Requests over HTTPS for an unknown host name are not in the log: the proxy refuses the handshake.

### Blocking and certificates

Two more scripts talk to the proxy's API, with the login in `secrets.yaml` (`npm_identity`, `npm_secret`). `scripts/proxy_common.py` holds what the proxy scripts share.

- `scripts/proxy_block.py` keeps the access list "Blocked" (deny entries, then allow all), which is set on every public proxy host. It adds an address after three refused logins within an hour and removes it after seven days ([ADR-0034](adr/0034-block-password-guessing-at-the-proxy.md)). Its own record is `.proxy_blocks.json` in the configuration folder, not in git.
- `scripts/proxy_certificates.py` reads the certificate that every enabled host name serves ([ADR-0035](adr/0035-check-the-certificates-that-are-served.md)).

A new public proxy host gets the access list "Blocked", an admin-only one "LAN only" ([ADR-0028](adr/0028-media-admin-apps-lan-only.md)).

To change a snippet: write the file inside the app's container, run `nginx -t`, then `nginx -s reload`.

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
