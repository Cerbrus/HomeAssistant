# ADR-0025: Remove fake downloads with an own script instead of Cleanuparr

- **Status:** Accepted
- **Date:** 2026-11-22
- **Origin:** Recorded at decision time

## Context

Public indexers serve torrents whose content is a Windows executable named after an episode or movie. Sonarr and Radarr refuse to import them, so they stayed in the queue, held disk space and kept the episode from being searched again. The **Fail Downloads** option on an indexer solves that, but only after the fake has been downloaded completely, and it has no default: an indexer added later starts without it. Transmission cannot refuse files by extension.

## Decision

A script in this repository, `scripts/arr_guard.py`, run by Home Assistant. Every minute it reads the file lists from Transmission and removes a torrent that contains an executable through the Sonarr and Radarr queue, with blocklisting, so a replacement is searched. Once a day it sets Fail Downloads on every indexer that lacks it.

## Alternatives considered

- Cleanuparr: does the same and more (stalled downloads, seeding rules), but is a container of its own with its own configuration and updates, for one job. There is no Home Assistant app for it, so it would have to run on the second Pi.
- Fail Downloads alone: every fake is still downloaded in full first, and the setting is forgotten on a new indexer.
- Switching to a download client that excludes files by extension: replaces a working client for one feature.

## Consequences

- The script reads the connection details of the Sonarr, Radarr and Transmission integrations from Home Assistant's own storage. No secret is duplicated, but the three integrations must stay configured, and a change in that storage format breaks the script.
- Only torrents in the Sonarr or Radarr queue are removed. A torrent added by hand is left alone.
- A failure of the script shows as an error of `shell_command.arr_guard` in the Home Assistant log, once a minute while it lasts.
- A new `shell_command` entry needs a restart of Home Assistant, not a reload.
