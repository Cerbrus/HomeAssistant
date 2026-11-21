# Home Assistant documentation

Documentation of the Home Assistant setup this repository configures. Snapshot taken on 2026-11-21 from the repository and the running instance.

| Document | Contents |
| --- | --- |
| [architecture.md](architecture.md) | Host, network path, deployment flow |
| [configuration.md](configuration.md) | Repository layout, YAML includes, what lives in the UI |
| [apps.md](apps.md) | Installed apps (add-ons) |
| [integrations.md](integrations.md) | Integrations, Marketplace downloads, energy setup |
| [devices.md](devices.md) | Floors, areas, devices, people and zones |
| [automations.md](automations.md) | Automations, scripts, helpers, template sensors |
| [dashboards.md](dashboards.md) | Dashboards and sidebar |
| [open-items.md](open-items.md) | Known loose ends and unanswered questions |
| [`../dashboards/`](../dashboards) | Redacted clone of the dashboards |
| [adr/](adr/README.md) | Architecture decision records |

## Privacy

This repository is public. The docs leave out LAN addresses, MAC addresses, the public IP, port forwards, modem settings, zone coordinates, account names and secrets. Those are kept in a private note outside the repository.

## Keeping this current

Every change to the setup updates the matching document in the same commit. A change that settles a choice between alternatives also gets an ADR. The rules are in [`CLAUDE.md`](../CLAUDE.md) and [adr/README.md](adr/README.md).
