# ADR-0002: Publish services on an own domain through DuckDNS and Nginx Proxy Manager

- **Status:** Accepted
- **Date:** 2026-03-30
- **Origin:** Backfilled, rationale confirmed

## Context

Home Assistant and the media apps must be reachable from outside the home. The internet connection has a dynamic public address. Of the ways to solve that, this was the most convenient one.

## Decision

Point `cerbrus.nl` subdomains at a DuckDNS name that Home Assistant keeps current (first the Duck DNS app next to the DuckDNS integration, since 2026-11-21 the integration alone), and let Nginx Proxy Manager on the Pi terminate TLS with Let's Encrypt and route by host name.

## Alternatives considered

- Home Assistant Cloud: paid, and covers Home Assistant only, not the other apps.
- A VPN only: every device and every user would need a client.

## Consequences

- One memorable host name per service, each with its own certificate.
- New services only need a proxy host in Nginx Proxy Manager.
- The modem must forward web traffic to the Pi, and the services are exposed to the internet behind their own logins.
- Refined by [ADR-0012](0012-split-horizon-dns.md) and [ADR-0013](0013-npm-only-public-entry.md).
