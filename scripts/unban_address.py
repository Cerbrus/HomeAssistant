#!/usr/bin/env python3
import ipaddress
import sys

IP_BANS = "/config/ip_bans.yaml"


def without_ban(lines, address):
    kept = []
    skipping = False
    for line in lines:
        if not line.startswith((" ", "\t")):
            skipping = line.strip().rstrip(":").strip("'\"") == address
        if not skipping:
            kept.append(line)
    return kept


def main():
    if len(sys.argv) < 2:
        sys.exit("unban_address: no address given")
    address = str(ipaddress.ip_address(sys.argv[1].strip()))
    path = sys.argv[2] if len(sys.argv) > 2 else IP_BANS
    with open(path, encoding="utf-8") as file:
        lines = file.readlines()
    kept = without_ban(lines, address)
    if len(kept) == len(lines):
        sys.exit(f"unban_address: {address} is not banned")
    with open(path, "w", encoding="utf-8") as file:
        file.writelines(kept)
    print(f"Removed the ban on {address}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError) as error:
        sys.exit(f"unban_address: {error}")
