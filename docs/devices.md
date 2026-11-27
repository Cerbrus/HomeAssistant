# Devices

## Floors and areas

| Floor | Areas |
| --- | --- |
| Ground floor | Living Room, Front of house, Utility room, Network |
| First floor | Office, Bathroom, Bedroom |
| No floor | Media, System (virtual areas for software entities) |

## Physical devices

| Area | Device | Integration | Notes |
| --- | --- | --- | --- |
| Living Room | Shutter - Back | Tuya Local | `cover.shutter_back` |
| Living Room | Shutter - Front | Tuya Local | `cover.shutter_front` |
| Living Room | Living Room TV | Google Cast, Android TV Remote | Chromecast. `media_player.living_room_tv` (Cast: playback and casting), `media_player.living_room_tv_remote` and `remote.living_room_tv` (Android TV Remote: remote control, apps) |
| Living Room | HomeBase | Anker eufy Home Security | HomeBase 2: alarm panel, siren, storage |
| Front of house | Lights - Front Entrance | Tuya Local | Switched at sunset and sunrise |
| Front of house | Doorbell | Anker eufy Home Security | Video Doorbell Dual, behind the HomeBase. `camera.doorbell`, `event.doorbell_doorbell`, `event.doorbell_detection` |
| Office | Lights - Office | Tuya Local | |
| Office | Printer | IPP | Ink levels |
| Bathroom | Bathroom Fan | Tuya Local | `switch.bathroom_fan`, see below |
| Bedroom | Bedroom Light | ICS-2000 | `light.lamp` |
| Utility room | Power socket - Freezer | Tuya Local | `switch.power_socket_freezer` |
| Utility room | 3D printer | OctoPrint | Usually off |
| Network | Pi-hole | Pi-hole | |
| Network | Pi-hole display | Generic Camera | `camera.pi_hole_display`, shown above the Pi-hole card on the System view |
| Media | Plex server, Radarr, Sonarr, Transmission | Plex Media Server, Radarr, Sonarr, Transmission | Service devices of the media apps |
| No area | EasyControl gateway, heating zone, boiler, hot water tank | Bosch | |
| No area | Solar inverter | SolisCloud | |
| No area | Smart meter | DSMR Reader | |
| System | Raspberry Pi 4, cooling fan | Raspberry Pi GPIO, command line | |

### Bathroom fan

The fan is wired to the bathroom light: it starts with the light and keeps running on a 30 minute hardware timer after the light goes off. The Tuya switch only interrupts the fan's power. Cutting the power for a second resets that timer, which is what `script.toggle_bathroom_fan` does ([ADR-0016](adr/0016-bathroom-fan-power-cycle.md)).

### Tuya devices on the network

The Tuya devices are reached by address on the LAN. Only the freezer socket has a fixed address; the others can move after a DHCP renewal and then show as offline in Home Assistant until the entry's host is corrected ([ADR-0017](adr/0017-tuya-dynamic-leases-until-new-modem.md)).

## People and zones

| Item | Details |
| --- | --- |
| Person `Cerbrus` | Tracked by the phone's Mobile App device tracker |
| Person `HA-MCP` | Service account for HA-MCP, no tracker |
| Zone Home | Arrival opens the shutters; being in it at 09:00 on a workday switches the heating to the At home program |
| Zone Goor | Leaving it closes the shutters and turns the heating's away mode on; entering it turns away mode off |
| Zone Work | Not used in automations |
