# ADR-0035: Check the certificates that the proxy actually serves

- **Status:** Accepted
- **Date:** 2026-11-26
- **Origin:** Recorded at decision time

## Context

Every proxy host sends HSTS ([ADR-0029](0029-harden-public-logins.md)), so an expired certificate makes its host unreachable in every browser and app. The proxy renews certificates by itself at about 30 days before expiry, and nothing reported a renewal that fails.

## Decision

`scripts/proxy_certificates.py` asks the proxy's API for its enabled hosts once a day, connects to every host name and reads the certificate it is served. `sensor.proxy_certificate_days_left` holds the days left on the soonest one. The phone is notified every morning while that is 14 days or less.

## Alternatives considered

- Home Assistant's Certificate Expiry integration: a core integration, but one entry per certificate that has to be added by hand for every new host.
- Reading the expiry dates from the proxy's API: does not notice a renewed certificate that the proxy failed to load.

## Consequences

- New proxy hosts are covered without any setup, removed ones drop out, and certificates that no host uses are ignored.
- The check uses the same proxy login as the blocking ([ADR-0034](0034-block-password-guessing-at-the-proxy.md)). When it stops working, the "Security - Monitoring broken" automation reports that after 26 hours.
- A host name that cannot be reached at the moment of the check counts as unreadable and triggers the notification the next morning.
