#!/usr/bin/env python3
import argparse
import json
import sys
import urllib.error
import urllib.request

CONFIG_ENTRIES = "/config/.storage/core.config_entries"
BLOCKED_EXTENSIONS = (
    ".exe", ".scr", ".msi", ".bat", ".cmd", ".pif",
    ".lnk", ".vbs", ".ps1", ".zipx", ".arj",
)
FAIL_DOWNLOADS = [0, 1]
MISSING_SEARCH = {"sonarr": "MissingEpisodeSearch", "radarr": "MissingMoviesSearch"}
SESSION_HEADER ="X-Transmission-Session-Id"
TIMEOUT = 15


def call(url, method="GET", headers=None, body=None):
    request = urllib.request.Request(
        url,
        data=json.dumps(body).encode() if body is not None else None,
        method=method,
        headers={"Content-Type": "application/json", **(headers or {})},
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        raw = response.read()
    return json.loads(raw) if raw else None


def entries(domain):
    with open(CONFIG_ENTRIES, encoding="utf-8") as file:
        stored = json.load(file)["data"]["entries"]
    return [entry["data"] for entry in stored if entry["domain"] == domain]


def torrents(client):
    scheme = "https" if client.get("ssl") else "http"
    url = f"{scheme}://{client['host']}:{client['port']}{client['path']}"
    body = {
        "method": "torrent-get",
        "arguments": {"fields": ["hashString", "name", "files"]},
    }
    try:
        return call(url, "POST", body=body)["arguments"]["torrents"]
    except urllib.error.HTTPError as error:
        if error.code != 409:
            raise
        session = {SESSION_HEADER: error.headers[SESSION_HEADER]}
        return call(url, "POST", session, body)["arguments"]["torrents"]


def blocked_file(torrent):
    for file in torrent.get("files", []):
        if file["name"].strip().lower().endswith(BLOCKED_EXTENSIONS):
            return file["name"]
    return None


def queue_ids(app, hashes):
    url = (
        f"{app['url'].rstrip('/')}/api/v3/queue?pageSize=1000"
        "&includeUnknownSeriesItems=true&includeUnknownMovieItems=true"
    )
    records = call(url, headers={"X-Api-Key": app["api_key"]})["records"]
    return [
        record["id"]
        for record in records
        if (record.get("downloadId") or "").upper() in hashes
    ]


def remove(app, ids):
    url = (
        f"{app['url'].rstrip('/')}/api/v3/queue/bulk"
        "?removeFromClient=true&blocklist=true&skipRedownload=false"
    )
    call(url, "DELETE", {"X-Api-Key": app["api_key"]}, {"ids": ids})


def unprotected_indexers(app, dry_run):
    url = f"{app['url'].rstrip('/')}/api/v3/indexer"
    headers = {"X-Api-Key": app["api_key"]}
    names = []
    for indexer in call(url, headers=headers):
        field = next(
            (f for f in indexer["fields"] if f["name"] == "failDownloads"), None
        )
        if not field or sorted(field.get("value") or []) == FAIL_DOWNLOADS:
            continue
        field["value"] = FAIL_DOWNLOADS
        if not dry_run:
            call(f"{url}/{indexer['id']}?forceSave=true", "PUT", headers, indexer)
        names.append(indexer["name"])
    return names


def protect_indexers(dry_run):
    names = []
    for app in entries("sonarr") + entries("radarr"):
        names += unprotected_indexers(app, dry_run)
    if names:
        verb = "Would set" if dry_run else "Set"
        print(f"{verb} Fail Downloads on: {', '.join(sorted(set(names)))}")


def remove_fakes(dry_run):
    fakes = {}
    for client in entries("transmission"):
        for torrent in torrents(client):
            file = blocked_file(torrent)
            if file:
                fakes[torrent["hashString"].upper()] = file

    if not fakes:
        return

    removed = 0
    for app in entries("sonarr") + entries("radarr"):
        ids = queue_ids(app, fakes)
        if ids and not dry_run:
            remove(app, ids)
        removed += len(ids)

    verb = "Would remove" if dry_run else "Removed"
    names = ", ".join(sorted(fakes.values()))
    print(f"{verb} {removed} queue item(s) for fake download(s): {names}")


def search_missing(dry_run):
    started = []
    for domain, command in MISSING_SEARCH.items():
        for app in entries(domain):
            if not dry_run:
                call(
                    f"{app['url'].rstrip('/')}/api/v3/command",
                    "POST",
                    {"X-Api-Key": app["api_key"]},
                    {"name": command},
                )
            started.append(domain.capitalize())
    verb = "Would start" if dry_run else "Started"
    print(f"{verb} a search for missing items in: {', '.join(started)}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--indexers", action="store_true")
    mode.add_argument("--search", action="store_true")
    arguments = parser.parse_args()

    if arguments.indexers:
        protect_indexers(arguments.dry_run)
    elif arguments.search:
        search_missing(arguments.dry_run)
    else:
        remove_fakes(arguments.dry_run)


if __name__ == "__main__":
    try:
        main()
    except (OSError, KeyError, ValueError) as error:
        sys.exit(f"arr_guard failed: {error!r}")
