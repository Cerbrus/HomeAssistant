# ADR-0024: Price energy with EnergyZero market prices plus an own markup

- **Status:** Accepted
- **Date:** 2026-11-21
- **Origin:** Recorded at decision time

## Context

The Energy dashboard showed kWh and m³ without cost. The energy contract is dynamic: the price follows the day-ahead market per hour, with a purchase fee and energy tax on top. The supplier has no Home Assistant integration, in core or in the Marketplace. Every dynamic supplier bills the same market price; they differ only in the fee.

## Decision

Take the market price from the core EnergyZero integration and add the supplier's purchase fee and the energy tax in template helpers. The fee and tax are number helpers, entered including VAT. Returned electricity is valued at the bare market price.

## Alternatives considered

- EnerPrice (Marketplace, custom repository): has a ready profile for the supplier, but it is a new community integration with a small user base.
- ENTSO-e (Marketplace): the same market price, needs an API key and has no gas price.
- Static prices in the Energy dashboard: wrong for an hourly contract.
- Valuing return at the all-in price: right for the netted part only. More is returned than used over a year, so the surplus earns about the market price; the bare market price is the simpler and more cautious figure.

## Consequences

- No Marketplace download and no account.
- The purchase fees and the energy tax change about once a year and are then updated by hand in the helpers. The first values came from a comparison site and the published 2026 tax rates, to be checked against an invoice.
- Cost is tracked from 2026-11-21 on; there is no backfill.
- The cost of the netted part of the return is slightly pessimistic.
- Fixed monthly charges and the tax credit are not in the figures.
