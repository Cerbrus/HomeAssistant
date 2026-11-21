# ADR-0014: Run HA-MCP as an integration inside Home Assistant, LAN only

- **Status:** Accepted
- **Date:** 2026-11-20
- **Origin:** Recorded at decision time

## Context

Claude Code manages the instance through HA-MCP: reading state, editing automations, dashboards and helpers. HA-MCP ships as an app and as a custom integration with an in-process server. Its endpoint is plain HTTP and the secret path in its URL is its only authentication.

## Decision

Install HA-MCP from the Marketplace as the custom integration with the in-process server. Keep the endpoint on the LAN: no proxy host and no port forward. Give it its own Home Assistant user.

## Alternatives considered

- The HA-MCP app: a separate container for the same function.
- The official MCP Server integration: exposes far fewer management tools.
- Publishing the endpoint through the proxy: a secret URL would be the only thing between the internet and full control of the home.

## Consequences

- The file and YAML tools and the registry reads work without extra setup.
- Claude Code only reaches the instance from the LAN.
- The server's own options are only editable in the Home Assistant UI.
- Changes made through HA-MCP land in `.storage` or `automations.yaml` on the Pi, not in git, so the docs must be updated alongside them.
