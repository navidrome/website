---
title: "FAQ"
linkTitle: "FAQ"
weight: 10
description: >
  Frequently Asked Questions
---

### How Can I Manually Trigger a Re-scan in Navidrome
Currently rescanning must be done via the command line:
```bash
navidrome scan --datafolder="C:\path\to\datafolder" [-f]
```
The `datafolder` is where you can find the `navidrome.db` database. Use `-f` to scan all folders (not only the ones with detected changes)

When using `docker-compose` with the official Docker build, the `datafolder` options is already set, you can use the following command:
```bash
docker-compose exec navidrome /app/navidrome scan [-f]
```

An option to force scan via the UI is under development. More information can be found in [Issue #130](https://github.com/deluan/navidrome/issues/130#issuecomment-675684387).