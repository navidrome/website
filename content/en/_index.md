+++
title = "Navidrome"
linkTitle = "Navidrome"

+++

{{< blocks/cover title="Welcome to Navidrome!" image_anchor="top" height="full" >}}
<div class="mx-auto">
	<a class="btn btn-lg btn-primary mr-3 mb-4" href="{{< relref "/docs" >}}">
		Learn More <i class="fas fa-arrow-alt-circle-right ml-2"></i>
	</a>
	<a class="btn btn-lg btn-secondary mr-3 mb-4" href="{{< relref "/docs/installation" >}}">
		Download <i class="fas fa-cloud-download-alt ml-2 "></i>
	</a>
	<p class="lead mt-5">Your Personal Streaming Service</p>
</div>
{{< blocks/link-down color="info" >}}
{{< /blocks/cover >}}


{{% blocks/lead color="primary" %}}
Navidrome allows you to enjoy your music collection from anywhere, by making it available through a 
modern Web UI and through a wide range of third-party compatible mobile apps, for both iOS and Android devices.

Navidrome is open source software distributed **free of charge** under the terms of the 
[GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0) license.
{{% /blocks/lead %}}

{{< blocks/section color="light" type="row" >}}

{{% blocks/feature icon="fa-mobile-alt" title="Access your music from anywhere!" url="/docs/overview/#apps" %}}
Choose from a large selection of mobile clients or use the integrated web player
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-bolt" title="Blazing fast!" url="/docs/overview" %}}
Lightweight, fast and self-contained. Runs well even on resource-limited platforms (ex: Raspberry Pi)
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-database" title="Handles large libraries!" url="/docs/overview" %}}
Plays well with gigantic music collections (tested with ~900K songs - 2/3 FLAC, 1/3 MP3)
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-compress-arrows-alt" title="Transcoding on the fly!" url="/docs/overview" %}}
Converts/reduces your music files as you play them, so you don't nuke your data plan
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-certificate" title="Modern and up-to-date" url="/docs/overview" %}}
Built with new technologies ([GoLang](https://golang.org), [ReactJS](https://reactjs.org), [Material-UI](https://material-ui.com/)), 
to ensure modern features and compatibility
{{% /blocks/feature %}}

{{% blocks/feature icon="icon-subsonic" title="Subsonic API" url="/docs/overview/#apps" %}}
Compatible with the de facto standard Music API, supporting all its clients and ecosystem
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-heartbeat" title="Active project!" url="/docs/overview#road-map" %}}
New releases on a regular basis, adding features and bug fixes
{{% /blocks/feature %}}

{{% blocks/feature icon="fab fa-github" title="Contributions welcome!" url="https://github.com/navidrome/navidrome" %}}
We do a [Pull Request](https://github.com/navidrome/navidrome/pulls) contributions workflow on **GitHub**. New users are always welcome!
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-comments" title="Join the conversation!" url="/community" %}}
For announcement of latest features, discussions and help from your fellow users, join our [Reddit](https://www.reddit.com/r/navidrome/) or 
our [Discord](https://discord.gg/xh7j7yF)
{{% /blocks/feature %}}

{{< /blocks/section >}}
