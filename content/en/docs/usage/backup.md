---
title: Automated Backup
linkTitle: Automated Backup
date: 2024-12-21
description: >
  Information on the in-built backup system
---

Navidrome version 0.54.x introduces a backup feature that allows the music server's data to get periodically exported. 
This guide will walk you through configuring backups using both a [configuration](/docs/usage/configuration-options) 
file and environment variables, where to locate the backups, and how to restore from a backup.

{{% alert %}}
Note: The backup process ONLY backs up the database (users, play counts, etc.). It does NOT back up the music or the config.
{{% /alert %}}

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

You can manually create a backup via the `navidrome backup create` command:

~~~bash
sudo navidrome backup create
~~~

If you use docker compose, you can do the same with:

~~~bash
sudo docker compose run <service_name> backup create
# service_name is usually `navidrome` 
~~~

When manually creating a backup, no prune cycle is run, so none of the existing backups will be pruned. However, 
next time the automated backup process runs, the normal prune cycle will run and potentially remove several backups 
until the number of backups is down to the configured backup count setting. To manually run a prune cycle, use the 
`navidrome backup prune` command:

~~~bash
sudo navidrome backup prune
~~~

If you use docker compose, you can do the same with:

~~~bash
sudo docker compose run <service_name> backup prune
# service_name is usually `navidrome`
~~~


## Locating Backup

Once configured, Navidrome will store backups in the directory specified by the BackupFolder or ND_BACKUP_PATH setting. To verify the location:

* Check the Config File: If using a configuration file, look for the `Backup` config node and confirm that all three options are configured.
* Check Environment Variables: If using environment variables, ensure that all three variables is set correctly.

## Restoring a Backup

When you restore a backup, the existing data in the database is wiped and the data in the backup gets copied into the database.

Note: YOU MUST BE SURE TO RUN THIS COMMAND WHILE THE NAVIDROME APP IS NOT RUNNING/LIVE.

Restore a backup by running the `navidrome backup restore ` command.

{{% alert color="warning" title="Attention" %}}
Restoring a backup should ONLY be done when the service is NOT running. You've been warned.
{{% /alert %}}



## Additional Resources

For more detailed configuration options and examples, refer to the [Navidrome Configuration Options](/docs/usage/configuration-options) page. This resource provides comprehensive guidance on customizing Navidrome to fit your needs.

By following this guide, you can effectively set up and manage backups for your Navidrome music server, ensuring your data is protected and easily recoverable.
