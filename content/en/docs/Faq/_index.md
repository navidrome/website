---
title: "FAQ"
linkTitle: "FAQ"
weight: 10
description: >
  Frequently Asked Questions
---

## How Can I Manually Trigger a Re-scan in Navidrome
Currently rescanning must be done via a command.  

```bash
navidrome scan [-f]
```
(Use `-f` to scan all folders (not only the ones with detected changes))

An option to force scan via the UI is under development. More information can be found in [Issue #130](https://github.com/deluan/navidrome/issues/130#issuecomment-675684387).