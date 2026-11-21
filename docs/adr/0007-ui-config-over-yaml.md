# ADR-0007: Configure integrations in the UI when a config flow exists

- **Status:** Deprecated on 2026-11-21. The UI preference no longer matters now that an assistant writes the YAML; there is no replacement rule, UI or YAML is chosen per case.
- **Date:** 2026-04-04
- **Origin:** Backfilled, rationale confirmed

## Context

The owner found the UI more convenient than writing YAML by hand. Home Assistant also moves integrations from YAML to UI config flows. The Discord notifier started as a YAML platform and was replaced by the UI integration on 2026-04-04; the `http` proxy settings left `configuration.yaml` on 2026-11-20.

## Decision

Set up an integration through the UI whenever it offers a config flow. YAML is only for integrations without one (command line sensors, generic thermostat, GPIO, ICS-2000, custom panels, iOS actions) and for templates that need macros.

## Alternatives considered

- YAML for everything that still accepts it: versioned in git, but deprecated piece by piece and it needs restarts.

## Consequences

- Configuration follows the direction Home Assistant itself takes, with fewer breaking changes.
- UI-configured integrations are not in git; the docs and backups are their record.
- Tokens for UI integrations stay out of `secrets.yaml`.
