# ADR-0030: Show the custom error pages in place for errors of the proxy

- **Status:** Accepted
- **Date:** 2026-11-26
- **Origin:** Recorded at decision time

## Context

`error.cerbrus.nl/<status code>` serves a custom page per HTTP status code. When Nginx Proxy Manager itself refuses or fails a request (403 on a LAN only host, 502 when an app is down), the visitor got the bare Nginx page instead.

## Decision

One shared Nginx snippet, included by every proxy host, answers the errors that the proxy itself produces with the matching page from the error page app. The page is fetched internally: the address in the browser and the status code stay as they were. Error responses of the apps behind the proxy are passed through untouched.

## Alternatives considered

- Redirecting to `error.cerbrus.nl/<status code>`: the original status code becomes a redirect and the address changes.
- Also replacing the apps' own error responses (`proxy_intercept_errors`): breaks APIs that answer 401 or 404 on purpose, such as Home Assistant's.
- A line per proxy host: has to be repeated on every new host.

## Consequences

- The snippet is `custom/server_proxy.conf` in the proxy's configuration folder. It is not managed through the proxy's interface and lives outside this repository; it is part of the app's backup.
- The error pages load their stylesheet, script and images from absolute paths. The snippet rewrites those to `https://error.cerbrus.nl/`, so `error.cerbrus.nl` has to stay reachable from wherever the page is shown.
- The query string is dropped when the error page is fetched. Without that, a request refused by Block Common Exploits is refused again on the internal fetch and ends in a closed connection.
- When the error page app is down, proxy errors fall back to a bare Nginx page.
- A new proxy host gets the pages without any setup.
