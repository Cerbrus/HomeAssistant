# Integrations

## Devices and services

| Integration | Source | Configured in | Used for |
| --- | --- | --- | --- |
| Tuya Local | Marketplace | UI | Shutters, front door light, office lights, bathroom fan, freezer socket ([ADR-0003](adr/0003-tuya-local-over-tuya-cloud.md)) |
| ICS-2000 (KlikAanKlikUit) | Marketplace | `_yaml/light.yaml` | Bedroom light |
| Bosch thermostat (EasyControl CT200, cloud API) | Marketplace | UI | Heating zone, boiler, hot water tank ([ADR-0021](adr/0021-cloud-integrations-bosch-solis.md)) |
| SolisCloud | Marketplace | UI | Solar inverter ([ADR-0021](adr/0021-cloud-integrations-bosch-solis.md)) |
| DSMR Reader | Core, over MQTT | UI | Smart meter: electricity and gas |
| MQTT | Core | UI | Mosquitto broker |
| Forecast.Solar | Core | UI | Solar production forecast |
| Google Cast, Android TV Remote | Core | UI | Living room TV (Chromecast) |
| Spotify | Core | UI | Music playback |
| OctoPrint | Core | UI | 3D printer, unavailable while the printer is off |
| IPP | Core | UI | Printer ink levels |
| Pi-hole | Core | UI | DNS statistics and switch |
| Raspberry Pi GPIO | Marketplace | `_yaml/switch.yaml` | Cooling fan switch |
| Plex Media Server | Core | UI | Number of active streams; a media player per client while it plays |
| Radarr, Sonarr | Core | UI | Upcoming movies and episodes as calendars, health, queue |
| Transmission | Core | UI | Download and upload speed, torrent counts, start/stop and turtle mode switches |
| Mobile App, iOS | Core | UI, `_yaml/ios.yaml` | Phone presence, notifications, watch action |

## Information sources

| Integration | Used for |
| --- | --- |
| Buienradar | Weather, temperature condition for the shutters |
| Met.no | Default weather entity |
| Twente Milieu | Waste pickup dates |
| Google Calendar | Calendars |
| Sun | Sunrise and sunset triggers |
| EnergyZero | Hourly electricity and daily gas market prices for the energy cost ([ADR-0024](adr/0024-energy-cost-energyzero-plus-markup.md)) |

## System

| Integration | Used for |
| --- | --- |
| HA-MCP (File & YAML Tools, Server) | Lets Claude Code manage the instance ([ADR-0014](adr/0014-ha-mcp-in-process-lan-only.md)) |
| Marketplace | Community integrations and cards ([ADR-0015](adr/0015-marketplace-migration.md)) |
| DuckDNS | Keeps the DuckDNS name on the current public address |
| Discord | Boot notification |
| GitHub | Sensors for this repository |
| System Monitor, Version, Time & Date | Values shown in the boot notification and dashboards |
| Backup, Supervisor, Raspberry Pi, Raspberry Pi Power Supply Checker, Bluetooth, go2rtc, Analytics | Defaults from onboarding |

## Energy dashboard

| Source | Entities |
| --- | --- |
| Grid, tariff 1 and 2 | DSMR Reader delivered and returned readings |
| Solar | Solis inverter total energy, with the Forecast.Solar forecast |
| Gas | DSMR Reader gas reading |

Cost is tracked with price entities ([ADR-0024](adr/0024-energy-cost-energyzero-plus-markup.md)):

| Source | Price entity |
| --- | --- |
| Grid consumption, both tariffs | `sensor.energy_price_electricity_all_in` |
| Grid return, both tariffs | `sensor.energy_price_electricity_return` |
| Gas | `sensor.energy_price_gas_all_in` |

No individual device consumption is configured.

## Marketplace frontend downloads

Bubble Card, Mushroom, Power Flow Card Plus, Weather Radar Card, Pi-hole Card and Sidebar Organizer. Only what a dashboard uses is kept; a new card is downloaded after the owner confirms it ([ADR-0019](adr/0019-lean-marketplace.md)).

## Removed on 2026-11-21

Bring!, Tuya (cloud), Shopping list, Radio Browser, Google Translate TTS, and the unconfigured downloads Pirate Weather and Spotcast.
