# ADR-0029: Harden the logins that stay public

- **Status:** Accepted
- **Date:** 2026-11-25
- **Origin:** Recorded at decision time

## Context

Home Assistant, Plex, Seerr and the apps on the server Pi stay reachable from the internet ([ADR-0028](0028-media-admin-apps-lan-only.md)). Their host names are public knowledge and get swept by automated scanners. Home Assistant's login is the most valuable one: it controls the house and opens the admin tools in the sidebar.

## Decision

- Home Assistant bans an address after three failed logins (`login_attempts_threshold: 3`).
- The Home Assistant account that can log in from outside uses an authenticator app as second factor.
- Every proxy host forces HTTPS and sends HSTS, without the subdomains option.
- Requests that match no proxy host are redirected to `https://error.cerbrus.nl/404` instead of showing the proxy's own welcome page.
- No ban tooling (CrowdSec, fail2ban) in front of the proxy.

## Alternatives considered

- A threshold of five: fewer accidental bans, more guesses per address. Three was chosen.
- Dropping unmatched requests without an answer (444): reveals least, but a mistyped address then looks like a broken connection. The error page is consistent with what unknown subdomains already get.
- Ban tooling at the proxy: another app to run on the Pi ([ADR-0019](0019-lean-marketplace.md)) for sweeps that only cost a few hundred 404 responses.
- "Block Common Exploits" on the Plex host: Plex clients send paths and URLs as query parameters, which that rule set blocks. It stays off there and on everywhere else.

## Consequences

- An own device gets banned too after three failed logins in a row, for example a browser tab that keeps retrying an expired session. The ban only covers Home Assistant's web interface. Undo: remove the address from `ip_bans.yaml` in the configuration folder over SSH and restart Home Assistant.
- A new login from outside needs the authenticator app. A lost authenticator is reset over SSH.
- A host whose certificate fails to renew is refused by browsers until it is fixed; its LAN address keeps working.
- A new proxy host gets Force SSL, HSTS and Block Common Exploits switched on from the start.
