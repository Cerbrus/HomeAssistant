# ADR-0009: Drive the Pi's cooling fan with a generic thermostat

- **Status:** Accepted
- **Date:** 2026-04-05
- **Origin:** Backfilled, rationale confirmed

## Context

The Pi has a fan on a GPIO pin. The first version was an automation "CPU Fan" that ran every 30 seconds and switched the fan on above 35 °C and off below 25 °C. It was removed as deprecated on 2026-04-05.

## Decision

Use a `generic_thermostat` climate entity in cooling mode on the CPU temperature sensor, with a target of 30 °C, half a degree tolerance and a minimum cycle of five minutes.

## Alternatives considered

- The polling automation: 2880 runs a day filling the logbook and traces, and thresholds only editable in the automation.

## Consequences

- The target temperature is adjustable from a dashboard like any thermostat.
- The minimum cycle prevents rapid switching.
- The old automation's stale registry entry was removed on 2026-11-21.
