# ADR-0031: Show probing traffic with an own log and script instead of an analyser app

- **Status:** Accepted
- **Date:** 2026-11-26
- **Origin:** Recorded at decision time

## Context

Automated scanners sweep the public host names every day. The proxy's access logs record it, but they sit inside the proxy app, which shares no folder with Home Assistant, and they disappear when the app is reinstalled. There was no place to see who knocks, where and how often.

## Decision

The proxy writes a second, filtered access log: requests from outside addresses that got a 4xx answer. It serves that file to the LAN only. A script that Home Assistant runs every five minutes condenses it into one sensor, and a Security view on the Home dashboard shows that sensor with built-in cards.

## Alternatives considered

- A log analyser app (GoAccess and the like): richer reports, but another app to run ([ADR-0019](0019-lean-marketplace.md)) and it cannot reach the proxy's logs either.
- CrowdSec: shows and blocks, but it is the ban tooling that [ADR-0029](0029-harden-public-logins.md) decided against, and the proxy app has no hook for it.
- Reading the full access logs: includes all regular traffic, which the view would then have to separate from the probes.

## Consequences

- The view informs; it blocks nothing.
- "Probe" means: outside address and 4xx answer. An own device outside the home that gets a 401 or 404 is counted too, and a scanner that only gets redirects or a 200 is not.
- Requests that match no proxy host (by address, unknown subdomains) are not logged.
- History lives in Home Assistant's statistics for the daily count. The details (addresses, paths) cover the last 24 hours only and are in the sensor's attributes, not in this repository or in the dashboard clone.
- The log is lost when the proxy app is reinstalled, and the two Nginx snippets have to be in place for it to be written ([apps.md](../apps.md#shared-nginx-snippets)).
