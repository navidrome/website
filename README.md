# Navidrome Website

![Netlify Status](https://api.netlify.com/api/v1/badges/fc69beaf-8f79-41a0-9032-5dc4e9221acf/deploy-status)

## Running in a container locally

You can run this project inside a [Docker](https://docs.docker.com/)
container. The container runs with a volume bound to the project's source
folder. This approach doesn't require you to install any dependencies other
than [Docker Desktop](https://www.docker.com/products/docker-desktop) on
Windows and Mac, and [Docker Compose](https://docs.docker.com/compose/install/)
on Linux.

1. Build the docker image

```bash
docker compose build
```

2. Set required environment variables for analytics charts:

```bash
export CHARTS_URL="https://your-charts-endpoint.com/api/charts"
export CHARTS_API_KEY="your-api-key"
```

3. Run the built image

```bash
docker compose up
```

   > NOTE: You can run both commands at once with `docker compose up --build`.

3. Verify that the service is working.

   Open your web browser and type `http://localhost:1313` in your navigation bar.
   This opens a local instance of the project's homepage. You can now make
   changes to the source code, and those changes will immediately show up in your
   browser after you save.

### Cleanup

To stop Docker Compose, on your terminal window, press **Ctrl + C**.

To remove the produced images, run:

```bash
docker compose rm
```
For more information, see the [Docker Compose
documentation](https://docs.docker.com/compose/gettingstarted/).

## Setting up local environment

1. Install dependencies:
    - [Go][]
    - [Hugo][] (0.107.0 or newer)
    - [Node.js][]
   
### Linux
#### Debian-based distributions (e.g., Ubuntu)
```bash
# Install Go
sudo apt update
sudo apt install golang-go

# Install Hugo
sudo apt install hugo

# Install Node.js
sudo apt install nodejs npm
```

#### Arch Linux
```bash
# Install Go
sudo pacman -S go

# Install Hugo
sudo pacman -S hugo

# Install Node.js
sudo pacman -S nodejs npm
```

### macOS
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Go
brew install go

# Install Hugo (extended version)
brew install hugo

# Install Node.js
brew install node
```

### Windows
```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Go
choco install golang

# Install Hugo (extended version)
choco install hugo-extended

# Install Node.js
choco install nodejs
```

2. Clone this repository:
```bash
git clone https://github.com/navidrome/website
cd website
```

3. If you want to do SCSS edits and want to publish these, you need to install `PostCSS`:
```bash
npm install
```

> NOTE: For Windows users, be sure to install the extended edition of Hugo via `choco install hugo-extended`.

## Running the website locally

Building and running the site locally requires a recent `extended` version of [Hugo](https://gohugo.io).
You can find out more about how to install Hugo for your environment in our
[Getting started](https://www.docsy.dev/docs/getting-started/#prerequisites-and-installation) guide.

Once you've made your working copy of the site repo, from the repo root folder, run:

```bash
hugo server
```

This will start Hugo and serve the site at [http://localhost:1313](http://localhost:1313).

## Credits

Photos from Unsplash by:
* [Travis Yewell](https://unsplash.com/@shutters_guild?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)
* [Florencia Viadana](https://unsplash.com/@florenciaviadana?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText")

[Go]: https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#install-go-language
[Hugo]: https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#install-hugo
[Node.js]: https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#installupgrade-nodejs

