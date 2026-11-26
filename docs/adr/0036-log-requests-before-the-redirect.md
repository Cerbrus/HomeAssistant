# ADR-0036: Log a redirected request as it came in, not the page it lands on

- **Status:** Accepted
- **Date:** 2026-11-26
- **Origin:** Recorded at decision time

## Context

A request for an unknown subdomain or for no known host name is redirected to an error page ([ADR-0029](0029-harden-public-logins.md)). The probe log of [ADR-0031](0031-probe-log-and-security-view.md) only held requests that got a 4xx answer, so it missed the redirected request and recorded the error page that the scanner landed on instead. Over a third of a day's probes were landings on `404.cerbrus.nl/` and `error.cerbrus.nl/404`, which say nothing about what was asked for.

## Decision

The probe log also records every request from an outside address that is redirected because no proxy host matched, with the host name and path as they came in. The two landing requests are left out of the log.

## Alternatives considered

- Only leaving the landings out: removes the noise, but what the scanners asked for stays unseen.
- Reading the proxy's own logs of those requests: the Default Site writes to the container's output, without the host name, and Home Assistant cannot read it.
- Leaving the landings out in the scripts instead of in the log: the log keeps growing with rows that nothing reads.

## Consequences

- This replaces two consequences of ADR-0031: "probe" now means an outside address that got a 4xx answer or a redirect for an unmatched host name, and requests that match no proxy host are logged.
- The Default Site of the proxy has no hook for a log. A hand-written server block in `http.conf` catches what no proxy host and no redirection host claims and gives the same redirect. The Default Site setting in the proxy's interface no longer does anything; to change that redirect, edit the snippet ([apps.md](../apps.md#shared-nginx-snippets)).
- The host name column shows what the scanner sent, which for a request by address is that address.
- A request for exactly `404.cerbrus.nl/` or `error.cerbrus.nl/404` is not counted, also when it was not the end of a redirect.
- Requests over HTTPS for an unknown host name stay unseen: the proxy refuses the handshake before there is a request.
- The counts are higher than before, because a redirect is logged whether or not the scanner follows it. The thresholds of the volume notification were estimated on the old counts ([automations.md](../automations.md)).
