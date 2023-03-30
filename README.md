# Navidrome Website

![Netlify Status](https://api.netlify.com/api/v1/badges/fc69beaf-8f79-41a0-9032-5dc4e9221acf/deploy-status)

## Running in a container locally

You can run this project inside a [Docker](https://docs.docker.com/)
container, the container runs with a volume bound to the project's source
folder. This approach doesn't require you to install any dependencies other
than [Docker Desktop](https://www.docker.com/products/docker-desktop) on
Windows and Mac, and [Docker Compose](https://docs.docker.com/compose/install/)
on Linux.

1. Build the docker image

   ```bash
   docker-compose build
   ```

1. Run the built image

   ```bash
   docker-compose up
   ```

   > NOTE: You can run both commands at once with `docker-compose up --build`.

1. Verify that the service is working.

   Open your web browser and type `http://localhost:1313` in your navigation bar,
   This opens a local instance of the project's homepage. You can now make
   changes to the source code and those changes will immediately show up in your
   browser after you save.

### Cleanup

To stop Docker Compose, on your terminal window, press **Ctrl + C**.

To remove the produced images run:

```bash
docker-compose rm
```
For more information see the [Docker Compose
documentation](https://docs.docker.com/compose/gettingstarted/).

## Setting up local environment

1. Install dependencies:
    - [Go][]
    - [Hugo][] (0.107.0 or newer)
    - [Node.js][]
2. Clone this repository
   ```bash
   git clone https://github.com/navidrome/website
   cd website
   ```
3. If you want to do SCSS edits and want to publish these, you need to install `PostCSS`
   ```bash
   npm install
   ```

> NOTE: For Windows users, you need to be sure to install the extended edition of Hugo.  
> This can be done via `choco install hugo-extended`

## Running the website locally

Building and running the site locally requires a recent `extended` version of [Hugo](https://gohugo.io).
You can find out more about how to install Hugo for your environment in our
[Getting started](https://www.docsy.dev/docs/getting-started/#prerequisites-and-installation) guide.

Once you've made your working copy of the site repo, from the repo root folder, run:


```
hugo server
```

This will start Hugo and serve the site at http://localhost:1313

## Credits

Photos from Unsplash by:
* [Travis Yewell](https://unsplash.com/@shutters_guild?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)
* [Florencia Viadana](https://unsplash.com/@florenciaviadana?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText")

[Go]: https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#install-go-language
[Hugo]: https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#install-hugo
[Node.js]: https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#installupgrade-nodejs
