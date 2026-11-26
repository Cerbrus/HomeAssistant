#!/usr/bin/env python3
import json
import re
import sys
import urllib.request
from collections import Counter
from datetime import datetime, timedelta

from proxy_common import GEO_CACHE, probes

IP_BANS = "/config/ip_bans.yaml"
GEO_LOOKUP = "http://ip-api.com/batch?fields=status,country,countryCode,city,query"
GEO_BATCH = 100
GEO_DAYS = 30
TIMEOUT = 20
TOP = 6
PATH_LENGTH = 60
BAN_KEY = re.compile(r"^([0-9a-fA-F.:]+):\s*$")


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
    unknown = [address for address in dict.fromkeys(addresses) if address not in cache]
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


def countries(probes, places):
    counts = Counter()
    addresses = {}
    for probe in probes:
        place = places.get(probe["a"], {})
        key = (place.get("country") or "Unknown", place.get("code", ""))
        counts[key] += 1
        addresses.setdefault(key, set()).add(probe["a"])
    return [
        {"name": name, "code": code, "addresses": len(addresses[(name, code)]), "count": count}
        for (name, code), count in counts.most_common(TOP)
    ]


def main():
    now = datetime.now().astimezone()
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
    day_ago = now - timedelta(hours=24)

    today = 0
    last_hour = 0
    last_day = []
    for probe in probes():
        if probe["at"] >= midnight:
            today += 1
        if probe["at"] >= now - timedelta(hours=1):
            last_hour += 1
        if probe["at"] >= day_ago:
            last_day.append(probe)

    banned = bans()
    addresses = top(Counter(probe["a"] for probe in last_day))
    places = locations(
        [row["name"] for row in addresses] + [probe["a"] for probe in last_day[::-1]], now
    )
    print(json.dumps({
        "today": today,
        "last_hour": last_hour,
        "last_24h": len(last_day),
        "top_address_count": addresses[0]["count"] if addresses else 0,
        "addresses_24h": len({probe["a"] for probe in last_day}),
        "hosts": top(Counter(probe["h"] for probe in last_day)),
        "addresses": [located(row, row["name"], places) for row in addresses],
        "countries": countries(last_day, places),
        "paths": top(Counter(probe["p"][:PATH_LENGTH] for probe in last_day)),
        "bans": len(banned),
        "banned": banned,
        "updated": now.isoformat(timespec="seconds"),
    }))


if __name__ == "__main__":
    try:
        main()
    except OSError as error:
        sys.exit(f"probe_stats: {error}")
