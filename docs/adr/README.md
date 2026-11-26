# Architecture decision records

One file per decision, numbered in the order the decisions were taken. A decision recorded later than it was taken gets the next free number and its real date.

## Index

| ADR | Date | Decision | Origin |
| --- | --- | --- | --- |
| [0001](0001-single-pi-hosts-everything.md) | 2026-03-30 | Host everything on one Raspberry Pi running Home Assistant OS | Backfilled, confirmed |
| [0002](0002-public-access-duckdns-npm.md) | 2026-03-30 | Publish services on an own domain through DuckDNS and Nginx Proxy Manager | Backfilled, confirmed |
| [0003](0003-tuya-local-over-tuya-cloud.md) | 2026-04-02 | Control Tuya devices with Tuya Local instead of the Tuya cloud integration | Backfilled, confirmed |
| [0004](0004-config-in-git-git-pull-deploy.md) | 2026-04-03 | Keep the configuration in a public git repository and deploy with the Git pull app | Backfilled, confirmed |
| [0005](0005-yaml-split-per-domain.md) | 2026-04-03 | Split YAML configuration into one file per domain under `_yaml/` | Backfilled, confirmed |
| [0006](0006-sidebar-as-main-navigation.md) | 2026-04-04 | Use the Home Assistant sidebar as the navigation for the whole homelab | Backfilled, confirmed |
| [0007](0007-ui-config-over-yaml.md) | 2026-04-04 | Configure integrations in the UI when a config flow exists (deprecated) | Backfilled, confirmed |
| [0008](0008-energy-via-dsmr-reader.md) | 2026-04-04 | Read the smart meter with the DSMR Reader app over MQTT | Backfilled, confirmed |
| [0009](0009-pi-fan-generic-thermostat.md) | 2026-04-05 | Drive the Pi's cooling fan with a generic thermostat | Backfilled, confirmed |
| [0010](0010-404-page-out-of-repo.md) | 2026-04-11 | Keep the custom 404 page out of this repository | Backfilled, confirmed |
| [0011](0011-offsite-backups-google-drive.md) | 2026-04-14 | Copy backups off-site to Google Drive | Backfilled, confirmed |
| [0012](0012-split-horizon-dns.md) | 2026-06-23 | Resolve `cerbrus.nl` to the Pi inside the LAN | Recorded |
| [0013](0013-npm-only-public-entry.md) | 2026-11-20 | Make Nginx Proxy Manager the only entry from the internet | Recorded |
| [0014](0014-ha-mcp-in-process-lan-only.md) | 2026-11-20 | Run HA-MCP as an integration inside Home Assistant, LAN only | Recorded |
| [0015](0015-marketplace-migration.md) | 2026-11-20 | Move from HACS to the built-in Marketplace and drop the git status sensor | Recorded |
| [0016](0016-bathroom-fan-power-cycle.md) | 2026-11-20 | Control the bathroom fan by power-cycling it | Recorded |
| [0017](0017-tuya-dynamic-leases-until-new-modem.md) | 2026-11-21 | Leave the Tuya devices on dynamic addresses until the new modem arrives | Recorded |
| [0018](0018-use-adrs-and-living-docs.md) | 2026-11-21 | Record decisions as ADRs and keep the documentation current | Recorded |
| [0019](0019-lean-marketplace.md) | 2026-11-21 | Keep only what is in use, add Marketplace cards on confirmation | Recorded |
| [0020](0020-redacted-dashboard-clone.md) | 2026-11-21 | Keep a redacted clone of the dashboards in the repository | Recorded |
| [0021](0021-cloud-integrations-bosch-solis.md) | 2026-11-20 | Use cloud integrations for the Bosch thermostat and the Solis inverter | Backfilled, confirmed |
| [0022](0022-npm-theme-injected-at-end-of-body.md) | 2026-11-21 | Inject the Nginx Proxy Manager theme at the end of the body | Recorded |
| [0023](0023-commit-ui-edits-on-the-pi.md) | 2026-11-21 | Commit UI edits on the Pi and push them with a deploy key | Recorded |
| [0024](0024-energy-cost-energyzero-plus-markup.md) | 2026-11-21 | Price energy with EnergyZero market prices plus an own markup | Recorded |
| [0025](0025-arr-guard-script-over-cleanuparr.md) | 2026-11-22 | Remove fake downloads with an own script instead of Cleanuparr | Recorded |
| [0026](0026-suggestarr-on-the-server-pi.md) | 2026-11-22 | Run SuggestArr as a container on the server Pi | Recorded |
| [0027](0027-eufy-via-eufy-home-security.md) | 2026-11-23 | Integrate the eufy doorbell with Anker eufy Home Security | Recorded |
| [0028](0028-media-admin-apps-lan-only.md) | 2026-11-25 | Restrict the media admin apps to the LAN | Recorded |
| [0029](0029-harden-public-logins.md) | 2026-11-25 | Harden the logins that stay public | Recorded |
| [0030](0030-proxy-error-pages-in-place.md) | 2026-11-26 | Show the custom error pages in place for errors of the proxy | Recorded |
| [0031](0031-probe-log-and-security-view.md) | 2026-11-26 | Show probing traffic with an own log and script instead of an analyser app | Recorded |
| [0032](0032-lift-bans-on-the-home-network.md) | 2026-11-26 | Lift bans on the home network automatically | Recorded |
| [0033](0033-locate-probing-addresses-online.md) | 2026-11-26 | Locate probing addresses with an online lookup | Recorded |
| [0034](0034-block-password-guessing-at-the-proxy.md) | 2026-11-26 | Block password guessing at the proxy | Recorded |
| [0035](0035-check-the-certificates-that-are-served.md) | 2026-11-26 | Check the certificates that the proxy actually serves | Recorded |
| [0036](0036-log-requests-before-the-redirect.md) | 2026-11-26 | Log a redirected request as it came in, not the page it lands on | Recorded |

"Backfilled" ADRs were written on 2026-11-21 from the configuration and git history, and their rationale was confirmed by the owner afterwards; the date is when the decision took effect.

## When to write one

Write an ADR when a change settles a choice between real alternatives and someone could later ask "why is it like this?":

- adding, replacing or removing an integration, app or device type
- changing how the instance is reached, deployed, backed up or secured
- a convention for the configuration (structure, naming, where something is configured)
- behaviour that looks wrong but is intended
- a deliberate decision to leave something as it is

No ADR for routine work: a new automation that follows existing patterns, version updates, dashboard tweaks, bug fixes.

## How

1. Copy [template.md](template.md) to `NNNN-short-title.md` with the next free number.
2. Fill it in. Keep it short; the context and the consequences matter most.
3. Add a row to the index above.
4. Never rewrite an accepted ADR's decision. To change course, write a new ADR and set the old one's status to `Superseded by ADR-NNNN`. Fixing facts or confirming a backfilled rationale is fine.
5. Keep the privacy rule from [docs/README.md](../README.md#privacy): no addresses, coordinates, account names or secrets.
