---
title: "Navidrome Configuration Options"
linkTitle: "Configuration Options"
date: 2017-01-06
weight: 10
description: >
  How to customize Navidrome to your environment
---

Navidrome allows some customization using environment variables, loading from a configuration file
or using command line arguments.

## Configuration File

{{< alert >}}
Some options are only configurable using a configuration file. If you are using environment variables 
(ex: with Docker), you may not be able to set all options.

If you want to use a configuration file with Docker, you can do so by creating a `navidrome.toml` config file in the 
host folder that is mapped to your `/data` volume, and set the env var `ND_CONFIGFILE=/data/navidrome.toml`.
{{< /alert >}}

Navidrome tries to load the configuration from a `navidrome.toml` file in the current working
directory, if it exists. You can create this file and put any of the [configuration options below](#available-options)
in it. Example of a configuration file (select your OS):

{{< tabpane >}}
{{< tab header="**Example**:" disabled=true />}}
{{< tab header="Windows" lang="windows" highlight="guessSyntax=true">}}
# This is just an example! Please see available options to customize Navidrome for your needs at
# https://www.navidrome.org/docs/usage/configuration-options/#available-options

LogLevel = 'DEBUG'
ScanSchedule = '@every 24h'
TranscodingCacheSize = '150MiB'

# IMPORTANT: Use single quotes for paths in Windows
MusicFolder = 'C:\Users\JohnDoe\Music'

# Set this to the path of your ffmpeg executable
FFmpegPath = 'C:\Program Files\ffmpeg\bin\ffmpeg.exe'
{{< /tab >}}
{{< tab header="macOS" lang="macos" >}}
# This is just an example! Please see available options to customize Navidrome for your needs at
# https://www.navidrome.org/docs/usage/configuration-options/#available-options

LogLevel = 'DEBUG'
ScanSchedule = '@every 24h'
TranscodingCacheSize = '150MiB'
MusicFolder = '/Users/JohnDoe/Music'

# This is the default path for Homebrew installed ffmpeg
FFmpegPath = '/usr/local/bin/ffmpeg'
{{< /tab >}}
{{< tab header="Unix-based systems" lang="unix" >}}
# This is just an example! Please see available options to customize Navidrome for your needs at
# https://www.navidrome.org/docs/usage/configuration-options/#available-options

LogLevel = 'DEBUG'
ScanSchedule = '@every 24h'
TranscodingCacheSize = '150MiB'
MusicFolder = '/mnt/music'
{{< /tab >}}
{{< /tabpane >}}

You can also specify a different path for the configuration file, using the `-c/--configfile` option.
Navidrome can load the configuration from `toml`, `json`, `yml` and `ini` files.

The example below assume you have created a `navidrome.toml` file in your home directory:

{{< tabpane >}}
{{< tab header="**Example**:" disabled=true />}}
{{< tab header="Windows" lang="windows" >}}
C:\> navidrome --configfile "c:\User\JohnDoe\navidrome.toml"
{{< /tab >}}
{{< tab header="macOs" lang="macos" >}}
$ navidrome --configfile "/User/JohnDoe/navidrome.toml"
{{< /tab >}}
{{< tab header="Unix-based systems" lang="unix" >}}
$ navidrome --configfile "/home/johndoe/navidrome.toml"
{{< /tab >}}
{{< /tabpane >}}

## Command Line Arguments

You can set most of the [config options below](#available-options) passing arguments to `navidrome` executable.

The example below shows how to set the `MusicFolder` using the command line, assuming you have your music library
under your home directory:

{{< tabpane >}}
{{< tab header="**Example**:" disabled=true />}}
{{< tab header="Windows" lang="windows" >}}
C:\> navidrome --musicfolder "c:\User\JohnDoe\Music"
{{< /tab >}}
{{< tab header="macOs" lang="macos" >}}
$ navidrome --musicfolder "/User/JohnDoe/Music"
{{< /tab >}}
{{< tab header="Unix-based systems" lang="unix" >}}
$ navidrome --musicfolder "/mnt/music"
{{< /tab >}}
{{< /tabpane >}}

Please note that command line arguments must be **all lowercase**. For a list of all available command line options,
just call `navidrome --help`.

## Environment Variables

Any configuration option can be set as an environment variable, just add a the prefix `ND_` and
make it all uppercase. Ex: `ND_LOGLEVEL=debug`. See below for all available options

## Available Options

### Basic configuration

| In config file          | As an env var                | Description                                                                                                         | Default Value                 |
|-------------------------|------------------------------|---------------------------------------------------------------------------------------------------------------------|-------------------------------|
|                         | `ND_CONFIGFILE`              | Load configurations from an external config file                                                                    | `"./navidrome.toml"`          |
| MusicFolder             | `ND_MUSICFOLDER`             | Folder where your music library is stored. Can be read-only                                                         | `"./music"`                   |
| DataFolder              | `ND_DATAFOLDER`              | Folder to store application data (DB)                                                                               | `"./data"`                    |
| CacheFolder             | `ND_CACHEFOLDER`             | Folder to store cache data (transcoding, images...)                                                                 | `"<DataFolder>/cache"`        |
| LogLevel                | `ND_LOGLEVEL`                | Log level. Useful for troubleshooting. Possible values: `error`, `warn`, `info`, `debug`, `trace`                   | `"info"`                      |
| Address                 | `ND_ADDRESS`                 | Address the server will bind to. Can be an IPv4, IPv6 or a UNIX socket file (`unix:/path/to/file`)                  | `0.0.0.0` and `::` (all IPs)  |
| BaseUrl                 | `ND_BASEURL`                 | Base URL to configure Navidrome behind a proxy (examples: `/music`, `https://music.example.com`)                    | _Empty_                       |
| Port                    | `ND_PORT`                    | HTTP port Navidrome will listen to                                                                                  | `4533`                        |
| EnableInsightsCollector | `ND_ENABLEINSIGHTSCOLLECTOR` | Controls whether the server will run its [Anonymous Data Collection][insights] feature to help improve the project. | `true`                        |

### Advanced configuration

<!-- This table is easier to be edited when Word Wrap is toggled off. Please keep it sorted -->

| In config file                                 | As an environment variable                       | Description                                                                                                                                                                                                                                                                                                                           | Default Value                                                               |
|------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| AlbumPlayCountMode                             | `ND_ALBUMPLAYCOUNTMODE`                          | Change how album play count is computed. When set to `"normalized"`, album play count will be divided by the number of album tracks                                                                                                                                                                                                   | `"absolute"`                                                                |
| AuthRequestLimit[\*][limit-login-attempts]     | `ND_AUTHREQUESTLIMIT`                            | How many login requests can be processed from a single IP during the `AuthWindowLength`. Set to `0` to disable the limit rater                                                                                                                                                                                                        | `5`                                                                         |
| AuthWindowLength[\*][limit-login-attempts]     | `ND_AUTHWINDOWLENGTH`                            | Window Length for the authentication rate limit                                                                                                                                                                                                                                                                                       | `"20s"`                                                                     |
| AutoImportPlaylists                            | `ND_AUTOIMPORTPLAYLISTS`                         | Enable/disable `.m3u` playlist auto-import                                                                                                                                                                                                                                                                                            | `true`                                                                      |
| DefaultPlaylistPublicVisibility                | `ND_DEFAULTPLAYLISTPUBLICVISIBILITY`             | Set imported playlists as public by default                                                                                                                                                                                                                                                                                           | `false`                                                                     |
| ArtistArtPriority[\*][artistcoverart]          | `ND_ARTISTARTPRIORITY`                           | Configure the order to look for artist images.                                                                                                                                                                                                                                                                                        | `"artist.*, album/artist.*, external"`                                      |
| Backup.Path                                    | `ND_BACKUP_PATH`                                 | Path to store backups. Set to `""` to disable backups                                                                                                                                                                                                                                                                                 | `""` (disabled)                                                             |
| Backup.Schedule                                | `ND_BACKUP_SCHEDULE`                             | Schedule for automatic backups. Use [Cron syntax](https://en.wikipedia.org/wiki/Cron#CRON_expression)                                                                                                                                                                                                                                 | `""` (disabled)                                                             |
| Backup.Count                                   | `ND_BACKUP_COUNT`                                | Number of backups to keep                                                                                                                                                                                                                                                                                                             | `0` (disabled)                                                              |
| CoverArtPriority[\*][albumcoverart]            | `ND_COVERARTPRIORITY`                            | Configure the order to look for cover art images. Use special `embedded` value to get embedded images from the audio files                                                                                                                                                                                                            | `cover.*, folder.*, front.*, embedded, external`                            |
| CoverJpegQuality                               | `ND_COVERJPEGQUALITY`                            | Set JPEG quality percentage for resized cover art images                                                                                                                                                                                                                                                                              | `75`                                                                        |
| DefaultDownsamplingFormat                      | `ND_DEFAULTDOWNSAMPLINGFORMAT`                   | Format to transcode to when client requests downsampling (specify maxBitrate without a format)                                                                                                                                                                                                                                        | `"opus"`                                                                    |
| DefaultLanguage                                | `ND_DEFAULTLANGUAGE`                             | Sets the default language used by the UI when logging in from a new browser. This value must match one of the file names in the [resources/i18n][i18n]. Ex: for Chinese Simplified it has to be `zh-Hans` (case sensitive)                                                                                                            | `"en"`                                                                      |
| DefaultTheme                                   | `ND_DEFAULTTHEME`                                | Sets the default theme used by the UI when logging in from a new browser. This value must match one of the options in the UI                                                                                                                                                                                                          | `"Dark"`                                                                    |
| EnableArtworkPrecache                          | `ND_ENABLEARTWORKPRECACHE`                       | Enable image pre-caching of new added music                                                                                                                                                                                                                                                                                           | `true`                                                                      |
| EnableCoverAnimation                           | `ND_ENABLECOVERANIMATION`                        | Controls whether the player in the UI will animate the album cover (rotation)                                                                                                                                                                                                                                                         | `true`                                                                      |
| EnableDownloads                                | `ND_ENABLEDOWNLOADS`                             | Enable the option in the UI to download music/albums/artists/playlists from the server                                                                                                                                                                                                                                                | `true`                                                                      |
| EnableExternalServices                         | `ND_ENABLEEXTERNALSERVICES`.                     | Set this to `false` to completely disable ALL external integrations, including the [anonymous data collection][insights] and the nice login background images                                                                                                                                                                         | `true`                                                                      |
| EnableFavourites                               | `ND_ENABLEFAVOURITES`                            | Enable toggling "Heart"/"Loved" for songs/albums/artists in the UI (maps to "Star"/"Starred" in Subsonic Clients)                                                                                                                                                                                                                     | `true`                                                                      |
| EnableGravatar                                 | `ND_ENABLEGRAVATAR`                              | Use [Gravatar](https://gravatar.com/) images as the user profile image. Needs the user's email to be filled                                                                                                                                                                                                                           | `false`                                                                     |
| EnableLogRedacting                             | `ND_ENABLELOGREDACTING`                          | Whether or not sensitive information (like tokens and passwords) should be redacted (hidden) in the logs                                                                                                                                                                                                                              | `true`                                                                      |
| EnableMediaFileCoverArt[\*][mediafilecoverart] | `ND_ENABLEMEDIAFILECOVERART`                     | If set to false, it will return the album CoverArt when a song CoverArt is requested                                                                                                                                                                                                                                                  | `true`                                                                      |
| EnableReplayGain                               | `ND_ENABLEREPLAYGAIN`                            | Enable ReplayGain options in the UI                                                                                                                                                                                                                                                                                                   | `true`                                                                      |
| EnableSharing                                  | `ND_ENABLESHARING`                               | Enable the Sharing feature                                                                                                                                                                                                                                                                                                            | `false`                                                                     |
| EnableStarRating                               | `ND_ENABLESTARRATING`                            | Enable 5-star ratings in the UI                                                                                                                                                                                                                                                                                                       | `true`                                                                      |
| EnableTranscodingConfig[\*][transcoding]       | `ND_ENABLETRANSCODINGCONFIG`                     | Enables transcoding configuration in the UI                                                                                                                                                                                                                                                                                           | `false`                                                                     |
| EnableUserEditing                              | `ND_ENABLEUSEREDITING`                           | Enable regular users to edit their details and change their password                                                                                                                                                                                                                                                                  | `true`                                                                      |
| FFmpegPath                                     | `ND_FFMPEGPATH`                                  | Path to `ffmpeg` executable. Use it when Navidrome cannot find it, or you want to use a specific version                                                                                                                                                                                                                              | _Empty_ (search in the PATH)                                                |
| GATrackingID                                   | `ND_GATRACKINGID`                                | Send basic info to your own Google Analytics account. Must be in the format `UA-XXXXXXXX`                                                                                                                                                                                                                                             | _Empty_ (disabled)                                                          |
| HTTPSecurityHeaders.CustomFrameOptionsValue    | `ND_HTTPSECURITYHEADERS_CUSTOMFRAMEOPTIONSVALUE` | Allows the `X-Frame-Options` header value to be set with a custom value. Ex: `"SAMEORIGIN"`                                                                                                                                                                                                                                           | `"DENY"`                                                                    |
| IgnoredArticles                                | `ND_IGNOREDARTICLES`                             | List of ignored articles when sorting/indexing artists                                                                                                                                                                                                                                                                                | `"The El La Los Las Le Les Os As O A"`                                      |
| ImageCacheSize                                 | `ND_IMAGECACHESIZE`                              | Size of image (art work) cache. Set to `"0"` to disable cache                                                                                                                                                                                                                                                                         | `"100MB"`                                                                   |
| Jukebox.Enabled                                | `ND_JUKEBOX_ENABLED`                             | Enable Jukebox mode (play audio on server's hardware) Click [here][jukebox-mode] for details                                                                                                                                                                                                                                          | `false`                                                                     |
| Jukebox.AdminOnly                              | `ND_JUKEBOX_ADMINONLY`                           | By default, Jukebox mode is only available to Admins. Set this option to `false` to allow any valid user to control it                                                                                                                                                                                                                | `true`                                                                      |
| Jukebox.Devices                                | _(cannot be set as an environment variable)_     | List of devices that can be used by the Jukebox. Click [here][jukebox-config] for details                                                                                                                                                                                                                                             | _Empty_ (auto detect)                                                       |
| Jukebox.Default                                | `ND_JUKEBOX_DEFAULT`                             | Device to use for Jukebox mode, if there are multiple Jukebox.Devices entries. Click [here][jukebox-config] for details                                                                                                                                                                                                               | _Empty_ (auto detect)                                                       |
| LastFM.Enabled                                 | `ND_LASTFM_ENABLED`                              | Set this to `false` to completely disable Last.fm integration                                                                                                                                                                                                                                                                         | `true`                                                                      |
| LastFM.ApiKey[\*][lastfm-integration]          | `ND_LASTFM_APIKEY`                               | Last.fm API Key                                                                                                                                                                                                                                                                                                                       | _Empty_                                                                     |
| LastFM.Secret[\*][lastfm-integration]          | `ND_LASTFM_SECRET`                               | Last.fm API Secret                                                                                                                                                                                                                                                                                                                    | _Empty_                                                                     |
| LastFM.Language                                | `ND_LASTFM_LANGUAGE`                             | [Two letter-code for language][language-codes] to be used to retrieve biographies from Last.fm                                                                                                                                                                                                                                        | `"en"`                                                                      |
| ListenBrainz.BaseURL                           | `ND_LISTENBRAINZ_BASEURL`                        | Set this to override the default ListenBrainz base URL (useful with self-hosted solutions like Maloja[\*][maloja]                                                                                                                                                                                                                     | `https://api.listenbrainz.org/1/`                                           |
| ListenBrainz.Enabled                           | `ND_LISTENBRAINZ_ENABLED`                        | Set this to `false` to completely disable ListenBrainz integration                                                                                                                                                                                                                                                                    | `true`                                                                      |
| MaxSidebarPlaylists                            | `ND_MAXSIDEBARPLAYLISTS`                         | Set the maximum number of playlists shown in the UI's sidebar. Note that a very large number can cause UI performance issues.                                                                                                                                                                                                         | `100`                                                                       |
| MPVPath                                        | `ND_MPVPATH`                                     | Path to `mpv` executable. Used for [Jukebox mode][jukebox-mode]                                                                                                                                                                                                                                                                       | _Empty_ (search in PATH)                                                    |
| MPVCmdTemplate                                 | `ND_MPVCMDTEMPLATE`                              | Cmd template used to construct the call of the `mpv` executable. Used for [Jukebox mode][jukebox-cmd]                                                                                                                                                                                                                                 | `mpv --audio-device=%d --no-audio-display --pause %f --input-ipc-server=%s` |
| PasswordEncryptionKey[\*][encrypt-passwords]   | `ND_PASSWORDENCRYPTIONKEY`                       | Passphrase used to encrypt passwords in the DB. Click [here][encrypt-passwords] for details                                                                                                                                                                                                                                           | -                                                                           |
| PID.Album                                      | `ND_PID_ALBUM`                                   | Set the tag(s) to use as the Album ID. Click [here][pids] for details                                                                                                                                                                                                                                                                 | `musicbrainz_albumid\|albumartistid,album,albumversion,releasedate`         |
| PID.Track                                      | `ND_PID_TRACK`                                   | Set the tag(s) to use as the Track ID. Click [here][pids] for details                                                                                                                                                                                                                                                                 | `musicbrainz_trackid\|albumid,discnumber,tracknumber,title`                 |
| PlaylistsPath                                  | `ND_PLAYLISTSPATH`                               | Limit where to search for and import playlists from. Can be a list of folders/globs (separated by `:` (or `;` on Windows). Paths **MUST** be relative to `MusicFolder`                                                                                                                                                                | _Empty_  (meaning any playlist files in your library will be imported)      |
| PreferSortTags                                 | `ND_PREFERSORTTAGS`                              | Use Sort_* tags to sort columns in the UI.                                                                                                                                                                                                                                                                                            | `false`                                                                     |
| Prometheus.Enabled                             | `ND_PROMETHEUS_ENABLED`                          | Enable extra endpoint with [Prometheus](https://prometheus.io/docs/introduction/overview/) metrics.                                                                                                                                                                                                                                   | `false`                                                                     |
| Prometheus.MetricsPath                         | `ND_PROMETHEUS_METRICSPATH`                      | Custom path for Prometheus metrics. Useful for blocking unauthorized metrics requests.                                                                                                                                                                                                                                                | `"/metrics"`                                                                |
| RecentlyAddedByModTime                         | `ND_RECENTLYADDEDBYMODTIME`                      | Uses music files' modification time when sorting by "Recently Added". Otherwise use import time                                                                                                                                                                                                                                       | `false`                                                                     |
| ReverseProxyUserHeader[\*][reverse-proxy-auth] | `ND_REVERSEPROXYUSERHEADER`                      | HTTP header containing the user name from an authenticating proxy. Click [here][reverse-proxy-config] for details.                                                                                                                                                                                                                    | `"Remote-User"`                                                             |
| ReverseProxyWhitelist[\*][reverse-proxy-auth]  | `ND_REVERSEPROXYWHITELIST`                       | Comma separated list of IP CIDRs (or when listening on a UNIX socket the special value `@`) which are allowed to use reverse proxy authentication. Empty means "deny all". Click [here][reverse-proxy-config] for details. Note: This option is unnecessary for most reverse proxy setups, only for *authenticating* reverse proxies. | _Empty_                                                                     |
| Scanner.Enabled                                | `ND_SCANNER_ENABLED`                             | Enable/disable the scanner. Set to `false` to disable automatic scanning of the music library.                                                                                                                                                                                                                                        | `true`                                                                      |
| Scanner.Schedule                               | `ND_SCANNER_SCHEDULE`                            | Schedule for automatic scans. Use [Cron syntax][cronspec]                                                                                                                                                                                                                                                                             | `0` (disabled)                                                              |
| Scanner.WatcherWait                            | `ND_SCANNER_WATCHERWAIT`                         | Time to wait after a file change is detected before starting a scan. Useful to avoid scanning incomplete files. Set it to `0` to disable the watcher                                                                                                                                                                                  | `"5s"`                                                                      |
| Scanner.ScanOnStartup                          | `ND_SCANNER_SCANONSTARTUP`                       | Enable/disable scanning the music library on startup. Set to `false` to disable                                                                                                                                                                                                                                                       | `true`                                                                      |
| SearchFullString                               | `ND_SEARCHFULLSTRING`                            | Match query strings anywhere in searchable fields, not only in word boundaries. Useful for languages where words are not space separated                                                                                                                                                                                              | `false`                                                                     |
| SessionTimeout                                 | `ND_SESSIONTIMEOUT`                              | How long Navidrome will wait before closing web ui idle sessions                                                                                                                                                                                                                                                                      | `"24h"`                                                                     |
| ShareURL                                       | `ND_SHAREURL`                                    | Base URL for shared links. Useful when your server address is not a public (ex: when using Tailscale). See discussion [here][share-url]                                                                                                                                                                                               | _Empty_ (use server address)                                                |
| SmartPlaylistRefreshDelay                      | `ND_SMARTPLAYLISTREFRESHDELAY`                   | How often to refresh Smart Playlists. Check the [smart playlists][smart-playlists] docs                                                                                                                                                                                                                                               | `"5s"`                                                                      |
| Spotify.ID[\*][spotify-integration]            | `ND_SPOTIFY_ID`                                  | Spotify Client ID. Required if you want Artist images                                                                                                                                                                                                                                                                                 | _Empty_                                                                     |
| Spotify.Secret[\*][spotify-integration]        | `ND_SPOTIFY_SECRET`                              | Spotify Client Secret. Required if you want Artist images                                                                                                                                                                                                                                                                             | _Empty_                                                                     |
| Subsonic.AppendSubtitle                        | `ND_SUBSONIC_APPENDSUBTITLE`                     | Append the `subtitle` tag to the song title in all Subsonic API responses                                                                                                                                                                                                                                                             | `true`                                                                      |
| Subsonic.ArtistParticipations                  | `ND_SUBSONIC_ARTISTPARTICIPATIONS`               | When Subsonic clients request artist's albums, include albums where the artist participates (ex: Various Artists compilations)                                                                                                                                                                                                        | `false`                                                                     |
| Subsonic.DefaultReportRealPath                 | `ND_SUBSONIC_DEFAULTREPORTREALPATH`              | Set to `true` to report the real path of the music files in the API. Can be customized individually for each client/player. This can be a security risk, so it is disabled by default                                                                                                                                                 | `false`                                                                     |
| Subsonic.LegacyClients                         | `ND_SUBSONIC_LEGACYCLIENTS`                      | List of clients that does not work with the new [OpenSubsonic][opensubsonic] API improvements.                                                                                                                                                                                                                                        | `"DSub"`                                                                    |
| Tags                                           | _(cannot be set as an environment variable)_     | Configure custom tags to be imported from your music files. Click [here][custom-tags] for details                                                                                                                                                                                                                                     | _Empty_                                                                     |
| TLSCert                                        | `ND_TLSCERT`                                     | Path for the TLS certificate file, which should include the [signature chain](https://pkg.go.dev/net/http#Server.ServeTLS) if any                                                                                                                                                                                                     | _Empty_ (disable TLS)                                                       |
| TLSKey                                         | `ND_TLSKEY`                                      | Path for the TLS key file                                                                                                                                                                                                                                                                                                             | _Empty_ (disable TLS)                                                       |
| TranscodingCacheSize                           | `ND_TRANSCODINGCACHESIZE`                        | Size of transcoding cache. Set to `"0"` to disable cache                                                                                                                                                                                                                                                                              | `"100MB"`                                                                   |
| UILoginBackgroundUrl                           | `ND_UILOGINBACKGROUNDURL`                        | Change background image used in the Login page                                                                                                                                                                                                                                                                                        | _random music image from this [Unsplash.com][unsplash] collection_          |
| UIWelcomeMessage                               | `ND_UIWELCOMEMESSAGE`                            | Add a welcome message to the login screen                                                                                                                                                                                                                                                                                             | _Empty_                                                                     |
| UnixSocketPerm                                 | `ND_UNIXSOCKETPERM`                              | Set file permissions for Unix Socket File.[\*][reverse-proxy-auth]                                                                                                                                                                                                                                                                    | `"0660"`                                                                    |

#### Notes

- Durations are specified as a number and a unit suffix, such as "24h", "30s" or "1h10m". Valid
  time units are "s", "m", "h".
- Sizes are specified as a number and an optional unit suffix, such as "1GB" or "150 MiB". Default
  unit is bytes. Note: "1KB" == "1000", "1KiB" == "1024"
- Transcoding can be required in some situations. For example: trying to play
  a [WMA](https://en.wikipedia.org/wiki/Windows_Media_Audio) file in a webbrowser, will **only** work for natively
  supported formats by the browser you are using. (so playing that with Mozilla Firefox on Linux, will not work. Mozilla
  even has their [own guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs) about audio
  codecs).

[limit-login-attempts]: /docs/usage/security#limit-login-attempts  "Login Limit Rating"
[transcoding]:          /docs/usage/security#transcoding-configuration "Transcoding configuration"
[language-codes]:       https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes "List of language codes"
[spotify-integration]:  /docs/usage/external-integrations/#spotify
[lastfm-integration]:   /docs/usage/external-integrations/#lastfm
[encrypt-passwords]:    /docs/usage/security/#encrypted-passwords
[reverse-proxy-auth]:   /docs/usage/security/#reverse-proxy-authentication "Reverse Proxy Authentication"
[reverse-proxy-config]: /docs/usage/reverse-proxy
[albumcoverart]:        /docs/usage/artwork/#albums
[artistcoverart]:        /docs/usage/artwork/#artists
[mediafilecoverart]:    /docs/usage/artwork/#mediafiles
[jukebox-mode]:         /docs/usage/jukebox
[jukebox-config]:       /docs/usage/jukebox/#configuration
[jukebox-cmd]:          /docs/usage/jukebox/#the-mpvcmdtemplate--snapcast-integration
[maloja]:               https://github.com/krateng/maloja
[i18n]:                 https://github.com/navidrome/navidrome/tree/master/resources/i18n
[share-url]:            https://github.com/navidrome/navidrome/discussions/3117
[insights]:             /docs/getting-started/insights
[smart-playlists]:      /docs/usage/smartplaylists
[custom-tags]:          /docs/usage/customtags
[pids]:                 /docs/usage/pids
[cronspec]:             https://en.wikipedia.org/wiki/Cron#CRON_expression
[unsplash]:             https://unsplash.com/collections/20072696/navidrome
[opensubsonic]:         https://opensubsonic.netlify.app/
