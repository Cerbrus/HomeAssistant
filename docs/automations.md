# Automations, scripts and helpers

## Automations

All automations are created in the UI and stored in `automations.yaml`.

| Automation | Triggers | Conditions | Action |
| --- | --- | --- | --- |
| HA Boot - Notify Discord | Home Assistant start | | Runs `script.ha_online_notify_discord` |
| Toggle Bedroom Light | iOS / watch action "Bedroom Light" | | Toggles `light.lamp` |
| Shutters - Automate close | Phone leaves zone Goor; 30 minutes after sunset; midnight | | Sets each shutter to position 10 when it is above 10 |
| Shutters - Automate open | Phone enters zone Home; 30 minutes after sunrise; every 10 minutes between 08:00 and 10:00 | Buienradar temperature between 5 and 25 °C, phone is home, before sunset, after 03:00 | Sets each shutter to position 75 when it is below 40 |
| Light - Turn on front door light at sunset | Sunset | | Turns the front entrance switch on |
| Light - Turn off front door light at sunrise | Sunrise | | Turns the front entrance switch off |

Notes:

- Shutter position 10 counts as closed, 75 as open. The "above 10" and "below 40" checks skip a shutter that is already in place.
- The temperature condition keeps the shutters shut on hot days (sun shading) and on cold days (insulation).
- The repeated morning triggers retry the opening until the conditions hold. Candidate for a cleaner design, see [open items](open-items.md).

## Scripts

| Script | Purpose |
| --- | --- |
| `script.toggle_bathroom_fan` | Switches the fan's power off, waits one second, switches it on. Resets the fan's hardware timer; this is intended, see [devices.md](devices.md#bathroom-fan) |
| `script.ha_online_notify_discord` | Posts an embed to Discord with HA version, update status, addresses and disk usage |

## Climate

`climate.rpi_cooling_fan_controller` is a generic thermostat in cooling mode: target 30 °C on `sensor.cpu_temperature`, half a degree tolerance, minimum cycle of five minutes, switching `switch.rpi_cooling_fan` ([ADR-0009](adr/0009-pi-fan-generic-thermostat.md)). It has no dashboard control on purpose: the target is right as configured.

## Helpers and template sensors

| Entity | Defined in | Purpose |
| --- | --- | --- |
| `sensor.non_recyclable_waste_pickup_date`, `sensor.organic_waste_pickup_date`, `sensor.packages_waste_pickup_date` | `_yaml/templates.yaml` | "Nd (date)" text until the next pickup, using the `pickup_state` macro in `custom_templates/waste.jinja` |
| `sensor.non_recyclable_waste_pickup_progress`, `sensor.organic_waste_pickup_progress`, `sensor.packages_waste_pickup_progress` | UI template helpers | Percentage of the pickup cycle elapsed (cycles of 4, 2 and 3 weeks) |
| `sensor.cpu_temperature` | `_yaml/command_line.yaml` | CPU temperature of the Pi |
| `sensor.external_ip_address` | `_yaml/command_line.yaml` | Public address, refreshed every five minutes |
| `input_number.zero_value` | `_yaml/input_number.yaml` | Constant zero for dashboard cards |

## iOS actions

`_yaml/ios.yaml` defines the action "Bedroom Light", shown on the Apple Watch. It fires the `ios.action_fired` event that the Toggle Bedroom Light automation listens to.

## Blueprints

Only the stock blueprints that ship with Home Assistant. None are in use and the folder is not tracked.
