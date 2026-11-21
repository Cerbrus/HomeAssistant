# ADR-0010: Keep the custom 404 page out of this repository

- **Status:** Accepted
- **Date:** 2026-04-11
- **Origin:** Backfilled, rationale confirmed

## Context

The repository began with a custom 404 page for the reverse proxy and grew a TypeScript and SCSS build for it under `www_src/`. Its build output was served from Home Assistant's `www` folder.

## Decision

Move the 404 page and its build to its own project, `www-nodejs-webserver`, and remove it from Home Assistant's `www` folder. This repository holds Home Assistant configuration only.

## Alternatives considered

- Keeping the web project next to the configuration: a Node toolchain and build output inside a config directory that the Pi pulls.

## Consequences

- No build step and no Node dependencies in the configuration repository.
- `www/` only holds static assets Home Assistant uses itself (icons, sidebar configuration).
- The Node entries in `.gitignore` from that period were removed on 2026-11-21.
