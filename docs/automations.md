# Automations, scripts and helpers

## Automations

All automations are created in the UI and stored in `automations.yaml`.

| Automation | Triggers | Conditions | Action |
| --- | --- | --- | --- |
| HA Boot - Notify Discord | Home Assistant start | | Runs `script.ha_online_notify_discord` |
| Shutters - Automate close | Phone leaves zone Goor; 30 minutes after sunset; midnight | | Sets each shutter to position 10 when it is above 10 |
| Shutters - Automate open | Phone enters zone Home; 30 minutes after sunrise; 08:00; Buienradar temperature rises above 5 °C | Buienradar temperature between 5 and 25 °C, phone is home, before sunset, after 03:00; the temperature trigger only counts from 08:00 | Sets each shutter to position 75 when it is below 40 |
| Shutters - Automate open (backup) | Disabled. Copy of the previous version: every 10 minutes between 08:00 and 10:00 instead of the 08:00 and temperature triggers | As above, without the 08:00 rule | As above |
| Light - Turn on front door light at sunset | Sunset | | Turns the front entrance switch on |
| Light - Turn off front door light at sunrise | Sunrise | | Turns the front entrance switch off |
| Notifications - Dismiss failed login from trusted network | The "Login attempt failed" notification (`http-login`) is created or replaced | The address in the notification starts with the value of `input_text.login_notification_trusted_prefix` | Dismisses that notification |
| Heating - Away mode by presence | Person leaves zone Goor; person enters zone Goor | | Leaving turns the thermostat's away mode on, entering turns it off |
| Notifications - Freezer socket off or unreachable | Freezer socket off for a minute; unreachable for 15 minutes | | Off: critical alert on the phone. Unreachable: time-sensitive notification |
| Notifications - Boiler needs attention | Refill needed; system pressure below 1 bar for 10 minutes; a blocking or locking fault code; a maintenance request | | Critical alert on the phone with the sensor and its value; the maintenance request as a normal notification |
| Notifications - Doorbell not charging or battery low | Doorbell battery below 30 %; doorbell not charging for 24 hours | | Notifies the phone with the battery level |
| Notifications - Address banned | The "Too many login attempts" notification (`ip-ban`) is created or replaced | | Time-sensitive notification on the phone with the banned address |
| Security - Lift ban on trusted network | The "Too many login attempts" notification (`ip-ban`) is created or replaced | The banned address starts with the value of `input_text.login_notification_trusted_prefix` | Runs `shell_command.unban_address` for that address, notifies the phone, dismisses the notification and restarts Home Assistant ([ADR-0032](adr/0032-lift-bans-on-the-home-network.md)) |
| Notifications - Updates pending | 10:00 | It is Saturday and at least one update is waiting | Notifies the phone how many updates wait and which; tapping it opens the updates page |
| Notifications - Waste pickup tomorrow | 19:00 | A Twente Milieu pickup date is tomorrow | Notifies the phone which bins go out |
| Media - Remove fake downloads | Every minute | | Runs `shell_command.arr_guard`; writes a logbook entry when something was removed |
| Media - Protect indexers | 04:30 | | Runs `shell_command.arr_guard_indexers`; writes a logbook entry when an indexer was changed |
| Media - Search missing | Monday 03:00 | | Runs `shell_command.arr_guard_search`, which starts a search for all missing monitored items in Sonarr and Radarr; writes a logbook entry |
| Herinnering energieleverancier 5 januari 2027 | 09:00 | The date is 4 or 5 January 2027 | Notifies the phone to compare energy suppliers again. One-off; delete it afterwards |
| Herinnering NS abonnement opzeggen 16 december 2026 | 09:00 | The date is 16 December 2026 | Notifies the phone to cancel the NS subscription. One-off; delete it afterwards |
| Notifications - Backups stale | The Google Drive Backup app reports stale backups | | Notifies the phone |

Notes:

- Shutter position 10 counts as closed, 75 as open. The "above 10" and "below 40" checks skip a shutter that is already in place.
- The temperature condition keeps the shutters shut on hot days (sun shading) and on cold days (insulation).
- The temperature trigger opens the shutters later in the day once it gets warmer than 5 °C. Before 08:00 it is ignored, so a warm night does not open them; the 08:00 trigger picks that case up.
- The backup automation is kept disabled until the new triggers have proven themselves, see [open items](open-items.md).
- Away mode follows zone Goor, not zone Home: a short trip inside town does not cool the house down, and the heating starts again during the last minutes of the trip home. When the phone stops reporting its location while away, away mode stays on until it reports from Goor again; the switch is on the Heating view.
- Phone notifications go through the `notify.mobile_app_iphone_michiel` action, not the notify entity: only the action accepts the `push` data that makes an alert critical or time-sensitive.
- An unreachable freezer socket is not treated as a power loss. The Tuya devices can lose their address after a DHCP renewal ([ADR-0017](adr/0017-tuya-dynamic-leases-until-new-modem.md)), and the socket keeps its power then.
- The doorbell runs on a battery that the doorbell wire keeps full. The 24 hour "not charging" timer starts again after a Home Assistant restart or a moment of the doorbell being unavailable, so the battery threshold is the alert that always comes.
- Home Assistant bans an address after three failed logins ([ADR-0029](adr/0029-harden-public-logins.md)). The ban notification goes to the phone because a ban can hit an own device; how to lift one is in [architecture.md](architecture.md#hardening).
- The updates notification only reports. Nothing is installed automatically.
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
| `sensor.proxy_probes_today` | `_yaml/command_line.yaml` | Requests from outside addresses that the proxy answered with a 4xx status today, from `scripts/probe_stats.py` every five minutes. Attributes: the last 24 hours in total, per host name, per address, per path and per country, the last 15 bursts of requests per address, each address with its country and city, and the banned addresses ([ADR-0031](adr/0031-probe-log-and-security-view.md)) |
| `input_number.zero_value` | `_yaml/input_number.yaml` | Constant zero for dashboard cards |
| `input_text.login_notification_trusted_prefix` | UI helper | Start of the addresses whose failed login notification is dismissed and whose ban is lifted automatically |
| `input_number.energy_price_electricity_purchase_fee`, `input_number.energy_price_gas_purchase_fee` | UI helpers | The supplier's purchase fee per kWh and per m³, including VAT |
| `input_number.energy_price_electricity_energy_tax`, `input_number.energy_price_gas_energy_tax` | UI helpers | Energy tax per kWh and per m³, including VAT |
| `sensor.energy_price_electricity_all_in`, `sensor.energy_price_gas_all_in` | UI template helpers | EnergyZero market price plus purchase fee and energy tax; the Energy dashboard's consumption prices |
| `sensor.energy_price_electricity_return` | UI template helper | EnergyZero market price without additions; the Energy dashboard's return price |

## Blueprints

Only the stock blueprints that ship with Home Assistant. None are in use and the folder is not tracked.
