---
title: How to Use Smart Playlists in Navidrome (Beta)
linkTitle: Smart Playlists (Beta)
date: 2017-01-02
weight: 40
description: >
  
---

Smart Playlists in Navidrome offer a dynamic way to organize and enjoy your music collection. They are created using 
JSON objects stored in files with a `.nsp` extension. These playlists are automatically updated based on specified 
criteria, providing a personalized and evolving music experience.

{{< alert color="warning" title="Beta Feature" >}}
Smart Playlists are currently in beta and may have some limitations. Please report any issues or suggestions to the
[Navidrome GitHub issues page](https://github.com/navidrome/navidrome/issues/1417).
{{</alert>}}

## Creating Smart Playlists
To create a Smart Playlist, you need to define a JSON object with specific fields and operators. 
Here are some examples to get you started:

### Example 1: Recently Played Tracks
This playlist includes tracks played in the last 30 days, sorted by the most recently played.

```json
{
  "name": "Recently Played",
  "comment": "Recently played tracks",
  "all": [
    {"inTheLast": {"lastPlayed": 30}}
  ],
  "sort": "lastPlayed",
  "order": "desc",
  "limit": 100
}
```

### Example 2: 80's Top Songs
This playlist features top-rated songs from the 1980s.
```json
{
  "all": [
    { "any": [
      {"is": {"loved": true}},
      {"gt": {"rating": 3}}
    ]},
    {"inTheRange": {"year": [1981, 1990]}}
  ],
  "sort": "year",
  "order": "desc",
  "limit": 25
}
```

### Example 3: Favourites
This playlist includes all loved tracks, sorted by the date they were loved.
```json
{
  "all": [
    {"is": {"loved": true}}
  ],
  "sort": "dateLoved",
  "order": "desc",
  "limit": 500
}
```

### Example 4: All Songs in Random Order
This playlist includes all songs in a random order. Note: This is not recommended for large libraries.
```json
{
  "all": [
    {"gt": {"playCount": -1}}
  ],
  "sort": "random",
  // limit: 1000 // Uncomment this line to limit the number of songs
}
```

## Creating Smart Playlists using the UI
Currently Smart Playlists can only be created by manually editing `.nsp` files. We plan to add a UI for creating and
editing Smart Playlists in future releases.

In the meantime, if you want a graphical way to create playlists, you can use 
[Feishin](https://github.com/jeffvli/feishin/), a desktop/web client for Navidrome, that supports creating 
Smart Playlists:

{{< imgproc feishin_nsp_editor Fit "2000x2000" />}}

Smart Playlists created/edited in Feishin will be available in Navidrome UI as soon as they are saved.

## Importing Smart Playlists
Smart Playlists are imported the same way as regular (`.m3u`) playlists, during the library scan. Place your `.nsp` 
files in any folder in your library or the path specified by the `PlaylistsPath` configuration. Navidrome will 
automatically detect and import these playlists.

## Managing Smart Playlists

### Visibility and Ownership

- Visibility: To make a Smart Playlist accessible to all users, set it to 'public'. This is crucial if you want 
  to use it in another `.nsp` file (with `inPlaylist` and `notInPlaylist`).
- Ownership: By default, Smart Playlists are owned by the first admin user. You can change the ownership in the 
  Playlists view to allow other users to manage them.

### User-Specific Playlists
Smart Playlists based on user interactions (e.g., play count, loved tracks) are automatically updated based on 
the owner's interactions. If you want personalized playlists for each user, create separate `.nsp` files for each user
and assign ownership accordingly.

### Refreshing Playlists
Smart Playlists are refreshed automatically when they are accessed by the UI or any Subsonic client. This ensures
that the playlist is up-to-date when you view it. To avoid unnecessary load, there is a minimum delay between refreshes.
This delay can be adjusted by setting the
[`SmartPlaylistRefreshDelay`](/docs/usage/configuration-options/#:~:text=SmartPlaylistRefreshDelay) configuration option. 
By default, this is set to `5s`, meaning that Smart Playlists refreshes are spaced at least 5 seconds apart.
You can adjust this value in the configuration file.

## Troubleshooting Common Issues

### Playlist Not Showing Up
If a Smart Playlist is not showing up in the Navidrome UI, check the following:
- Check the logs for any errors during the library scan.
- Ensure the `.nsp` file is in the correct folder and has the correct permissions.
- Ensure the file is correctly formatted and does not contain any syntax errors. Tip: Use a JSON validator to check 
  the file (ex: https://jsonlint.com/)
- Check the playlist's visibility and ownership settings.

### Referencing Other Playlists
When referencing another playlist by ID (using the operator `inPlaylist`), ensure that the referenced playlist is not 
another Smart Playlist unless it is set to 'public'. This ensures proper functionality.

### Special Characters in Conditions
If you encounter issues with conditions like `contains` or `endsWith`, especially with special characters like 
underscores (`_`), be aware that these might be ignored in some computations. Adjust your conditions accordingly.

### Sorting by multiple fields
Currently, sorting by multiple fields is not supported.

### Deleting Users with Shared Smart Playlists
If you encounter issues deleting users with shared Smart Playlists, check if the playlists are used by other users.
See [this issue](https://github.com/navidrome/navidrome/issues/3180) for details.

### Editing Playlists
To change the rules of a Smart Playlist, you need to edit the `.nsp` file directly 
(or use [Feishin](https://github.com/jeffvli/feishin/)). Changes are automatically detected during the next library scan.
The list of tracks in a Smart Playlist is read-only and cannot be edited directly.


## Additional Resources

### Fields
Here's a table  of fields you can use in your Smart Playlists:

| Field             | Description                            |
|-------------------|----------------------------------------|
| `title`           | Track title                            |
| `album`           | Album name                             |
| `hascoverart`     | Track has cover art                    |
| `tracknumber`     | Track number                           |
| `discnumber`      | Disc number                            |
| `year`            | Year of release                        |
| `date`            | Recording date                         |
| `originalyear`    | Original year                          |
| `originaldate`    | Original date                          |
| `releaseyear`     | Release year                           |
| `releasedate`     | Release date                           |
| `size`            | File size                              |
| `compilation`     | Compilation album                      |
| `dateadded`       | Date added to library                  |
| `datemodified`    | Date modified                          |
| `discsubtitle`    | Disc subtitle                          |
| `comment`         | Comment                                |
| `lyrics`          | Lyrics                                 |
| `sorttitle`       | Sorted track title                     |
| `sortalbum`       | Sorted album name                      |
| `sortartist`      | Sorted artist name                     |
| `sortalbumartist` | Sorted album artist name               |
| `albumtype`       | Album type                             |
| `albumcomment`    | Album comment                          |
| `catalognumber`   | Catalog number                         |
| `filepath`        | File path, relative to the MusicFolder |
| `filetype`        | File type                              |
| `duration`        | Track duration                         |
| `bitrate`         | Bitrate                                |
| `bitdepth`        | Bit depth                              |
| `bpm`             | Beats per minute                       |
| `channels`        | Audio channels                         |
| `loved`           | Track is loved                         |
| `dateloved`       | Date track was loved                   |
| `lastplayed`      | Date track was last played             |
| `playcount`       | Number of times track was played       |
| `rating`          | Track rating                           |

##### Notes
- Dates must be in the format `"YYYY-MM-DD"`.
- Booleans must not be enclosed in quotes. Example: `{ "is": { "loved": true } }`.
- `filepath` is relative to your music library folder. Ensure your paths are correctly specified without the `/music`
prefix (or whatever value you set in `MusicFolder`).


Any tags imported from the music files, that are not listed above, can be also used as fields in your Smart Playlists.
Check the [complete list of tags](https://github.com/navidrome/navidrome/blob/master/resources/mappings.yaml) imported 
by navidrome. You can also add your own custom tags to your music files and use them in your Smart Playlists. 
Check the `Tags` section in the [configuration options page](/docs/usage/configuration-options) for more information.

### Operators

Here's a table of operators you can use in your Smart Playlists:

| Operator        | Description      | Argument type                     |
|-----------------|------------------|-----------------------------------|
| `is`            | Equal            | String, Number, Boolean           |
| `isNot`         | Not equal        | String, Number, Boolean           |
| `gt`            | Greater than     | Number                            |
| `lt`            | Less than        | Number                            |
| `contains`      | Contains         | String                            |
| `notContains`   | Does not contain | String                            |
| `startsWith`    | Starts with      | String                            |
| `endsWith`      | Ends with        | String                            |
| `inTheRange`    | In the range     | Array of two numbers or dates     |
| `before`        | Before           | Date (`"YYYY-MM-DD"`)             |
| `after`         | After            | Date (`"YYYY-MM-DD"`)             |
| `inTheLast`     | In the last      | Number of days                    |
| `notInTheLast`  | Not in the last  | Number of days                    |
| `inPlaylist`    | In playlist      | Another playlist's ID (see below) |
| `notInPlaylist` | Not in playlist  | Another playlist's ID (see below) |

The nature of the field determines the argument type. For example, `year` and `tracknumber` require a number,
while `title` and `album` require a string.

To get a playlist's ID to be used in `inPlaylist` and `notInPlaylist`, navigate to the playlist in the Navidrome UI 
and check the URL. The ID is the last part of the URL after the `/playlists/` path:

{{< imgproc playlist_url Fit "1000x1000" />}}

