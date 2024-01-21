---
title: Metadata Extractors
linkTitle: Metadata Extractors
date: 2024-01-02
weight: 100
description: >
  Information on the music metadata extractors used during scanning
---
## Music metadata
Music metadata is derived from audio files via one of the two Extractors for the Scanner:
* [TagLib](https://taglib.org)
* [ffmpeg](https://ffmpeg.org)

The extractor used for scanning can be configured via [configuration options](/docs/usage/configuration-options/#advanced-configuration) using `Scanner.Extractor`.

## TagLib
[TagLib](https://taglib.org) is the default extractor. It is faster at extracting but does not support as many file formats/audio coding formats as ffmpeg.

## Ffmpeg
You may want to try [ffmpeg](https://ffmpeg.org) for extracting if you have files in your collection that are not supported by [TagLib - see their official documentation for information on what is supported](https://taglib.org).
