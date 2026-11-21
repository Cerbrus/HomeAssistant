# ADR-0015: Move from HACS to the built-in Marketplace and drop the git status sensor

- **Status:** Accepted
- **Date:** 2026-11-20
- **Origin:** Recorded at decision time

## Context

Home Assistant 2026.11 ships the Marketplace, the built-in successor to HACS. Separately, a command line sensor with a shell script reported the config repository's git status on the Pi; nothing used it and it had needed several rounds of debugging.

## Decision

Migrate the community downloads to the Marketplace and point the sidebar entry at the Marketplace panel. Remove the git status sensor and its script. Move the `http` proxy settings from YAML to the UI in the same change.

## Alternatives considered

- Staying on HACS: a custom component duplicating a built-in feature.

## Consequences

- One less custom component; community downloads are managed by Home Assistant itself.
- Frontend modules are still served from the `/hacsfiles/` path.
- The git state of the Pi's config directory is no longer visible in Home Assistant; check it over SSH.
- The removed sensors left stale registry entries, cleaned up on 2026-11-21.
