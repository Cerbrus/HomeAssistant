# Open items

Loose ends that are known and not yet handled. Remove an item when it is handled.

## Automations

- **Shutters - Automate open (backup)** is the disabled previous version, with the 10-minute polling. Delete it once the temperature trigger has proven itself.

## Energy

- **Energy price helpers** hold purchase fees from a comparison site and the published 2026 energy tax. Check the four `input_number.energy_price_*` values against an invoice, and whether the all-in gas price matches it ([ADR-0024](adr/0024-energy-cost-energyzero-plus-markup.md)).

## Media

- **Plex integration** is not added yet: it needs a plex.tv sign-in in the browser. Once added, put its now-playing player on the Media view.
- **Disk space sensors** of Radarr and Transmission read 0. Find out why before putting them on the Media view.

## Network

- **Tuya address reservations** wait for the new modem ([ADR-0017](adr/0017-tuya-dynamic-leases-until-new-modem.md)).
