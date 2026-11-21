# ADR-0005: Split YAML configuration into one file per domain under `_yaml/`

- **Status:** Accepted
- **Date:** 2026-04-03
- **Origin:** Backfilled, rationale confirmed

## Context

A single `configuration.yaml` grows into a long file where unrelated domains sit together.

## Decision

`configuration.yaml` holds only `default_config`, the frontend settings and one `!include` line per domain. Each domain's content lives in `_yaml/<domain>.yaml`. `automations.yaml` and `scripts.yaml` stay at the root because the UI editors write there.

## Alternatives considered

- Packages (`homeassistant: packages:`), grouping by feature instead of domain: more flexible, more structure than this amount of YAML needs.

## Consequences

- Each file is short and has one purpose; diffs are easy to read.
- A new YAML domain needs both a file and an include line.
- The underscore keeps the folder at the top of the directory listing.
