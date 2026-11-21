# ADR-0019: Keep only what is in use, add Marketplace cards on confirmation

- **Status:** Accepted
- **Date:** 2026-11-21
- **Origin:** Recorded at decision time

## Context

A review on 2026-11-21 found 18 of 24 downloaded dashboard cards unused on any dashboard, two downloaded integrations never configured (Pirate Weather, Spotcast), and several integrations and apps without a function: Bring! (obsolete), the disabled Tuya cloud entry, Radio Browser, Google Translate TTS, the built-in Shopping list, and the stopped apps Terminal & SSH, HassOS SSH port 22222 Configurator and Lidarr. Every card resource is loaded by the browser on each dashboard visit, and every download is another thing to update.

## Decision

Remove everything that is not in use. From now on a Marketplace card or integration is only downloaded after the owner confirms it, also when an assistant proposes a dashboard that would need it.

## Alternatives considered

- Leaving unused downloads in place in case they are needed: they cost load time and update noise, and reinstalling takes a minute.

## Consequences

- Six frontend downloads remain: Bubble Card, Mushroom, Power Flow Card Plus, Weather Radar Card, Pi-hole Card, Sidebar Organizer.
- Dashboard work starts from the built-in cards and the six above; anything else is a question to the owner first.
- The same review removed 15 stale registry entities.
