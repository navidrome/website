---
title: "Exclude Content From Library"
linkTitle: "Exclude Content From Library"
date: 2025-07-05
weight: 70
description: >
  Learn how to use `.ndignore` to exclude content from being added to Navidrome's library
draft: false
---

## Overview

Navidrome allows the usage of a `.ndignore` file to exclude content from being added to Navidrome's library. These files can be used in the following ways: 
1. A **blank** `.ndignore` file can be added to a directory, and as a result Navidrome will ignore that folder and its subfolders from being added to Navidrome's library. 
2. A `.ndignore` file also supports `.gitignore` syntax inside of it to set rules for content to exclude. This allows you to place a single file in your parent Music folder and then use a single file to establish rules on ignoring certain folders, filetypes, or files. 

### Key behaviors
- **Cascading**: Patterns from parent directories apply to all subdirectories
- **Multiple files**: You can place `.ndignore` files in different directories

{{< alert color="warning" >}}
**Important:** Upon adding or updating an `.ndignore` file, you will need to trigger a Full Library Scan for it to be picked up.  
{{< /alert >}}

## Syntax Usage and Examples

A single .ndignore can be placed at the parent folder of your library and then syntax added to it. 

For example, if your `~/Music` folder is mounted to Navidrome then you could create `~/Music/.ndignore` and add syntax to it. The following examples assume the `.ndignore` is placed in the parent folder of your library: 

```bash
# .ndignore supports comments starting with '#'

# Ignore all .flac
*.flac

# ignore specific folders
/untagged/
/unsorted/

# Negate the .flac ignore rule for a favorite album. 
!/thursday/taking-inventory-of-a-frozen-lake/*.flac
```

## Limitations
- Brace expansion like `*.{flac,mp3}` don't work -- use separate lines instead
- Changes require a full library rescan to be picked up. 

## Technical Details
- The `.ndignore` syntax utilizes the [go-gitignore](https://pkg.go.dev/github.com/sabhiram/go-gitignore) library. See documentation for additional syntax usage. 