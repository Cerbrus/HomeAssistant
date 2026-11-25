# ADR-0028: Restrict the media admin apps to the LAN

- **Status:** Accepted
- **Date:** 2026-11-25
- **Origin:** Recorded at decision time

## Context

Every `cerbrus.nl` host name is published through Nginx Proxy Manager ([ADR-0013](0013-npm-only-public-entry.md)), and automated scanners sweep each public host name with hundreds of requests at a time. Radarr, Sonarr, Prowlarr, Bazarr and SuggestArr are admin tools that only the owner uses, and in practice only from inside the home. Being public gave them nothing but exposure.

## Decision

Put the proxy hosts of Radarr, Sonarr, Prowlarr, Bazarr and SuggestArr on the "LAN only" access list. Home Assistant, Plex, Seerr and the apps on the server Pi stay public.

## Alternatives considered

- Leaving them public behind their own login: each app's login stays the only barrier, on five more surfaces than needed.
- Blocking scanner traffic at the proxy (ban lists, path filters): reduces noise, but the apps stay reachable.
- Removing the proxy hosts: the sidebar dashboards and the HTTPS host names inside the home would be lost.

## Consequences

- The five apps answer outside requests with 403; inside the home nothing changes ([ADR-0012](0012-split-horizon-dns.md)).
- Their sidebar dashboards stay empty when Home Assistant is opened from outside the home.
- Outside the home these apps are reached through Tailscale.
- Requests through Seerr keep working: it reaches Radarr and Sonarr inside the LAN, not through the proxy.
- A new admin-only app gets the "LAN only" access list from the start.
