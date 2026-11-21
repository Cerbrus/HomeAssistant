# ADR-0004: Keep the configuration in a public git repository and deploy with the Git pull app

- **Status:** Accepted
- **Date:** 2026-04-03
- **Origin:** Backfilled, rationale confirmed

## Context

Configuration edited only on the Pi has no history and cannot be edited comfortably from a PC. The repository started as a home for a custom 404 page and was restructured on 2026-04-03 to match the layout of Home Assistant's config directory.

## Decision

The repository root mirrors `/config`. Changes are pushed to GitHub and the Git pull app brings them onto the Pi. Secrets, `.storage`, the database and Marketplace downloads are ignored.

## Alternatives considered

- Editing on the Pi only, relying on backups for history.
- A private repository: there was no reason for it to be private, so it is public. That requires care with what is committed.

## Consequences

- Every YAML change has history and can be reviewed and reverted.
- Anything committed is public: no addresses, coordinates, tokens or account details in tracked files or docs.
- UI-managed state (`.storage`) is not versioned, so UI integrations and dashboards are covered by backups only.
- Edits made in the HA UI change files on the Pi and must be committed there before the next pull.
