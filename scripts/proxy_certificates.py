#!/usr/bin/env python3
import json
import socket
import ssl
import sys
from datetime import datetime, timezone

from proxy_common import ProxyError, call, login

PORT = 443
TIMEOUT = 10
UNREADABLE = -1


def host_names():
    hosts = call("nginx/proxy-hosts", login())
    return sorted({name for host in hosts if host["enabled"] for name in host["domain_names"]})


def served(name, now):
    context = ssl.create_default_context()
    try:
        with socket.create_connection((name, PORT), timeout=TIMEOUT) as connection:
            with context.wrap_socket(connection, server_hostname=name) as secure:
                certificate = secure.getpeercert()
    except (OSError, ssl.SSLError) as error:
        return {"serial": name, "days": UNREADABLE, "until": "", "problem": str(error)[:80]}
    until = datetime.fromtimestamp(ssl.cert_time_to_seconds(certificate["notAfter"]), timezone.utc)
    return {
        "serial": certificate["serialNumber"],
        "days": (until - now).days,
        "until": until.date().isoformat(),
        "problem": "",
    }


def main():
    now = datetime.now(timezone.utc)
    certificates = {}
    for name in host_names():
        found = served(name, now)
        row = certificates.setdefault(found["serial"], {**found, "names": []})
        row["names"].append(name.removesuffix(".cerbrus.nl"))
    rows = sorted(certificates.values(), key=lambda row: row["days"])
    if not rows:
        sys.exit("proxy_certificates: the proxy has no enabled hosts")
    print(json.dumps({
        "days": rows[0]["days"],
        "host": ", ".join(rows[0]["names"]),
        "certificates": [
            {"names": ", ".join(row["names"]), "days": row["days"], "until": row["until"], "problem": row["problem"]}
            for row in rows
        ],
        "updated": now.astimezone().isoformat(timespec="seconds"),
    }))


if __name__ == "__main__":
    try:
        main()
    except ProxyError as error:
        sys.exit(f"proxy_certificates: {error}")
