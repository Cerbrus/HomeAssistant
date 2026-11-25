#!/usr/bin/env python3
import json
import re
import sys
import urllib.request
from collections import Counter
from datetime import datetime, timedelta

PROBE_LOG = "https://proxy.cerbrus.nl/__probes"
IP_BANS = "/config/ip_bans.yaml"
GEO_LOOKUP = "http://ip-api.com/batch?fields=status,country,countryCode,city,query"
GEO_CACHE = "/config/.probe_geo_cache.json"
GEO_BATCH = 100
GEO_DAYS = 30
TIMEOUT = 20
TOP = 5
RECENT = 15
PATH_LENGTH = 60
BAN_KEY = re.compile(r"^([0-9a-fA-F.:]+):\s*$")


def probes():
    with urllib.request.urlopen(PROBE_LOG, timeout=TIMEOUT) as response:
        lines = response.read().decode("utf-8", "replace").splitlines()
    for line in lines:
        try:
            probe = json.loads(line)
            probe["at"] = datetime.fromisoformat(probe["t"])
        except (ValueError, KeyError):
            continue
        yield probe


def bans():
    try:
        with open(IP_BANS, encoding="utf-8") as file:
            return [match.group(1) for match in map(BAN_KEY.match, file) if match]
    except FileNotFoundError:
        return []


def top(counter):
    return [{"name": name, "count": count} for name, count in counter.most_common(TOP)]


def cached_locations(now):
    try:
        with open(GEO_CACHE, encoding="utf-8") as file:
            cache = json.load(file)
    except (OSError, ValueError):
        return {}
    oldest = (now - timedelta(days=GEO_DAYS)).isoformat()
    return {address: place for address, place in cache.items() if place["at"] >= oldest}


def lookup(addresses):
    request = urllib.request.Request(
        GEO_LOOKUP,
        data=json.dumps(addresses[:GEO_BATCH]).encode(),
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        return json.load(response)


def locations(addresses, now):
    cache = cached_locations(now)
    unknown = sorted(set(addresses) - set(cache))
    if unknown:
        try:
            for place in lookup(unknown):
                cache[place["query"]] = {
                    "country": place.get("country", ""),
                    "code": place.get("countryCode", "").lower(),
                    "city": place.get("city", ""),
                    "at": now.isoformat(),
                }
            with open(GEO_CACHE, "w", encoding="utf-8") as file:
                json.dump(cache, file)
        except (OSError, ValueError, KeyError):
            pass
    return cache


def located(row, address, places):
    place = places.get(address, {})
    return {
        **row,
        "country": place.get("country", ""),
        "code": place.get("code", ""),
        "city": place.get("city", ""),
    }


def main():
    now = datetime.now().astimezone()
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
    day_ago = now - timedelta(hours=24)

    today = 0
    last_day = []
    for probe in probes():
        if probe["at"] >= midnight:
            today += 1
        if probe["at"] >= day_ago:
            last_day.append(probe)

    banned = bans()
    addresses = top(Counter(probe["a"] for probe in last_day))
    recent = last_day[-RECENT:][::-1]
    places = locations(
        [row["name"] for row in addresses] + [probe["a"] for probe in recent], now
    )
    print(json.dumps({
        "today": today,
        "last_24h": len(last_day),
        "addresses_24h": len({probe["a"] for probe in last_day}),
        "hosts": top(Counter(probe["h"] for probe in last_day)),
        "addresses": [located(row, row["name"], places) for row in addresses],
        "paths": top(Counter(probe["p"][:PATH_LENGTH] for probe in last_day)),
        "recent": [
            located(
                {
                    "time": probe["at"].strftime("%d-%m %H:%M"),
                    "address": probe["a"],
                    "host": probe["h"],
                    "path": probe["p"][:PATH_LENGTH],
                    "status": probe["s"],
                },
                probe["a"],
                places,
            )
            for probe in recent
        ],
        "bans": len(banned),
        "banned": banned,
        "updated": now.isoformat(timespec="seconds"),
    }))


if __name__ == "__main__":
    try:
        main()
    except OSError as error:
        sys.exit(f"probe_stats: {error}")
