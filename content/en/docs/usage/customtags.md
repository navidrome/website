---
title: Using custom tags with Navidrome
linkTitle: Custom Tags
date: 2017-01-02
weight: 45
description: >
  How to import and use custom tags in Navidrome. This page explains the available options to configure custom tags,
  including aliases, tag type, maximum length, custom separators and album-level settings.
---

## Overview

As all tags imported are stored and indexed in the database, to improve performance and reduce storage requirements, 
Navidrome only imports a predefined set of tags. The complete list of default tags imported are listed 
[here][mappings].

However, Navidrome supports importing and using custom tags from your music files. Custom tags allow you to extend the 
metadata beyond the default supported tags. This functionality can be configured via the [configuration file][config].

## Configuring custom tags

{{< alert >}}
This customization is only available when using a [configuration file](/docs/usage/configuration-options).

If you want to use a configuration file with Docker, you can do so by creating a `navidrome.toml` config file in the
host folder that is mapped to your `/data` volume, and set the env var `ND_CONFIGFILE=/data/navidrome.toml`.
{{< /alert >}}


Custom tags are defined under the `Tags` configuration section. A custom tag configuration accepts the following properties:

- **Aliases**: A list of all alternative names that can found in your music files, but should be considered the same tag. 
  Ex: `album artist`, `albumartist`. This is a required field.
- **Type**: Specifies the type of data stored in the tag. It can be used to validate or transform values. 
  Supported types are `int`,`float`, `date`, `uuid`. If not specified, the tag will be treated as a `string`.
- **MaxLength**: The length limit for the tag value. Default is 1024 characters.
- **Album**: A boolean flag indicating whether this tag applies to an album as well. Default is `false`. 
  If set to `true`, the tag will be considered when generating the [PID][pid] for an album.
- **Split**: Tags are always considered multivalued, but you can specify a list of delimiters used to split a tag value 
   into multiple entries.  
- **Ignore**: A boolean flag indicating whether this tag should be ignored. Default is `false`. Useful for disabling tags
  that are imported by [default][mappings]. See example [below](#disabling-tags).

Note that tags are case-insensitive, so you don't need to specify all possible case variations in the `Aliases` list.

### Example configuration
Below is an example of how to set up custom tag options in your configuration file.
```toml
Tags.MyCustomTag.Aliases = ["mycustomtag", "customtag"]
Tags.MyCustomTag.MaxLength = 50
Tags.MyCustomTag.Album = false
Tags.MyCustomTag.Split = ["; ", " / "]
```

In this example, the custom tag `mycustomtag` is configured with two aliases, a type of string (default), and a maximum 
length of 50 characters. Additionally, it sets the splitting delimiters so that if a tag value contains `; ` or ` / ` 
it will be split into multiple values.

## Common use cases

Here are some common use cases for custom tags.

### Adding a new tag for disambiguation
By default, Navidrome uses MusicBrainz IDs to identify albums and tracks. However, if your music library is tagged with 
information from other DBs, like Discogs, you can add custom tags to store the Discogs IDs.

Example:
```toml
Tags.discogs_release_id.Aliases = ['discogs_release_id']
Tags.discogs_release_id.Album = true
PID.Album = 'discogs_release_id|albumartistid,album,albumversion,releasedate'
```

See the [PID configuration][pid] for more information on how to configure album disambiguation.

### Disabling tags
Any custom tag found in your music files, but not defined with the `Tags` configuration option will be ignored by 
Navidrome. If you need to disable a tag that is already [imported by default][mappings], you can do so by explicitly
setting its `Ignore` flag to `true`.

Example: disabling the `subtitle` tag 
```toml
Tags.Subtitle.Ignore = true
```

### Changing separators
The preferable way to have multivalued tags is to use your tag editor and add multiple values for the same tag.
However, if your library is already tagged with multiple values separated by a known delimiter, you can configure
Navidrome to split the tag value by that delimiter into multiple entries. Just keep in mind that this can have unwanted
side effects if the delimiter is used in other contexts. (Ex: using `'/'` as an artist delimiter can break artists like 
`AC/DC`, `'&'` as a delimiter can break artists like `Simon & Garfunkel`)

Example: Splitting the `artist` tag by `\` and `; `
```toml
Tags.Artist.Split = ['\', '; ']
```

If you want to disable splitting for a tag, you can set the `Split` option to an empty list.
```toml
Tags.Genre.Split = []
```

### Separating Writer and Composer tags
By default, Navidrome maps both `composer` and `writer` tag values to a single (multi-valued) `composer` field in its 
database. If you want to keep these as separate metadata fields, you can define custom tags for each one:
```toml
Tags.Composer.Aliases = ['composer', 'tcom', 'composer', '©wrt', 'wm/composer', 'imus']
Tags.Writer.Aliases = ['writer', 'txxx:writer', 'iwri']
```

This will allow you to filter or sort by `writer` in Smart Playlists.

### Adding tags for custom filtering/sorting in Smart Playlists
If you want to create a Smart Playlist that filters or sorts by a custom tag, you can define the tag in the
configuration file, then use it in the Smart Playlist as a regular 
[field](/docs/usage/smartplaylists/#additional-resources).


[config]: /docs/usage/configuration-options
[mappings]: https://github.com/navidrome/navidrome/blob/master/resources/mappings.yaml
[pid]: /docs/usage/pids

