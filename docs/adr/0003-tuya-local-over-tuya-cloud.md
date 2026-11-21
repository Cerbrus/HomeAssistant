# ADR-0003: Control Tuya devices with Tuya Local instead of the Tuya cloud integration

- **Status:** Accepted
- **Date:** 2026-04-02
- **Origin:** Backfilled, rationale confirmed

## Context

The shutters, the front door light, the office lights, the bathroom fan and the freezer socket are Tuya devices. The core Tuya integration was added on 2026-03-30 and reports all of them as unsupported models ("Curtain switch (unsupported)", "WiFi Breaker T (unsupported)"). It was disabled the same day: the cloud route was not a suitable option.

## Decision

Use the Tuya Local integration from the Marketplace, which talks to each device directly on the LAN. Do not use the cloud integration.

## Alternatives considered

- The core Tuya integration: depends on the Tuya cloud and did not support these models.

## Consequences

- Devices keep working without internet and respond without a cloud round trip.
- Each device is addressed by its LAN address, so an address change takes the device offline in Home Assistant. See [ADR-0017](0017-tuya-dynamic-leases-until-new-modem.md).
- The disabled cloud entry and its device copies were removed on 2026-11-21.
