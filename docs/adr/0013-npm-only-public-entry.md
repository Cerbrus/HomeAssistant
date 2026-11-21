# ADR-0013: Make Nginx Proxy Manager the only entry from the internet

- **Status:** Accepted
- **Date:** 2026-11-20
- **Origin:** Recorded at decision time

## Context

Besides web traffic to the proxy, the modem also forwarded Home Assistant's own port and an SSH port straight to machines on the LAN. Those paths bypassed the proxy's TLS and access rules. The proxy's and Pi-hole's admin interfaces were reachable from outside through their host names.

## Decision

Forward only web traffic, and only to Nginx Proxy Manager. Remove the direct Home Assistant and SSH forwards. Restrict the proxy admin and Pi-hole admin host names to the LAN with an access list. Use Tailscale for remote administration.

## Alternatives considered

- Keeping the direct forwards as a fallback: a permanent second way in for the convenience of a rare case.

## Consequences

- One hardened entry point; every public service is behind TLS.
- Admin interfaces answer outside requests with 403.
- When the proxy is down, nothing is reachable from outside except through Tailscale.
- A new service must never get its own port forward; it gets a proxy host.
