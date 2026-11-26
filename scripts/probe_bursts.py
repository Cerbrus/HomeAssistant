#!/usr/bin/env python3
import json
import sys
from collections import Counter
from datetime import datetime, timedelta

from proxy_common import locations, probes

RECENT = 15
PATH_LENGTH = 64
BURST_GAP = 120
BURST_HOSTS = 3
DOMAIN = ".cerbrus.nl"


def bursts(probes):
    found = []
    current = {}
    for probe in sorted(probes, key=lambda probe: probe["at"]):
        burst = current.get(probe["a"])
        if not burst or (probe["at"] - burst["end"]).total_seconds() > BURST_GAP:
            burst = current[probe["a"]] = {"address": probe["a"], "start": probe["at"], "probes": []}
            found.append(burst)
        burst["end"] = probe["at"]
        burst["probes"].append(probe)
    return sorted(found, key=lambda burst: burst["start"], reverse=True)


def summary(burst, places):
    probes = burst["probes"]
    hosts = [name for name, _ in Counter(probe["h"] for probe in probes).most_common()]
    requests = Counter(
        (probe["p"][:PATH_LENGTH], probe["h"].removesuffix(DOMAIN), probe["s"])
        for probe in probes
    )
    place = places.get(burst["address"], {})
    return {
        "time": burst["start"].strftime("%d-%m %H:%M:%S"),
        "seconds": round((burst["end"] - burst["start"]).total_seconds()),
        "count": len(probes),
        "unique": len(requests),
        "address": burst["address"],
        "country": place.get("country", ""),
        "code": place.get("code", ""),
        "city": place.get("city", ""),
        "hosts": [name.removesuffix(DOMAIN) for name in hosts[:BURST_HOSTS]],
        "more_hosts": max(len(hosts) - BURST_HOSTS, 0),
        "path": Counter(probe["p"][:PATH_LENGTH] for probe in probes).most_common(1)[0][0],
        "statuses": sorted({probe["s"] for probe in probes}),
        "requests": [
            {"p": path, "h": host, "s": status, "n": count}
            for (path, host, status), count in requests.most_common()
        ] if len(requests) > 1 else [],
    }


def main():
    now = datetime.now().astimezone()
    day_ago = now - timedelta(hours=24)
    found = bursts(probe for probe in probes() if probe["at"] >= day_ago)
    recent = found[:RECENT]
    places = locations([burst["address"] for burst in recent], now)
    print(json.dumps({
        "count": len(found),
        "bursts": [summary(burst, places) for burst in recent],
        "updated": now.isoformat(timespec="seconds"),
    }))


if __name__ == "__main__":
    try:
        main()
    except OSError as error:
        sys.exit(f"probe_bursts: {error}")
