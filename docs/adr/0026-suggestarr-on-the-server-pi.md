# ADR-0026: Run SuggestArr as a container on the server Pi

- **Status:** Accepted
- **Date:** 2026-11-22
- **Origin:** Recorded at decision time

## Context

Seerr only requests what someone asks for. SuggestArr adds suggestions from the Plex watch history: it looks up similar titles and requests them in Seerr. It is published as a Docker image only. There is no Home Assistant app for it, and Home Assistant OS runs no containers outside the Supervisor, so it does not fit the rule of [ADR-0001](0001-single-pi-hosts-everything.md) as it is.

## Decision

Run SuggestArr with Docker Compose on the server Pi, which already runs Docker for the hobby web apps. It reaches Plex and Seerr over the LAN.

## Alternatives considered

- A local Home Assistant app that wraps the image: stays on the one Pi and in its backups, but the wrapper is ours to maintain and to bump for every release.
- Portainer with protection mode off: runs the container next to the Supervisor, which makes the system unsupported and keeps it out of the backups.
- An own script, as for the fake downloads ([ADR-0025](0025-arr-guard-script-over-cleanuparr.md)): no container, but it rebuilds the filters, the check on earlier requests and the interface that SuggestArr already has.
- Radarr's Discover page alone: suggests from the library, not from what was watched, and Sonarr has no counterpart.

## Consequences

- The first part of the media stack that is not a Home Assistant app. It is not in the sidebar through ingress, and the Supervisor does not update it.
- The image tag is pinned in the compose file on the server Pi. An update is a change of that tag and a pull, by hand.
- Home Assistant's backups do not hold its configuration and database.
- The server Pi is a Raspberry Pi 3B+ with little memory to spare. The container has a memory limit, as every container there has.
- When the server Pi is down, suggestions stop; requests, downloads and streaming carry on.
