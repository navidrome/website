---
title: Tagging Guidelines
linkTitle: Tagging Guidelines
date: 2017-01-02
weight: 10
description: >
    Learn how to tag your music library for optimal use with Navidrome, including best practices for tagging files, 
    handling multiple artists, and using tag editors.
---

## Why Proper Tagging is Important
Navidrome organizes your music library *entirely* based on the metadata tags in your audio files. Unlike some music 
players, it does not use folder names or file names to group tracks 
([why?](http://localhost:1313/docs/faq/#-can-you-add-a-browsing-by-folder-optionmode-to-navidrome)). 
This means that having clean and consistent tags is crucial for your music to display correctly. 
Proper tagging ensures that albums aren't split up, artists are listed correctly, and you can easily browse or search 
for your music in Navidrome.

Good tagging practices not only make your music library more enjoyable to use, but also make it future-proof: 
If you ever switch to a different music player/server, or want to use a different music management tool, having 
well-tagged files will make the transition smoother.

## Tagging Basics and Best Practices

### Consistent and Complete Metadata
- **Fill in essential tags for every song:** At minimum, each music file should have the **Title** (song name), 
    **Artist**, **Album**, **Album Artist**, and **Track Number**. Optionally include **Genre**, **Year/Date** and 
    **Disc Number** (for multi-disc albums). Consistent use of these fields allows Navidrome to accurately group 
    and identify your music.
- **Be consistent with naming:** Use the same spelling and punctuation for artist and album names across all tracks. For example, decide whether an artist is "AC/DC" or "ACDC", "The Beatles" or "Beatles", and stick to one. Consistent naming prevents duplicate entries for what is actually the same artist or album.
- **Avoid unknown or blank tags:** Make sure important fields aren’t left blank or set to generic values like "Unknown Artist". Tracks with missing tags may be hard to find or get grouped incorrectly in Navidrome.

### Key Metadata Fields and Usage
Each tag field has a specific purpose. Here are the important ones and how to use them:
- **Title**: The name of the song. *(Example: "Imagine")*
- **Artist**: The performing artist(s) for the song. *(Example: "John Lennon")* If a track has multiple artists, 
  include all of them here (see *Handling Multiple Artists* below).
- **Album**: The name of the album the song belongs to. All tracks in the same album should have exactly the same 
  Album tag.
- **Album Artist**: The primary artist for the album. This is usually the album’s main artist or group, or 
  "Various Artists" for a compilation. Every track in an album should share the same Album Artist so Navidrome knows 
  they belong to one album. For example, on a soundtrack or compilation album, set Album Artist to "Various Artists".
  If a track has multiple album artists (like collaboration albums), include all of them here 
  (see *Handling Multiple Artists* below).
- **Track Number**: The song’s track number on the album. This can be just the track number (like "5") or a fraction 
  like "5/12" to indicate track 5 of 12. Use leading zeros if your tag editor requires (e.g., "05"). Proper track 
  numbers help Navidrome sort songs in the album’s order.
- **Disc Number**: If an album spans multiple discs, use this to differentiate disc 1, disc 2, etc. For example, 
  "1/2" for Disc 1 of 2. Ensure all tracks that are on the same disc have the same disc number, and all tracks share 
  the Album name. Navidrome will group multi-disc albums together and may show disc divisions.
- **Year/Date**: The year (or full date) of the album’s release. While not strictly required, the year is useful 
  information and some views or clients might use it. Use a four-digit year (and if using month/day, keep format consistent).
- **Genre**: The genre of the music (e.g., Rock, Jazz). This is a multi-valued field and can help when browsing or 
  creating genre-based playlists.
- **Compilation (Part of a Compilation)**: A special flag for various-artists albums. For a “Various Artists” 
  compilation album, set this tag on all its tracks so Navidrome treats them as one album. In MP3/ID3 tagging,
  this is often labeled "Part of a Compilation" (technically the `TCMP` frame) which should be set to "1" (true). 
  In FLAC/Vorbis tags, use a tag named `COMPILATION` with value "1". Not all editors show this field explicitly, 
  but many (like iTunes or Picard) will mark an album as a compilation for you if you specify it. If you can't find 
  this tag, simply ensuring Album Artist is "Various Artists" usually works, but using the compilation tag is a best practice.

{{< alert "info" >}}
Here's a [complete list of tags](https://github.com/navidrome/navidrome/blob/master/resources/mappings.yaml) 
that Navidrome import and use by default. For adding custom tags, see the [Custom Tags](/docs/usage/customtags) page.
{{< /alert >}}

### File and Folder Naming (Optional but Helpful)
Navidrome ignores actual file names and folder structure when organizing music (it relies on tags), but a clear 
naming scheme is still recommended for your own sanity and compatibility with other tools:
- Use a folder structure like `Artist/Album/` for your files, and file names like `"01 - Song Title.mp3"`. 
  For example: `Music/Queen/A Night at the Opera/01 - Death on Two Legs.mp3`. This isn't required for Navidrome, but 
  keeping your files organized logically makes management easier and reduces confusion.
- Keep naming conventions consistent. For instance, decide on a pattern for file names 
  (`Track - Title` or `Artist - Title`, etc.) and apply it across your library. Similarly, maintain consistent folder 
  naming (avoid having one folder called "Greatest Hits" and another called "GreatestHits" for example).
- If you use a tool like Picard or MediaMonkey, you can often configure it to rename and sort files into folders based 
  on tags automatically. This can help enforce consistency after you’ve tagged everything.
- Remember, if you do rename or move files, Navidrome will update on the next scan (since it scans the library folder). 
  Just make sure the tags inside the files are correct, because that's still what Navidrome will use to display your music.

### Album Art Handling
Including album cover art enhances the Navidrome experience. Here's how to manage artwork:
- **Embed cover art in audio files**: Embedding the album cover in each music file's tags is a reliable way to ensure 
    Navidrome finds it. Most tagging tools allow you to add an image (JPEG/PNG) to the file’s metadata. Navidrome will 
    display embedded cover art when browsing albums or playing songs.
- **Use folder images**: Additionally, save the album cover image as a file in the album’s folder (common names are 
  `cover.jpg`, `folder.jpg`, or `front.png`). By default, Navidrome looks for images with those names. If it finds one, 
  it will use it for the album cover. This is useful if you prefer not to embed large images in every file, or to 
  provide artwork for players that look for folder images.
- **Image quality**: Use reasonably sized images. 500x500 to 1000x1000 pixels is usually plenty. Extremely large 
  images (e.g., 3000x3000) will work, but keep in mind they take more space and can make the UI sluggish. Navidrome 
  will cache thumbnails for performance, but it's good practice not to go overboard.
- **Consistency**: Ensure all tracks of an album have the same album art. If you embed art, embed the same image in 
  each track of that album (most tools can do this in batch). If you're using a folder image, one image in the folder 
  is enough for all songs in that album.
- **Handling missing art**: If you don't have art for an album, Navidrome might try to fetch it from the internet 
  (Last.fm or Spotify) if enabled, but it's best to supply your own for completeness and offline use. Taking the time 
  to add cover art makes browsing much nicer.

{{% alert "info" %}}
Organizing your music in a logical and consistent folder structure can also help Navidrome find your artwork files.
Check the [Artwork Resolution](/docs/usage/artwork) page for details.
{{% /alert %}}


## Handling Multiple Artists and Collaborations
Many songs have multiple contributing artists (for example, a duet, or a track featuring a guest artist). Properly 
tagging these ensures all artists are recognized by Navidrome and that albums don’t get split unexpectedly.

- **List all artists in the Artist tag**: Include all primary artists for the track in the **Artist** field. Avoid 
putting featured artists in the song title. For example, prefer **Artist** = "Alice feat. Bob" and **Title** = 
"Sunshine" over putting the feat artist in the title. This way, Navidrome knows both Alice and Bob are artists on the 
track (and you’ll be able to find the song under both artists).
- **Use Album Artist for grouping**: If an album is by one main artist but has guest artists on some tracks, use the 
Album Artist tag to keep the album grouped. For instance, if Alice is the main artist for the album *Brighter Days*, 
but some songs are duets (Alice / Bob), set **Album Artist** = "Alice" on all tracks. The individual track’s Artist 
can be "Alice / Bob" or "Alice feat. Bob", but since Album Artist is consistent ("Alice"), Navidrome will show the 
album under Alice’s discography as one album. It will also list the album under Bob’s page, since he’s an artist on
some tracks.
- **"Various Artists" albums**: For compilations or soundtracks where each track is by a different artist, use 
**Album Artist** = "Various Artists" (and remember to set the Compilation tag as mentioned earlier). Navidrome 
will then list the album as a compilation, and not under one single artist. Within that album, it will display each 
track’s own artist.
- **Multiple artist tag fields**: Some formats let you have truly separate multiple artists:
    - In FLAC/OGG (Vorbis comments) and APE tags, you can add the ARTIST tag more than once. For example, one 
        ARTIST=Alice and another ARTIST=Bob. Navidrome will read both entries as two artists for the track.
    - In MP3 ID3v2.4, multiple artists are supported internally. Tagging software may allow you to input "Alice; Bob" 
      or a similar separator, and it will actually store two artist entries in the file. Navidrome can interpret those 
      properly.
      - In MP3 ID3v2.3 (the older format), there isn’t native support for multiple separate artists, so all names are 
        combined into one field. The convention is to separate them with a symbol like `" / "` or `"; "` 
        (depending on the software). For consistency, you might use "Artist1 feat. Artist2" format. Navidrome will 
        split the field into two artists based on the `" feat. "` separator.
- **Consistency in separators**: Ideally you would use multiple artist tags as described above. If you must use a 
    single text field for multiple artists (in formats that don't support multi-value tags), pick a separator and stick 
    with it. Common choices are `" feat. "`, `"; "`,  or `" / "`. For example, if you use "Artist1 feat. Artist2" for one song, 
    do the same wherever applicable, rather than sometimes using `"; "` or `" / "` arbitrarily.
- **Check Navidrome's behavior**: After tagging multi-artist tracks, do a library scan in Navidrome and see how it 
  displays. Navidrome might list the track under each artist's page (especially if using multi-valued tags). 
  If you find that a track isn't showing up under an artist as expected, you may need to adjust how the artists are 
  tagged (for instance, ensure there are truly separate artist tags or that the separator is recognized).
- **Featuring vs Primary Artist**: As a style note, some people only list the main artist in the Artist tag and put 
  "feat. Guest" in the Title. This keeps the library's primary artist list clean, but then the guest artist isn't 
  directly searchable. It's generally better for Navidrome to include *all* artists in the Artist tag field 
  (as separate entries or a combined string). That way, you can click or search the guest artist in Navidrome. 
  Use Album Artist to preserve the grouping under the main artist if needed.

**Example:** For a song **"Sunshine"** by **Alice** featuring **Bob** on the album *Brighter Days* (which is primarily Alice's album):
- In a FLAC (Vorbis comments) file, you might have tags:
  ```text
  TITLE=Sunshine  
  ARTIST=Alice  
  ARTIST=Bob  
  ALBUM=Brighter Days  
  ALBUMARTIST=Alice  
  TRACKNUMBER=7  
  ```
- In an MP3 with ID3v2.3, the tags could be:
  ```text
  Title: Sunshine  
  Artist: Alice / Bob  
  Album: Brighter Days  
  Album Artist: Alice  
  Track: 7  
  ```  
  In the FLAC example, there are two separate ARTIST fields (one for Alice, one for Bob). In the MP3 example, the 
  two artist names are combined in one field with a `" / "` separator. Both will display correctly in Navidrome, 
  but the FLAC method more explicitly preserves the two distinct artist entries.

{{% alert "info" %}}
The same rules for multi-valued tags and separators apply to other artist roles like Album Artist, Composers, Arrangers 
and even Genre. Use the same principles to ensure consistency.
{{% /alert %}}

## Differences in Tag Formats (ID3, Vorbis, APE, etc.)
Different audio file formats use different tagging standards. You don't need to know all the technical details, but it's 
useful to understand the basics so you can tag consistently:
- **MP3 (ID3 tags)**: MP3 files use ID3 tags (versions 2.3 and 2.4 are common). Most tagging tools default to ID3v2.3 
    for compatibility with older players. ID3v2.4 is a newer standard that supports features like multiple values in one 
    field. Navidrome can read both. If available, use ID3v2.4 for better multi-artist and multi-genre support. Key ID3 
    tag frames include:
    - *TIT2* (Title)
    - *TPE1* (Artist)
    - *TALB* (Album)
    - *TPE2* (Album Artist, in practice)
    - *TRCK* (Track number)
    - *TPOS* (Disc number, called "Part of a set")
    - *TYER/TDRC* (Year/Date)
    - *TCON* (Genre)
    - *TCMP* (Compilation flag)  
      You normally don't need to remember these codes; tag editors handle them for you. Just be aware that some older 
      software might not show an "Album Artist" field for MP3 because ID3v2.3 didn't officially have it (those tools 
      might be writing it as a custom tag or using TPE2).
- **FLAC, Ogg Vorbis, Opus (Vorbis comments)**: These formats use Vorbis Comments for tags. Vorbis comments are simple 
  "FIELD=Value" pairs and are very flexible. Common field names are in all caps by convention: e.g., `TITLE`, `ARTIST`, 
  `ALBUM`, `ALBUMARTIST`, `TRACKNUMBER`, `DISCNUMBER`, `DATE` (year), `GENRE`. You can have multiple instances 
  of a field to represent multiple values (e.g., two `ARTIST` lines). Vorbis comments don't have fixed frames 
  like ID3; you can even add non-standard fields (Picard, for example, can add a `MUSICBRAINZ_ALBUMID` tag for 
  its own use). The main thing is to use **standard field names** so that Navidrome (and other players) know 
  what to do with them. Navidrome will read these tags and support multi-valued fields natively.
- **APE tags**: APE is another tagging format, used primarily in Monkey's Audio (.ape files) and sometimes WavPack or 
  Musepack. APE tags also consist of key-value pairs (similar to Vorbis comments). Field names might be similar 
  (often not all-caps; could be "Artist", "Album", etc.). If you're dealing with APE files, just ensure your tag 
  editor writes the standard fields. APE tags, like Vorbis, allow multiple entries of the same field name as well. 
  One caveat: Some MP3 files might have APE tags attached (left over from old software or for ReplayGain data). 
  It's generally best to avoid having both ID3 and APE on the same MP3, as it can confuse some programs. 
  If you encounter this, use your tag tool to remove or synchronize one of them (Navidrome reads ID3 by default 
  for MP3).
- **MP4/M4A (AAC files)**: These use the MP4 container's metadata format (often called MP4 tags or atoms). 
    You’ll see tag codes like `©ART` (Artist), `©alb` (Album), `aART` (Album Artist), `trkn` (track number), 
    etc. Most tag editors (Picard, iTunes, etc.) let you edit these without worrying about the codes. Navidrome 
    fully supports M4A/MP4 metadata, so just make sure to fill in the equivalent fields (including Album Artist 
    and track numbers) and you're set.
- **WMA (Windows Media)**: Uses ASF tags. If you have WMA files, fill in the standard fields (Title, Artist, Album, 
  Album Artist, Track number, Year, Genre) in your tag editor. Navidrome will read those as well.
- **Other formats**: Navidrome supports many formats (MP3, FLAC, Ogg, Opus, AAC, WMA, APE, etc.). The best practice
  is to use a good tagging tool which provides a unified interface for editing tags, regardless of the underlying format. 
  The tool will handle mapping your input to the correct tag type for that file. As long as you fill out the tags 
  consistently in the software, you don't need to manually worry about the format differences — just be aware when 
  switching formats that the same concept might have a different technical name under the hood.

## Tagging Tools and Workflow
Because Navidrome is read-only with respect to your files’ metadata, you'll need to use external tools to edit tags. 
Here are some recommendations and tips on workflow:
- **Use a tag editor or music manager**: Pick a tool that fits your comfort level. For beginners, a user-friendly 
    tag editor with a GUI is ideal. Some popular options:
    - **MusicBrainz Picard** – *Free, open source (Windows/Mac/Linux).* Great for auto-tagging files by matching 
        them to the huge MusicBrainz database. Picard can lookup albums by track info or acoustic fingerprint, fill 
        in all tags (including Album Artist and album art), and even rename/move files based on a template. It's a 
        powerful tool that can greatly speed up tagging and ensure consistency.
    - **Mp3tag** – *Free (Windows, with a Mac version available).* Excellent for editing tags in bulk. You can 
      manually edit multiple files, copy/paste tag fields, or use online database lookups. Mp3tag has a simple 
      interface but lots of power under the hood.
    - **beets** – *Free, command-line (cross-platform).* Very powerful for auto-organizing and tagging using 
      MusicBrainz data, but it requires comfort with terminal commands. Great if you want automation and don't 
      mind writing a configuration.
    - *Other options:* **Kid3** (GUI, multi-platform), **MusicBee** (Windows, a player with strong tagging features), 
        **MediaMonkey** (Windows), **foobar2000** (Windows, has tagging capabilities), or even iTunes/Apple Music for 
          editing tags of files. All of these can write tags that Navidrome will read.
- **Workflow tips**:
    1. **Backup first**: Before mass editing tags, especially with auto-tagging tools, back up your music files. 
        Mistakes can happen, and you might not like the results of an automated tag rewrite.
    2. **Work album by album (or artist by artist)**: Load a manageable chunk of files in your tag editor 
         (for example, one album at a time). This ensures all tracks in an album get the same Album and 
         Album Artist, etc., and it's easier to spot and correct inconsistencies.
    3. **Use online databases**: Leverage tools like Picard to fetch tags and album art from databases. This can 
         fill in missing info and standardize spelling (for instance, ensuring `" feat. "` is used consistently for 
         "featuring").
    4. **Review and edit**: Even with Picard or other auto-taggers, double-check the tags before saving. Make sure 
         the album and artist names match your preferred format. Sometimes database entries have variations (like 
         an album title including a subtitle or different punctuation).
    5. **Save (write) tags**: Apply the changes and save the tags to the files. If you're renaming/moving files as 
         part of this (many tools can do so based on tags), ensure the files end up in the correct location 
         (your Navidrome music library folder). 
{{< alert color="warning" >}}
**Caution**: If you are retagging files that are already in Navidrome, avoid rettaging and moving in one step, as this 
could cause that Navidrome to lose track of the files. Instead, retag and save, rescan, then move the files and rescan 
again. See details [here](/docs/usage/pids/#handling-file-moves-and-retagging).
{{< /alert >}}
    6. **Rescan in Navidrome**: Navidrome usually auto-detects changes, but you can trigger a library rescan or 
         restart the server to be sure. Once scanned, check in the Navidrome interface that everything appears 
         as expected.
    7. **Iterate as needed**: If something looks wrong in Navidrome (e.g., an album is split into two entries, or a 
         track is missing artwork), go back to your tag editor to fix those tags and then re-save and rescan. 
         Common fixes include making Album Artist consistent, correcting typos or extra spaces, or adding missing 
         compilation flags.

- **Continuous tagging**: Make tagging part of your routine. When you add new music, tag it properly before (or immediately after) adding it to Navidrome. It's easier to keep a library organized from the start than to fix a messy library later.

### Picard specific tips
- In Picard’s settings, you can enable options to embed cover art *and* save a cover image file. Doing both 
    is ideal (embed for portability, and cover.jpg for any software that looks for it). Picard also allows scripting 
    for file naming — handy if you want to auto-organize your folders as mentioned.
- For a better integration with Navidrome, you can add the following scripts to your Picard configuration, to add 
  extra tags that can help Navidrome organize your library:
    ```shell
    # Album Version
    $set(musicbrainz_albumcomment,%_releasecomment%)
    $if(%_recordingcomment%, $set(subtitle,%_recordingcomment%))
    ```
    ```shell
    # Multiple artists
    $setmulti(albumartists,%_albumartists%)
    $setmulti(albumartistssort,%_albumartists_sort%)
    $setmulti(artistssort,%_artists_sort%)
    ```
    ```shell
    # Release and Original dates
    $set(releasedate,%date%)
    $set(date,%_recording_firstreleasedate%)
    $set(originaldate,%originaldate%)
    $delete(originalyear)
    ```

## Final Tips and Recap
- **Consistency is key**: Uniform tags result in a well-organized Navidrome library. If you notice duplicates or split 
    albums, it's almost always a tagging inconsistency — fix the tags and the issue will resolve.
- **Leverage Album Artist and Compilation tags**: These tags are your friends for ensuring albums stay together. 
  Always set Album Artist (even if it’s the same as Artist for a solo album), and use "Various Artists" + the 
  compilation flag for multi-artist albums.
- **Keep tags tidy**: Little details like extra spaces at the end of names or inconsistent capitalization can lead 
  to multiple entries (e.g., "The Beatles" vs "The Beatles "). Try to keep things tidy. Many tag editors can 
  batch-clean or case-correct tags.
- **Use Navidrome's strengths**: Navidrome reads a 
  [lot of tags](https://github.com/navidrome/navidrome/blob/master/resources/mappings.yaml) 
  (including comments, lyrics, grouping, mood, etc.). If you want to enrich your library, consider adding lyrics or 
  other info via your editor — Navidrome will display lyrics if present, for example.
- **Enjoy your music**: A bit of effort in tagging goes a long way. Once everything is tagged well, Navidrome 
  will present a beautiful, browsable collection. You’ll spend less time searching for songs or fixing metadata 
  and more time listening. Happy tagging!