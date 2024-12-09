---
title: Data Collection
linkTitle: Data Collection
date: 2024-12-08
description: >
  Information on how data is collected by the Navidrome organization
---

Navidrome includes an **anonymous usage statistics feature** designed to help improve the project for all users. This page explains what data is collected, how it is used, and how to opt out if you prefer not to participate.

---

## Key Principles

1. **Transparency**: Clear and open communication about what data is collected and why.
2. **Privacy**: No personal or identifiable information is ever collected.
3. **User Control**: You can opt out of data collection at any time.

---

## What Data is Collected?

### Application Details
- Navidrome version
- Application uptime

### System Information
- Operating system type and version
- System architecture (e.g., ARM, x86_64)
- Number of CPUs
- Memory usage statistics

### Library Statistics
- Counts of tracks, albums, artists, playlists, shares, and radio stations
- Number of active users (as a count, not individual IDs)

### Configuration Settings (Non-Sensitive Only)
- Enabled features (e.g., LastFM, Spotify, Prometheus)
- Filesystem types used for music, data, cache, and backup directories

### Data Retention
- Collected data is sent once daily and retained for 30 days. It is then permanently deleted.

---

## What is NOT Collected?

Navidrome does **not** collect:
- Personal Identifiable Information (PII) such as email addresses or usernames
- IP addresses, location data, or device fingerprints
- Playback history (e.g., song plays associated with users)
- Song/artist/album/playlist names
- Sensitive configuration details (e.g., passwords, tokens, or internal server logs)

---

## Why is Data Collected?

Anonymous usage data helps the Navidrome developer:
- Identify the most common platforms and configurations.
- Prioritize features and fixes based on actual usage.
- Prevent updates from disrupting the majority of users.

---

## Privacy and Transparency

- **Open Source**: The data collection process and server code are fully open source. You can inspect them on [GitHub](https://github.com/navidrome/insights).
- **Logged Payloads**: Each time data is sent, the exact payload is logged locally on your server, ensuring you know what is being transmitted.

---

## How to Opt Out

Data collection is enabled by default. To disable it, you can either set a configuration option [to disable telemetry](/docs/usage/configuration-options/#available-options) or select to opt-out during the first-time setup from a new database. Note that the config option will always take priority over whatever may have been set during first-time setup.
