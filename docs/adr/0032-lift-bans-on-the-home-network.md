# ADR-0032: Lift bans on the home network automatically

- **Status:** Accepted
- **Date:** 2026-11-26
- **Origin:** Recorded at decision time

## Context

Home Assistant bans an address after three failed logins ([ADR-0029](0029-harden-public-logins.md)). It counts every address, and has no setting to leave the home network out. A browser tab that keeps retrying an expired session, or a few typos, locks an own device out until someone removes the ban by hand over SSH. The counter is not reset by time, only by a successful login from that address or a restart.

## Decision

An automation lifts a ban when the banned address starts with the trusted prefix in `input_text.login_notification_trusted_prefix`: it removes the address from `ip_bans.yaml` with `scripts/unban_address.py` and restarts Home Assistant. Addresses outside the home stay banned.

## Alternatives considered

- The trusted networks login provider: devices at home log in without a password, so typos cannot happen. Requests with an expired session still count, and anyone on the home network gets in without a password.
- Lifting bans by hand: safe, but it needs a second device or SSH at the moment the first one is locked out.
- A higher threshold: more guesses for everyone, and a retrying tab still reaches it.

## Consequences

- A device at home is locked out for about a minute, the time of the restart, instead of until someone steps in.
- The restart is needed: Home Assistant reads the ban list at startup only. It also resets the failed login counters of all addresses.
- Someone on the home network can keep guessing, three attempts per restart. The home network is trusted here; the ban is aimed at the internet.
- The phone gets two notifications in that case: the ban, and that it was lifted.
- The trusted prefix is IPv4 only, as for the notification that the same helper dismisses.
