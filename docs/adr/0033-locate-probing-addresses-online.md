# ADR-0033: Locate probing addresses with an online lookup

- **Status:** Accepted
- **Date:** 2026-11-26
- **Origin:** Recorded at decision time

## Context

The Security view lists the addresses that probe the public host names ([ADR-0031](0031-probe-log-and-security-view.md)). An address alone says little; the country and city it is registered in make the list readable.

## Decision

`scripts/probe_stats.py` asks the free batch service of ip-api.com for the country and city of the addresses it shows, and keeps the answers for 30 days in a cache file in the configuration folder. The view shows the country, its flag and the city next to each address. The flags are image files in `www/flags/`.

## Alternatives considered

- A local address database (DB-IP Lite): nothing leaves the house, but the city-level file is over 100 MB per month and Home Assistant has no reader for its format.
- Flags as emoji: no files to keep, but Windows browsers show two letters instead of a flag.

## Consequences

- The addresses of probing visitors are sent to ip-api.com, over plain HTTP, and that service sees the home's public address asking. Only addresses that appear on the view and are not in the cache are looked up.
- When the service does not answer, new addresses show without a location; everything else keeps working.
- The location is where the address is registered, which for scanners is usually a data centre and says little about who is behind it.
- The cache file `.probe_geo_cache.json` is not in git.
- The flag images come from flagcdn.com (public domain), 40 pixels wide, named by lower-case country code.
