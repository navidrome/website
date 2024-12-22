---
title: Automated Backup
linkTitle: Automated Backup
date: 2024-12-21
description: >
  Information on the in-built backup system
---

Navidrome version 0.54.x introduces a backup feature that allows you to safeguard your music server's data. This guide will walk you through configuring backups using both the config.toml file and environment variables, as well as where to locate the backups.

## Configuring Backup with config.toml

To configure backups using the navidrome.toml file, insert the following lines to set up backups:

~~~conf
BackupFolder = "/path/to/backup/folder"
BackupSchedule = "0 0 * * *"
~~~

* BackupFolder: This specifies the directory where backups will be stored. Replace "/path/to/backup/folder" with your desired path.
* BackupSchedule: This uses a cron-like syntax to define how often backups occur. The example above schedules a backup every 24 hours at midnight.

Here is a sample configuration for a Unix-based system:

~~~conf
MusicFolder = '/mnt/music'
BackupFolder = '/mnt/backup'
~~~

## Configuring Backup with Environment Variables

Alternatively, you can configure backups using environment variables `ND_BACKUPFOLDER` and `ND_BACKUPSCHEDULE`.


## Locating Backup

Once configured, Navidrome will store backups in the directory specified by the BackupFolder or ND_BACKUPFOLDER setting. To verify the location:

* Check the Config File: If using config.toml, look for the BackupFolder entry.
* Check Environment Variables: If using environment variables, ensure ND_BACKUPFOLDER is set correctly.

## Additional Resources

For more detailed configuration options and examples, refer to the [Navidrome Configuration Options](/docs/usage/configuration-options) page. This resource provides comprehensive guidance on customizing Navidrome to fit your needs.

By following this guide, you can effectively set up and manage backups for your Navidrome music server, ensuring your data is protected and easily recoverable.
