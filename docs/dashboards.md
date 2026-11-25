# Dashboards and sidebar

Dashboards are edited in the UI (storage mode). A redacted clone of their configuration is kept in [`dashboards/`](../dashboards) ([ADR-0020](adr/0020-redacted-dashboard-clone.md)).

## Clone

`python tools/export_dashboards.py <user@pi>` copies every `lovelace*` storage file from the Pi to `dashboards/*.yaml`. Coordinates become `REDACTED` and calendar entity ids become `calendar.redacted_N`. Run it after each dashboard change and commit the result. The clone is a reference for review and history, not a restorable backup.

## Dashboards

| Dashboard | Path | Access | Type |
| --- | --- | --- | --- |
| Home | `cerbrus-home` | Everyone | Main dashboard with the views Home, Energy, Heating, Weather, Media, System and Security |
| Map | `map` | Everyone, hidden from the sidebar | Built-in map |
| Plex | `pl-ex` | Admin | Iframe |
| Requests - Seerr | `se-err` | Admin | Iframe |
| Suggestions - SuggestArr | `suggest-arr` | Admin | Iframe |
| Movies - Radarr | `rad-arr` | Admin | Iframe |
| TV - Sonarr | `son-arr` | Admin | Iframe |
| Subtitles - Bazarr | `baz-arr` | Admin | Iframe |
| Indexers - Prowlarr | `prowl-arr` | Admin | Iframe |
| Nginx Proxy Manager | `nginx-proxy-manager` | Admin | Iframe |

The Home view opens its middle column with the front door: the eufy camera card shows the doorbell's last still, starts a 60 second live view on its play button and lists the recordings on the HomeBase. Live view is never started automatically, since each start wakes the doorbell, and the card's settings tab is hidden.

The Energy view has a Prices section for the dynamic contract: the all-in electricity price and the return price of this hour with a 24 hour trend, how this hour compares with the rest of the day, the cheapest and the most expensive hour, and today's gas price ([ADR-0024](adr/0024-energy-cost-energyzero-plus-markup.md)).

The Media view shows what the media stack is doing without opening the apps: upcoming episodes and movies from the Sonarr and Radarr calendars, Transmission's speeds, torrent counts and switches, the number of Plex streams, and what is playing on the TV and Spotify. It uses built-in cards only.

The Security view shows the probing traffic that the proxy refused ([ADR-0031](adr/0031-probe-log-and-security-view.md)): today's count, the count per day as a bar chart, and for the last 24 hours the most probed host names, the most active addresses, the most requested paths and the latest 15 requests. Below that it lists the addresses that Home Assistant banned and when the ban notification fired. Everything comes from `sensor.proxy_probes_today` and its attributes, rendered with built-in tile, statistics graph, markdown and activity cards; the addresses are in the sensor, not in the dashboard configuration.

The iframe dashboards use the `iframe` dashboard strategy and load the app's `cerbrus.nl` host name. Their paths contain a hyphen because Home Assistant requires one in dashboard paths. The Radarr, Sonarr, Prowlarr, Bazarr and SuggestArr host names are LAN only ([ADR-0028](adr/0028-media-admin-apps-lan-only.md)), so those dashboards stay empty when Home Assistant is opened from outside the home.

Radarr, Sonarr and Prowlarr redirect a logged-out visitor to an `http://` login URL, which a browser refuses to show inside the HTTPS Home Assistant page (blank frame). Their proxy hosts in Nginx Proxy Manager therefore carry `proxy_redirect http://$host/ https://$host/;` in the custom Nginx configuration. A new arr-style app in an iframe needs the same line.

## Sidebar

The sidebar is the main navigation ([ADR-0006](adr/0006-sidebar-as-main-navigation.md)). Three parts work together:

1. **Sidebar Organizer** (Marketplace frontend module, loaded through `frontend.extra_module_url` in `configuration.yaml`) groups the entries. Its configuration is `www/sidebar-organizer.yaml`.
2. **Custom panels** in `_yaml/panel_custom.yaml` add shortcuts to settings pages: Integrations, Devices, Entities, Helpers, Apps, Marketplace, Logs.
3. **Iframe dashboards** and app ingress panels bring the apps into the sidebar.

| Group | Entries | Collapsed by default |
| --- | --- | --- |
| Daily | Calendar | No |
| Media | Plex, Seerr, SuggestArr, Radarr, Sonarr, Bazarr, Prowlarr, Transmission, Media browser | Yes |
| Energy | Energy dashboard, DSMR Reader | Yes |
| Apps & Devices | Integrations, Devices, Entities, Helpers, Apps, Marketplace | Yes |
| Tools | Studio Code Server, Terminal, pgAdmin, Nginx Proxy Manager, Tailscale, Google Drive Backup | Yes |
| Activity | Logbook, History, Logs | Yes |

The To-do panel is hidden through `hidden_items`: no to-do lists are in use. The Seerr app's own ingress panel is hidden the same way: an ingress panel takes its title from the app and cannot be renamed, so the "Requests - Seerr" iframe dashboard replaces it.

After a Sidebar Organizer update, bump the `hacstag` value in `configuration.yaml` so browsers load the new file.
