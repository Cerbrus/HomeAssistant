# ADR-0012: Resolve `cerbrus.nl` to the Pi inside the LAN

- **Status:** Accepted
- **Date:** 2026-06-23, extended 2026-11-20
- **Origin:** Recorded at decision time

## Context

LAN clients that opened a `cerbrus.nl` host name were sent to the public address and back in through the modem (NAT hairpin). The modem's hairpin is unreliable: about a quarter of the requests hung, and Home Assistant's frontend stalled on its websocket. The modem has no setting for it.

## Decision

Pi-hole answers every name under `cerbrus.nl` with the Pi's LAN address and never forwards queries for that domain upstream. LAN clients use Pi-hole as their only DNS server, for IPv4 and IPv6.

## Alternatives considered

- Using LAN addresses and ports directly inside the home: no TLS, different URLs inside and outside.
- A modem with working hairpin: not available at the time.

## Consequences

- The same URLs work inside and outside, and LAN traffic stays on the LAN.
- One wildcard rule suffices because Nginx Proxy Manager fronts every subdomain. A subdomain that bypasses the proxy needs its own override.
- The 2026-11-20 extension blocks forwarding for the whole domain: before it, an IPv6 lookup fetched the public record into Pi-hole's cache and broke the rule for ten minutes at a time.
- Any client with a public resolver configured falls back onto the hairpin.
- Exception, decided 2026-11-21: the Home Assistant host keeps a public resolver as second DNS server behind Pi-hole. It only answers when Pi-hole is down, and keeps Home Assistant and its cloud integrations online during such an outage.
