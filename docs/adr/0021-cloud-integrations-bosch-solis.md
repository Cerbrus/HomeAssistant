# ADR-0021: Use cloud integrations for the Bosch thermostat and the Solis inverter

- **Status:** Accepted
- **Date:** 2026-11-20
- **Origin:** Backfilled, rationale confirmed

## Context

The setup prefers local control ([ADR-0003](0003-tuya-local-over-tuya-cloud.md)). The Bosch EasyControl CT200 thermostat and the Solis solar inverter offer no usable local interface: both only talk to their vendor's cloud.

## Decision

Integrate both through their cloud APIs with Marketplace integrations: the Bosch thermostat integration (POINTT API) and the SolisCloud portal integration.

## Alternatives considered

- Local control: not available for these devices.
- Leaving them out of Home Assistant: no heating control, no solar production in the Energy dashboard.

## Consequences

- Heating and solar data depend on the internet connection and on the vendors' cloud services.
- Readings arrive with the delay of the cloud polling interval.
- Both integrations are community-maintained and can break when a vendor changes its API.
