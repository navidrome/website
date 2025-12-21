---
title: Multi-Library Support
linkTitle: Multi-Library
date: 2025-07-18
weight: 15
description: >
  Learn how to set up and manage multiple music libraries in Navidrome with user-specific access controls.
---

## Overview

Navidrome supports multiple music libraries since v0.58.0, allowing you to organize your music into separate collections with user-specific access controls. This feature is perfect for:

- Separating different types of content (music vs. audiobooks)
- Organizing by quality (lossy vs. lossless)
- Separating personal collections (family members, roommates)
- Organizing by genre or era (classical, jazz, modern)
- Managing different sources (official releases vs. bootlegs/live recordings)

## How Multi-Library Works

### Default Library

When Navidrome starts, it automatically creates a default library using your `MusicFolder` configuration. This becomes "Library 1" and all existing users automatically get access to it, ensuring backward compatibility.

### User Access Control

- **Admin users** automatically have access to all libraries
- **Regular users** must be explicitly granted access to libraries by an administrator
- Users can only see and access music from libraries they have permission to use
- Each user can switch between their accessible libraries using the library selector in the UI

### Data Isolation

- **Albums** are scoped to a single library; each library maintains its own set of albums and their songs.
- **Artists** can have albums and songs spread across multiple libraries. The same artist may appear in several libraries, each with different albums or tracks.
- Artist statistics and metadata are aggregated across all libraries where the artist appears.
- Playlists can contain songs from multiple libraries (if the user has access to those libraries)
- Smart playlists can be scoped to specific libraries
- Search results are filtered by the user's accessible (and selected) libraries

## Setting Up Multi-Library

### Creating Additional Libraries

1. **Access Library Management**

   - Log in as an administrator
   - Go to **Settings** → **Libraries**

2. **Create a New Library**

   - Click the **"+"** button to add a new library
   - Provide a **Name** for the library (e.g., "Audiobooks", "FLAC Collection")
   - Set the **Path** to the folder containing your music files
   - Optionally set the library as default for new users
   - Click **Save**

3. **Initial Scan**
   - The new library will automatically begin scanning
   - Monitor the scanning progress in the Activity Panel
   - Large libraries may take time to complete the initial scan

### Managing User Access

1. **Assign Libraries to Users**

   - Go to **Settings** → **Users**
   - Click on a user to edit their settings
   - In the **Libraries** section, check the libraries the user should access
   - Click **Save**

2. **Verify Access**
   - Users will see a library selector in the sidebar if they have access to multiple libraries
   - The library selector is displayed in the top left corner of the UI
   - Users can select multiple libraries to browse and listen to their music

## Configuration Considerations

### File Organization

Each library should have its own root folder structure:

```
/music/main/           # Default library (MusicFolder)
├── Artist 1/
├── Artist 2/
└── ...

/music/audiobooks/     # Audiobooks library
├── Author 1/
├── Author 2/
└── ...

/other_path/lossless/       # High-quality library
├── Artist 1/
├── Artist 2/
└── ...
```

It is up to the user where to save music collections. You can store your artists in `/music` or any other path you want to use.

### Permissions

- The Navidrome user must have read access to all library folders
- Consider using the same ownership/permissions across all library folders
- Ensure adequate disk space for each library's cache and metadata

### Performance

- Each library maintains its own file system watcher
- Multiple libraries scanning simultaneously may impact performance
- Consider staggering initial scans of large libraries
- Large numbers of libraries may affect UI performance

## Using Multi-Library

### Switching Libraries

- Use the library selector in the sidebar to select visible libraries
- All browsing, searching, and playback is scoped to the selected libraries

### Cross-Library Features

- **Playlists**: Can contain songs from multiple libraries (user must have access)
- **Smart Playlists**: Can be scoped to specific libraries using filters
- **Search**: Results from all accessible libraries (filtered by permissions)
- **Statistics**: Maintained separately per library

## API and Client Support

### Subsonic API

- The `getMusicFolders` endpoint returns all libraries accessible to the authenticated user
- All other endpoints respect the user's library permissions
- Clients that support multiple music folders will work with Navidrome's multi-library feature

### Client Compatibility

Most Subsonic-compatible clients that support multiple music folders will work with Navidrome's multi-library feature. Check your client's documentation for music folder support.

## Troubleshooting

### Library Not Scanning

- Verify the path exists and is readable by the Navidrome user
- Check the logs for permission errors
- Ensure the path doesn't overlap with other libraries
- If using systemd, like on NixOS, ensure that each library folder is listed in the `BindReadOnlyPath` path.

### User Cannot Access Library

- Verify the user has been granted access to the library in user settings
- Check that the library has completed its initial scan

### Performance Issues

- Monitor system resources during simultaneous library scans
- Consider adjusting scanner settings if experiencing high I/O

## Best Practices

- Design your folder structure before creating libraries
- Use clear, descriptive names for libraries
- Consider future growth when organizing

## Related Features

- [Configuration Options](/docs/usage/configuration-options/): Basic setup and MusicFolder configuration
- [Smart Playlists](/docs/usage/smartplaylists/): Create dynamic playlists with library-specific filters
- [Backup](/docs/usage/backup/): Protecting your multi-library setup
