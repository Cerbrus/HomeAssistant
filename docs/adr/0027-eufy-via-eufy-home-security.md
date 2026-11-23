# ADR-0027: Integrate the eufy doorbell with Anker eufy Home Security

- **Status:** Accepted
- **Date:** 2026-11-23
- **Origin:** Recorded at decision time

## Context

The eufy video doorbell and its HomeBase 2 have no official Home Assistant integration. The long-standing community route, the Eufy Security integration with the `eufy-security-ws` app, was archived in September 2026 and gets no more updates.

## Decision

Use the Marketplace integration Anker eufy Home Security, signed in with a separate eufy account that the devices are shared with, and with its cloud push for detections switched on.

## Alternatives considered

- Eufy Security with the `eufy-security-ws` app: archived, no more updates.
- Its successor eufy-sdk: needs an extra app on the Pi, has more open issues, and its integration is not in the Marketplace.
- Leaving the doorbell out of Home Assistant: no ring or detection events for automations.

## Consequences

- The integration is in beta: a minor release may change entities or options.
- Live view and the alarm panel work over the LAN. Sign-in and the device list go through eufy's cloud, and so do ring and detection events, because a HomeBase 2 does not send those over the LAN.
- The doorbell model is not in the integration's list of tested devices.
- The separate account keeps Home Assistant's session apart from the phone's: a second sign-in with the same account ends the first.
- The eufy app stays needed for what the integration does not cover.
