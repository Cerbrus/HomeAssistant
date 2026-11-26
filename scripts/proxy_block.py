#!/usr/bin/env python3
import argparse
import ipaddress
import json
from collections import Counter
from datetime import datetime, timedelta

from proxy_common import ProxyError, cached_places, call, login, probes

STATE = "/config/.proxy_blocks.json"
ACCESS_LIST = "Blocked"
GUARDED_HOSTS = {
    f"{name}.cerbrus.nl" for name in ("requests", "seerr", "recipes", "shopping", "pokemon")
}
REFUSED = (401, 403)
ATTEMPTS = 3
WINDOW = timedelta(hours=1)
BLOCK = timedelta(days=7)


def load():
    try:
        with open(STATE, encoding="utf-8") as file:
            return json.load(file)
    except (OSError, ValueError):
        return {"blocked": {}, "cleared": {}}


def save(state):
    with open(STATE, "w", encoding="utf-8") as file:
        json.dump(state, file)


def offenders(state, now):
    attempts = Counter()
    for probe in probes():
        cleared = state["cleared"].get(probe["a"], "")
        if (
            probe["m"] == "POST"
            and probe["s"] in REFUSED
            and probe["h"] in GUARDED_HOSTS
            and probe["at"] >= now - WINDOW
            and probe["t"] > cleared
        ):
            attempts[(probe["a"], probe["h"])] += 1
    return {
        address: {"host": host, "attempts": count}
        for (address, host), count in attempts.items()
        if count >= ATTEMPTS
    }


def write(addresses):
    token = login()
    matches = [entry for entry in call("nginx/access-lists", token) if entry["name"] == ACCESS_LIST]
    if not matches:
        raise ProxyError(f"access list {ACCESS_LIST} does not exist in the proxy")
    clients = [{"address": address, "directive": "deny"} for address in sorted(addresses)]
    call(
        f"nginx/access-lists/{matches[0]['id']}",
        token,
        method="PUT",
        body={
            "name": ACCESS_LIST,
            "satisfy_any": False,
            "pass_auth": False,
            "items": [],
            "clients": [*clients, {"address": "all", "directive": "allow"}],
        },
    )


def report(state, error, now):
    places = cached_places()
    blocked = [
        {
            "address": address,
            "host": block["host"],
            "attempts": block["attempts"],
            "since": block["since"],
            "until": (datetime.fromisoformat(block["since"]) + BLOCK).isoformat(timespec="seconds"),
            "country": places.get(address, {}).get("country", ""),
            "code": places.get(address, {}).get("code", ""),
        }
        for address, block in state["blocked"].items()
    ]
    blocked.sort(key=lambda block: block["since"], reverse=True)
    print(json.dumps({
        "count": len(blocked),
        "blocked": blocked,
        "last_blocked": blocked[0]["address"] if blocked else "",
        "error": error,
        "updated": now.isoformat(timespec="seconds"),
    }))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--unblock")
    arguments = parser.parse_args()

    now = datetime.now().astimezone()
    state = load()
    wanted = dict(state["blocked"])
    cleared = dict(state["cleared"])

    if arguments.unblock:
        address = str(ipaddress.ip_address(arguments.unblock.strip()))
        wanted.pop(address, None)
        cleared[address] = now.isoformat()

    oldest = (now - BLOCK).isoformat()
    wanted = {address: block for address, block in wanted.items() if block["since"] >= oldest}
    cleared = {address: at for address, at in cleared.items() if at >= oldest}

    error = ""
    try:
        found = offenders({"cleared": cleared}, now)
        for address, offence in found.items():
            wanted.setdefault(address, {**offence, "since": now.isoformat(timespec="seconds")})
        if set(wanted) != set(state["blocked"]):
            write(wanted)
        state = {"blocked": wanted, "cleared": cleared}
        save(state)
    except (ProxyError, OSError, ValueError) as problem:
        error = str(problem)
    report(state, error, now)


if __name__ == "__main__":
    main()
