# ADR-0022: Inject the Nginx Proxy Manager theme at the end of the body

- **Status:** Accepted
- **Date:** 2026-11-21
- **Origin:** Recorded at decision time

## Context

The Nginx Proxy Manager admin interface on `proxy.cerbrus.nl` is styled with the theme.park `organizr` theme. The proxy host's custom Nginx configuration adds the stylesheet link to every page with `sub_filter`. theme.park's own instructions place that link before `</head>`.

With the link in `<head>`, modals and dropdown menus were see-through. Nginx Proxy Manager loads its Tabler stylesheet from JavaScript, which appends it to the end of `<head>`, after the theme. Both stylesheets style `.modal-content` and `.dropdown-menu` with the same selector, so the later one wins: Tabler's background, which reads a surface colour that the theme sets to a translucent black.

## Decision

Inject the theme link before `</body>` instead of `</head>`, so the theme is the last stylesheet in the document and wins every rule that uses the same selector as Tabler.

## Alternatives considered

- Keep the link in `<head>` and add a `<style>` block with stronger selectors for modals and dropdown menus. It fixes only the listed elements; every other clash stays and needs a new rule when it shows up.
## Consequences

- One line differs from the theme.park instructions. Copying their snippet again brings the see-through popups back.
- The page can show the stock styling for a moment before the theme loads.
- The fix depends on how Nginx Proxy Manager loads its styles. A release that changes this can make the placement unnecessary, or break the theme in another way.
- The snippet is in [apps.md](../apps.md#nginx-proxy-manager-theme).
