# ADR-0020: Keep a redacted clone of the dashboards in the repository

- **Status:** Accepted
- **Date:** 2026-11-21
- **Origin:** Recorded at decision time

## Context

Dashboards are edited in the UI and stored in `.storage`, which is not in git ([ADR-0004](0004-config-in-git-git-pull-deploy.md)). Their content had no history and no copy outside the Pi and its backups. The repository is public, and the Home dashboard holds the home's coordinates and calendar entity ids that contain personal names.

## Decision

`tools/export_dashboards.py` copies the dashboard storage files from the Pi into `dashboards/*.yaml`. It replaces coordinates and calendar entity ids with placeholders and aborts when an address, e-mail address or secret-looking value is left. The export is run after every dashboard change.

## Alternatives considered

- Making the repository private and storing an exact copy: restorable one to one, but the repository stays public for now.
- YAML-mode dashboards in git: loses the UI editor.
- No clone, backups only: no history and no way to review a dashboard change.

## Consequences

- Dashboard changes show up as readable diffs.
- The clone is a reference, not a backup: restoring from it means filling the placeholders back in. Backups remain the way to restore.
- The export needs SSH access to the Pi; the host is passed as an argument and is not stored in the repository.
- The clone is only as current as the last export.
