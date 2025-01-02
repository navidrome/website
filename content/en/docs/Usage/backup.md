---
title: Automated Backup
linkTitle: Automated Backup
date: 2024-12-21
description: >
  Information on the in-built backup system
---

Navidrome version 0.54.x introduces a backup feature that allows the music server's data to get periodically exported and optionally re-imported. This guide will walk you through configuring backups using both the config.toml file and environment variables, where to locate the backups, and how to restore from a backup.

{{% pageinfo %}}
Note: The backup process ONLY backs up the database (users, play counts, etc.). It does NOT back up the music or the config.
{{% /pageinfo %}}

## Configuring Backup with config.toml

To configure backups using the navidrome.toml file, insert the following lines to set up backups:

~~~conf
[Backup]
Path = "/path/to/backup/folder"
Count = 7
Schedule =  "0 0 * * *"
~~~

* Backup.Path: The directory where backups will be stored. Replace "/path/to/backup/folder" with the desired path.
* Backup.Count: The number of backup files to keep.
* Backup.Schedule: `cron`-like syntax to define how often backups occur. The example above schedules a backup every 24 hours at midnight.


## Configuring Backup with Environment Variables

Alternatively, you can configure backups using environment variables `ND_BACKUP_PATH`, `ND_BACKUP_SCHEDULE`, and `ND_BACKUP_COUNT`.

~~~yaml
environment:
  ND_BACKUP_PATH: /backup
  ND_BACKUP_SCHEDULE: "0 0 * * *"
  ND_BACKUP_COUNT: 7
volumes:
  - ./data:/data
  - ./backup:/backup
~~~

## Manually Creating a Backup

You can manually create a backup via the navidrome command like so:

~~~bash
sudo navidrome backup create
~~~

If you use docker compose, you can do the same with:

~~~bash
sudo docker compose run <service_name> backup create
~~~

## Locating Backup

Once configured, Navidrome will store backups in the directory specified by the BackupFolder or ND_BACKUP_PATH setting. To verify the location:

* Check the Config File: If using config.toml, look for the `Backup` config node and confirm that all three options are configured.
* Check Environment Variables: If using environment variables, ensure that all three variables is set correctly.

## Restoring a Backup

Note: Restoring a backup should ONLY be done when the service is NOT running.

Restore a backup by running the `navidrome backup restore` command.

## Additional Resources

For more detailed configuration options and examples, refer to the [Navidrome Configuration Options](/docs/usage/configuration-options) page. This resource provides comprehensive guidance on customizing Navidrome to fit your needs.

By following this guide, you can effectively set up and manage backups for your Navidrome music server, ensuring your data is protected and easily recoverable.
