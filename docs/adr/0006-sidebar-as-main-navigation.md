# ADR-0006: Use the Home Assistant sidebar as the navigation for the whole homelab

- **Status:** Accepted
- **Date:** 2026-04-04
- **Origin:** Backfilled, rationale confirmed

## Context

The Pi runs many apps besides Home Assistant, each with its own web interface, and frequently used settings pages sit several clicks deep. Having it all in one place is a matter of convenience.

## Decision

Make everything reachable from the sidebar: iframe dashboards for the media apps and the proxy, ingress panels for apps, `panel_custom` shortcuts for settings pages, and the Sidebar Organizer module to group and collapse the entries.

## Alternatives considered

- A separate start page or bookmarks: a second place to maintain, outside Home Assistant's login.
- The stock sidebar: a flat, long list.

## Consequences

- One entry point for the whole setup, behind the Home Assistant login; admin-only entries are hidden from other users.
- The grouping lives in `www/sidebar-organizer.yaml`, in git.
- The settings shortcuts reuse the File editor app's ingress entry point, which is not a documented interface and may break on an update.
- The Sidebar Organizer module is loaded with a cache tag in `configuration.yaml` that needs a bump after each update of the module.
