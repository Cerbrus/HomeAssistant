# CLAUDE.md

## Project
- This is a Home Assistant configuration repository running on a **Raspberry Pi 4**
- `www/dist/404/` contains an nginx 404 error page with an inline animated SVG of the Cerbrus mascot. Maps to `/homeassistant/www/dist/404/` on the Pi.
- **Reverse proxy**: Nginx Proxy Manager with Let's Encrypt SSL
- **Media stack**: Plex, Radarr, Sonarr, Bazarr, Prowlarr

## SVG Work - Key Gotchas
- **Always trace path coordinates** before placing new elements. SVG paths use relative coords (`c`, `l`) - don't guess positions. Use an agent to compute absolute endpoints when needed.
- **SVG draw order = layer order**. Elements drawn later render on top. To place something "behind" an outline, draw it BEFORE the outline in the markup.
- **Group fill + outline together** for animations. Animating a fill without its corresponding stroke causes visual separation.
- **CSS `transform-origin` must match actual SVG coordinates** of the element being animated, not approximate values.

## www Directory Structure
- `www/icons/` - Dashboard icons (media stack logos, mascot)
- `www/src/` - TypeScript source, package info, configs
- `www/dist/` - Compiled/served output (HTML, CSS, JS, assets). Maps to `/homeassistant/www/dist/` on the Pi.

## 404 Page TypeScript
- Source: `www/src/404/` — entry point `404.ts`, module classes alongside it (camelCase filenames)
- Bundled with esbuild to `www/dist/404/404.js`
- Uses yarn. `yarn build` for one-shot build, `yarn watch` for auto-recompile on save
- Run commands from `www/src/`

## User Preferences
- Keep the dark blue-purple page background (`#1a1a2e`) - do NOT change to warm/brown tones
- User will often manually adjust SVG paths and re-prompt - read the current file state before each edit
- Wolf-themed, not dog-themed (use 🐺 not 🐕)