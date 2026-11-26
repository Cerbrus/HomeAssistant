# Open items

Loose ends that are known and not yet handled. Remove an item when it is handled.

## Automations

- **Shutters - Automate open (backup)** is the disabled previous version, with the 10-minute polling. Delete it once the temperature trigger has proven itself.

## Doorbell

- **Ring and detection events** of the eufy doorbell have not been seen in Home Assistant yet. Check `event.doorbell_doorbell` and `event.doorbell_detection` after a ring and a detection ([ADR-0027](adr/0027-eufy-via-eufy-home-security.md)).
- **`binary_sensor.doorbell_charging`** may go off while the battery is full. If it does, drop the 24 hour trigger from "Notifications - Doorbell not charging or battery low".

## Energy

- **Energy price helpers** hold purchase fees from a comparison site and the published 2026 energy tax. Check the four `input_number.energy_price_*` values against an invoice, and whether the all-in gas price matches it ([ADR-0024](adr/0024-energy-cost-energyzero-plus-markup.md)).

## Media

- **Disk space sensors** of Radarr and Transmission read 0. Find out why before putting them on the Media view.
- **SuggestArr** has no backup of its configuration yet ([ADR-0026](adr/0026-suggestarr-on-the-server-pi.md)).

## Network

- **Tuya address reservations** wait for the new modem ([ADR-0017](adr/0017-tuya-dynamic-leases-until-new-modem.md)).