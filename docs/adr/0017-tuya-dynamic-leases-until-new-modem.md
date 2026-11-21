# ADR-0017: Leave the Tuya devices on dynamic addresses until the new modem arrives

- **Status:** Accepted, temporary
- **Date:** 2026-11-21
- **Origin:** Recorded at decision time

## Context

Tuya Local addresses each device by its LAN address ([ADR-0003](0003-tuya-local-over-tuya-cloud.md)). Only the freezer socket has a fixed address in the modem. When another device gets a new address, it goes offline in Home Assistant while it keeps working in the Tuya app. The current modem refuses to reserve an address that a connected device holds, so a reservation can only be made while the device is powered off. A new modem is expected around late December 2026.

## Decision

Do not reserve addresses for the five remaining devices on the current modem. Fix a drifted device by hand, and set up all reservations on the new modem.

## Alternatives considered

- Powering each device down to reserve its address now: work that is thrown away within weeks.

## Consequences

- Until the new modem is in place a device can drop out after an address change. The fix: find its new address, set it as host in the device's Tuya Local options, reload the entry.
- When the new modem arrives: reserve an address for every Tuya device, then mark this ADR as superseded.
