# ADR-0001: Host everything on one Raspberry Pi running Home Assistant OS

- **Status:** Accepted
- **Date:** 2026-03-30
- **Origin:** Backfilled, rationale confirmed

## Context

The home needs Home Assistant, a reverse proxy, a media stack (Plex, the arr apps, a download client) and energy tooling. The current install dates from 2026-03-30 on a Raspberry Pi 4.

## Decision

Run Home Assistant OS on the Pi and install every other service as a Home Assistant app on the same machine.

## Alternatives considered

- A manually managed Pi (general-purpose OS, services installed and updated by hand): full control, but every service is its own maintenance job, and there is no Supervisor, app store or managed backup.

## Consequences

- One machine, one update mechanism, one backup covers every app.
- Apps appear in the Home Assistant sidebar through ingress.
- The Pi is a single point of failure: when it is down, the proxy and every `cerbrus.nl` host name go with it.
- CPU, memory and disk are shared between Home Assistant and media workloads.
- Home Assistant OS is locked down, which causes some friction (restricted host access, everything has to fit the app model). Accepted for now; a manually managed Pi remains the alternative if that friction grows.
