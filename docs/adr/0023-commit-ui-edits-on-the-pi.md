# ADR-0023: Commit UI edits on the Pi and push them with a deploy key

- **Status:** Accepted
- **Date:** 2026-11-21
- **Origin:** Recorded at decision time

## Context

Edits made in the HA UI change `automations.yaml` and `scripts.yaml` on the Pi. [ADR-0004](0004-config-in-git-git-pull-deploy.md) says those are committed there, but the Pi could not push: its clone had no commit identity and no way to authenticate to GitHub. A UI edit therefore had to be copied to the PC and committed from there. The Git pull app then stopped on the next pull, because the file on the Pi still counted as a local change.

## Decision

Give the Pi's clone a commit identity and a deploy key with write access to this repository, so UI edits are committed and pushed where they are made. Fetching stays on HTTPS, which is what the Git pull app checks; only the push URL uses SSH with the key. The settings live in the clone's own git config and the key lives outside the repository.

## Alternatives considered

- Pull-only Pi, every commit from the PC: each UI edit leaves a local change on the Pi that has to be cleaned up by hand before the Git pull app works again.
- A personal access token on the Pi: reaches more than this one repository.

## Consequences

- After a UI edit, commit and push on the Pi before pushing anything else to GitHub. An uncommitted edit to a file that a pull also changes still stops the Git pull app; it has to be started again afterwards.
- Git on the Pi runs as root (`sudo git`), because the config directory belongs to root.
- The clone's git config and the key are not in the repository and not in a Home Assistant backup of `/config` alone. A rebuilt Pi needs a new deploy key.
- The deploy key is managed in the repository's settings on GitHub, under Deploy keys.
