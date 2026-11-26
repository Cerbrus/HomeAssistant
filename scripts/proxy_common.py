import json
import urllib.request
from datetime import datetime

PROXY = "https://proxy.cerbrus.nl"
PROBE_LOG = f"{PROXY}/__probes"
SECRETS = "/config/secrets.yaml"
GEO_CACHE = "/config/.probe_geo_cache.json"
IDENTITY = "npm_identity"
SECRET = "npm_secret"
TIMEOUT = 20


class ProxyError(Exception):
    pass


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


def secret(name):
    try:
        with open(SECRETS, encoding="utf-8") as file:
            for line in file:
                key, separator, value = line.partition(":")
                if separator and key.strip() == name:
                    return value.strip().strip("'\"")
    except OSError:
        pass
    raise ProxyError(f"{name} is missing from secrets.yaml")


def call(path, token=None, method="GET", body=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(
        f"{PROXY}/api/{path}",
        data=json.dumps(body).encode() if body is not None else None,
        method=method,
        headers=headers,
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            return json.load(response)
    except (OSError, ValueError) as error:
        raise ProxyError(f"proxy API {method} {path}: {error}") from error


def login():
    answer = call("tokens", method="POST", body={"identity": secret(IDENTITY), "secret": secret(SECRET)})
    if "token" not in answer:
        raise ProxyError("proxy API login gave no token")
    return answer["token"]


def cached_places():
    try:
        with open(GEO_CACHE, encoding="utf-8") as file:
            return json.load(file)
    except (OSError, ValueError):
        return {}
