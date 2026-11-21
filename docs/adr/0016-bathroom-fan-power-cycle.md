# ADR-0016: Control the bathroom fan by power-cycling it

- **Status:** Accepted
- **Date:** 2026-11-20
- **Origin:** Recorded at decision time (the script itself is older)

## Context

The bathroom fan is wired to the bathroom light. It starts with the light and runs on a 30 minute hardware timer after the light goes off. The Tuya switch in front of the fan only interrupts its power supply.

## Decision

`script.toggle_bathroom_fan` switches the power off, waits one second and switches it back on. This resets the fan's hardware timer. Dashboards call the script instead of toggling the switch.

## Alternatives considered

- A plain on/off toggle of the switch: a switch left off would keep the fan from running with the light.

## Consequences

- The fan keeps its normal behaviour with the light, and its timer can be reset from Home Assistant.
- The script looks like a broken toggle. It is not a bug and must not be "fixed".
