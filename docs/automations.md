# Automations, scripts and helpers

## Automations

All automations are created in the UI and stored in `automations.yaml`.

| Automation | Triggers | Conditions | Action |
| --- | --- | --- | --- |
| HA Boot - Notify Discord | Home Assistant start | | Runs `script.ha_online_notify_discord` |
| Toggle Bedroom Light | iOS / watch action "Bedroom Light" | | Toggles `light.lamp` |
| Shutters - Automate close | Phone leaves zone Goor; 30 minutes after sunset; midnight | | Sets each shutter to position 10 when it is above 10 |
| Shutters - Automate open | Phone enters zone Home; 30 minutes after sunrise; 08:00; Buienradar temperature rises above 5 °C | Buienradar temperature between 5 and 25 °C, phone is home, before sunset, after 03:00; the temperature trigger only counts from 08:00 | Sets each shutter to position 75 when it is below 40 |
| Shutters - Automate open (backup) | Disabled. Copy of the previous version: every 10 minutes between 08:00 and 10:00 instead of the 08:00 and temperature triggers | As above, without the 08:00 rule | As above |
| Light - Turn on front door light at sunset | Sunset | | Turns the front entrance switch on |
| Light - Turn off front door light at sunrise | Sunrise | | Turns the front entrance switch off |
| Notifications - Dismiss failed login from trusted network | The "Login attempt failed" notification (`http-login`) is created or replaced | The address in the notification starts with the value of `input_text.login_notification_trusted_prefix` | Dismisses that notification |
| Notifications - Freezer socket off or unreachable | Freezer socket off for a minute; unreachable for 15 minutes | | Off: critical alert on the phone. Unreachable: time-sensitive notification |
| Notifications - Boiler needs attention | Refill needed; system pressure below 1 bar for 10 minutes; a blocking or locking fault code; a maintenance request | | Critical alert on the phone with the sensor and its value; the maintenance request as a normal notification |
| Notifications - Waste pickup tomorrow | 19:00 | A Twente Milieu pickup date is tomorrow | Notifies the phone which bins go out |
| Notifications - Backups stale | The Google Drive Backup app reports stale backups | | Notifies the phone |

Notes:

- Shutter position 10 counts as closed, 75 as open. The "above 10" and "below 40" checks skip a shutter that is already in place.
- The temperature condition keeps the shutters shut on hot days (sun shading) and on cold days (insulation).
- The temperature trigger opens the shutters later in the day once it gets warmer than 5 °C. Before 08:00 it is ignored, so a warm night does not open them; the 08:00 trigger picks that case up.
- The backup automation is kept disabled until the new triggers have proven themselves, see [open items](open-items.md).
- Phone notifications go through the `notify.mobile_app_iphone_michiel` action, not the notify entity: only the action accepts the `push` data that makes an alert critical or time-sensitive.
- An unreachable freezer socket is not treated as a power loss. The Tuya devices can lose their address after a DHCP renewal ([ADR-0017](adr/0017-tuya-dynamic-leases-until-new-modem.md)), and the socket keeps its power then.
- Home Assistant has no setting to leave addresses out of the "Login attempt failed" notification, so the dismiss automation removes it afterwards. The warning from `homeassistant.components.http.ban` stays in the log. The trusted prefix is IPv4 only and lives in a UI helper, which keeps the address out of this repository.

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
| `input_text.login_notification_trusted_prefix` | UI helper | Start of the addresses whose failed login notification is dismissed |
| `input_number.energy_price_electricity_purchase_fee`, `input_number.energy_price_gas_purchase_fee` | UI helpers | The supplier's purchase fee per kWh and per m³, including VAT |
| `input_number.energy_price_electricity_energy_tax`, `input_number.energy_price_gas_energy_tax` | UI helpers | Energy tax per kWh and per m³, including VAT |
| `sensor.energy_price_electricity_all_in`, `sensor.energy_price_gas_all_in` | UI template helpers | EnergyZero market price plus purchase fee and energy tax; the Energy dashboard's consumption prices |
| `sensor.energy_price_electricity_return` | UI template helper | EnergyZero market price without additions; the Energy dashboard's return price |

## iOS actions

`_yaml/ios.yaml` defines the action "Bedroom Light", shown on the Apple Watch. It fires the `ios.action_fired` event that the Toggle Bedroom Light automation listens to.

## Blueprints

Only the stock blueprints that ship with Home Assistant. None are in use and the folder is not tracked.
