# ADR-0034: Block password guessing at the proxy

- **Status:** Accepted
- **Date:** 2026-11-26
- **Origin:** Recorded at decision time

## Context

Home Assistant bans an address after three failed logins ([ADR-0029](0029-harden-public-logins.md)). That ban covers Home Assistant only. For the other apps that stay public, the proxy is the one place where every login attempt passes, and its probe log already records the refused ones ([ADR-0031](0031-probe-log-and-security-view.md)). The owner logs in with a password manager, so refused logins from outside are not typos.

## Decision

`scripts/proxy_block.py` runs every minute. An outside address that gets three login requests refused (POST answered with 401 or 403) on one guarded host name within an hour is added to the proxy's access list "Blocked", which sits on every public proxy host. A block lasts seven days and is then removed by the same script. The phone is notified of every block.

## Alternatives considered

- Notifying only, at ten refused logins: the block would still have to be made by hand, usually too late.
- A permanent block: addresses are reassigned, so the list would slowly fill with innocent visitors.
- Ban tooling such as CrowdSec: decided against in ADR-0029; this covers the one pattern that matters with what is already there.
- Letting Home Assistant write deny rules into the proxy's files: the two share no folder.

## Consequences

- Home Assistant needs a login for the proxy's API. It is read from `secrets.yaml` (`npm_identity`, `npm_secret`) and is not in git. Without it, a block cannot be written and the "Security - Monitoring broken" automation reports that.
- A blocked address gets a 403 on every public host name, not only on the one it guessed at.
- Guarded are the host names with a login of their own: `requests`, `seerr`, `recipes`, `shopping` and `pokemon`. Home Assistant guards itself, and Plex signs in through plex.tv.
- An own device outside the home that keeps sending a wrong password blocks the address it is on. `shell_command.proxy_unblock` with the address lifts a block; the attempts before that moment are then ignored.
- Every change to the list makes the proxy reload its configuration.
- A new public proxy host gets the access list "Blocked"; a new app with its own login is added to the guarded host names in the script.
