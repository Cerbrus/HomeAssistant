# Configuration

## Repository layout

| Path | Contents |
| --- | --- |
| `configuration.yaml` | Entry point: `default_config`, frontend module for the sidebar, one `!include` per domain |
| `_yaml/` | One file per YAML-configured domain ([ADR-0005](adr/0005-yaml-split-per-domain.md)) |
| `automations.yaml`, `scripts.yaml` | Written by the HA UI editors, tracked in git |
| `custom_templates/` | Jinja macros shared between templates |
| `www/icons/` | Dashboard icons (media stack logos, mascot) |
| `www/flags/` | Country flags for the Security view, named by lower-case country code |
| `www/sidebar-organizer.yaml` | Sidebar grouping, see [dashboards.md](dashboards.md) |
| `dashboards/` | Redacted clone of the UI-managed dashboards, see [dashboards.md](dashboards.md) |
| `tools/` | `export_dashboards.py`, which refreshes that clone |
| `scripts/` | Scripts that Home Assistant runs through `shell_command` or a `command_line` sensor, see [apps.md](apps.md#fake-downloads) and [apps.md](apps.md#shared-nginx-snippets) |
| `docs/` | This documentation and the ADRs |

## YAML domains

| File | Purpose |
| --- | --- |
| `_yaml/climate.yaml` | Generic thermostat that drives the Pi's cooling fan |
| `_yaml/command_line.yaml` | CPU temperature sensor, external IP address sensor, and the proxy sensors: probes, probe bursts, blocked addresses, certificate days left |
| `_yaml/input_number.yaml` | `input_number.zero_value`, a constant for dashboard cards |
| `_yaml/light.yaml` | KlikAanKlikUit lights through the ICS-2000 hub |
| `_yaml/panel_custom.yaml` | Sidebar shortcuts into settings pages |
| `_yaml/recorder.yaml` | Entities left out of the database: `sensor.proxy_probe_bursts` |
| `_yaml/scenes.yaml` | Empty |
| `_yaml/shell_command.yaml` | The three modes of `scripts/arr_guard.py`, and `scripts/unban_address.py`, which removes one address from `ip_bans.yaml`, and `proxy_unblock`, which lifts a block at the proxy |
| `_yaml/switch.yaml` | GPIO switch for the Pi's cooling fan |
| `_yaml/templates.yaml` | Waste pickup date sensors |

## What is not in the repository

Ignored on purpose: `secrets.yaml` (a copy of its values is kept in the owner's password manager), the stock `blueprints/` folder, `.storage/` (UI-configured integrations, dashboards, registries), the recorder database, everything the Marketplace downloads (`custom_components/`, `themes/`, `www/community/`), backups and logs.

Consequence: integrations set up through the UI, areas, helpers created in the UI and energy preferences exist only on the Pi and in backups. These docs are the only description of them outside the instance.

## Conventions

- UI or YAML is chosen per case; the earlier UI-first rule is deprecated ([ADR-0007](adr/0007-ui-config-over-yaml.md)).
- YAML goes in its own `_yaml/<domain>.yaml` and gets a `unique_id` where the platform supports one.
- Secrets go through `!secret`.
- Community integrations and cards come from the Marketplace ([ADR-0015](adr/0015-marketplace-migration.md)).
- Tuya devices are controlled locally ([ADR-0003](adr/0003-tuya-local-over-tuya-cloud.md)).
