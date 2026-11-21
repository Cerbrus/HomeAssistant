# ADR-0008: Read the smart meter with the DSMR Reader app over MQTT

- **Status:** Accepted
- **Date:** 2026-04-04
- **Origin:** Backfilled, rationale confirmed

## Context

The smart meter's P1 port provides electricity and gas readings. Home Assistant has a built-in DSMR integration that reads the port directly. As the owner recalls it, that integration did not work here, or was less reliable and less complete than DSMR Reader.

## Decision

Run the DSMR Reader app, which reads the P1 port, stores the readings in its own database and publishes them to the Mosquitto broker. Home Assistant consumes them through the DSMR Reader integration and feeds the Energy dashboard.

## Alternatives considered

- The built-in DSMR integration: fewer moving parts, but it did not work reliably at the time and offers less.

## Consequences

- DSMR Reader offers its own detailed statistics and keeps history independent of Home Assistant's recorder.
- Three extra apps to run: DSMR Reader, the TimescaleDB database it stores in, and the MQTT broker.
