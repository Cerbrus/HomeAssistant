# ADR-0011: Copy backups off-site to Google Drive

- **Status:** Accepted
- **Date:** 2026-04-14
- **Origin:** Backfilled, rationale confirmed

## Context

Everything runs on one Pi ([ADR-0001](0001-single-pi-hosts-everything.md)) and most of the setup is UI-managed state that git does not hold ([ADR-0004](0004-config-in-git-git-pull-deploy.md)). A backup that stays on the Pi's own disk is lost together with the Pi.

## Decision

Let Home Assistant create automatic backups and use the Home Assistant Google Drive Backup app to upload them to Google Drive and manage retention.

## Alternatives considered

- Home Assistant Cloud backup storage: needs the paid subscription that is not otherwise used.
- A network share: no NAS in the home.

## Consequences

- A dead disk or Pi can be restored from Google Drive.
- The app exposes a "Backups Stale" sensor that can be used for alerting.
- Restoring needs the backup encryption key, which must be kept outside the Pi.
