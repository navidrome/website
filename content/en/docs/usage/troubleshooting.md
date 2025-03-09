---
title: "Troubleshooting"
linkTitle: "Troubleshooting"
date: 2017-01-05
description: >
  Solutions for common issues
draft: true
---


## Album cover art is not showing up

__This issue was fixed in version 0.15.0, please upgrade!__

You don't see any artwork in Navidrome's UI and in any Subsonic clients, and you are getting errors 
in the logs like this:
```
 panic: runtime error: invalid memory address or nil pointer dereference

 -> github.com/djherbis/fscache.(*handleCounter).inc
 ->   /go/pkg/mod/github.com/djherbis/fscache@v0.10.0/fscache.go:327

    github.com/djherbis/fscache.(*FSCache).newFile
      /go/pkg/mod/github.com/djherbis/fscache@v0.10.0/fscache.go:227
    github.com/djherbis/fscache.(*FSCache).Get
      /go/pkg/mod/github.com/djherbis/fscache@v0.10.0/fscache.go:154
    github.com/navidrome/navidrome/engine.(*cover).Get
      /github/workspace/engine/cover.go:50
```

This is being caused by a [bug](https://github.com/navidrome/navidrome/issues/177), and we are already
working on a fix for it. In the meantime, you can fix the issue by disabling Navidrome's image cache.

To solve this, simply set `ND_IMAGECACHESIZE=0` in your [configuration](/docs/usage/configuration-options) 
and restart Navidrome. You should see the warning message `Image cache disabled` during startup, 
confirming the configuration was effective. You should now be able to see the album cover arts.

__Note:__ This option is only available in Navidrome version 0.14.4 and above.

