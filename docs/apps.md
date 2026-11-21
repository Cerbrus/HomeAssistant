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
