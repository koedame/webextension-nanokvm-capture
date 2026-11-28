<div align="center">

<img alt="NanoKVM Capture icon: a white camera on a blue square" src="icons/icon128.png" width="96" height="96">

# NanoKVM Capture

**Screenshots and video recording for the NanoKVM remote desktop, right in Chrome.**

[![Build](https://github.com/koedame/webextension-nanokvm-capture/actions/workflows/build.yml/badge.svg)](https://github.com/koedame/webextension-nanokvm-capture/actions/workflows/build.yml)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-install-1a73e8?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/hhhflijfhlnddhneehnhojkpbjengbfh)
![Manifest V3](https://img.shields.io/badge/manifest-V3-1a73e8)
![License: MIT](https://img.shields.io/badge/license-MIT-1a73e8)

[Quick start](#quick-start) · [Usage](#usage) · [Privacy](#privacy) · [Development](#development) · [Disclaimer](#disclaimer)

</div>

Open your NanoKVM in Chrome and two round buttons appear at the bottom right of the remote desktop: one saves the current screen as a PNG, the other records it as a WebM video. Files go straight to your Downloads folder with a timestamp in the name, so documenting a BIOS setup or an OS install takes one click.

## Highlights

- **Two buttons, no setup.** Screenshot and record controls show up by themselves on the NanoKVM page and nowhere else.
- **PNG and WebM (VP9).** Screenshots are PNG; recordings are WebM with the VP9 codec, with a live duration counter while recording.
- **Saved locally.** Every file is named `snapshot-<timestamp>.png` or `recorded-video-<timestamp>.webm` and downloaded through Chrome.
- **0 network requests.** The extension has no server, no analytics and no storage. See [Privacy](#privacy).
- **Works with renamed consoles.** The NanoKVM page is recognized by its `sipeed.ico` icon and the `#screen` element, so a custom page title does not break it.

## Quick start

Requires Chrome with VP9 recording support and a NanoKVM.

1. Install **NanoKVM Capture** from the [Chrome Web Store](https://chromewebstore.google.com/detail/hhhflijfhlnddhneehnhojkpbjengbfh).
2. Open your NanoKVM's web page in Chrome and sign in as usual.
3. Use the buttons at the bottom right of the screen.

## Usage

| Button | What it does |
|---|---|
| Camera | Saves the current screen as `snapshot-<timestamp>.png`. |
| Video camera | Starts recording. Press again to stop and save `recorded-video-<timestamp>.webm`. A recording indicator with the elapsed time is shown while it runs. |

On any page that is not a NanoKVM console the extension shows nothing and does not read the page. It keeps watching for the NanoKVM screen for up to 1 minute after the page loads, then stops. On a NanoKVM page it keeps watching until the screen appears, so the buttons also show up after a slow login.

## Privacy

NanoKVM Capture does not collect, transmit or store anything. Screenshots and recordings are created in your browser and saved as ordinary downloads. The full text is in the [privacy policy](docs/PRIVACY_POLICY.md); the answers given to the Chrome Web Store are in [docs/STORE_LISTING.md](docs/STORE_LISTING.md). To report a vulnerability, see [SECURITY.md](SECURITY.md).

## Development

<details>
<summary>Build it yourself, load it unpacked, package it for the store</summary>

Requirements: [Bun](https://bun.sh/) 1.0.0 or later and Chrome.

```bash
git clone https://github.com/koedame/webextension-nanokvm-capture.git
cd webextension-nanokvm-capture
bun install
bun run dev          # development build that rebuilds on change
bun run build:prod   # production build into dist/
```

Load the build in Chrome:

1. Open `chrome://extensions` and turn on **Developer mode** (top right).
2. Click **Load unpacked** and select the `dist` directory of this project.
3. The extension icon appears in the toolbar. After a rebuild, press the refresh button on the extension card.

Checks used by CI: `bun run lint` and `bun run type-check`.

To make the ZIP that is uploaded to the Chrome Web Store, run the production build and then:

```bash
VERSION=$(node -p "require('./package.json').version")
mkdir ./temp
cd dist
zip -r "../temp/nanokvm-capture-v${VERSION}.zip" ./*
cd ..
```

</details>

## Disclaimer

This is an unofficial extension made by an individual. It is not affiliated with, endorsed by, or supported by Sipeed. NanoKVM is a product name of Sipeed, and Chrome is a trademark of Google LLC; all other names belong to their respective owners and are used only to say what the extension works with.

## Contributing

This repository does not accept outside contributions: pull requests are not reviewed or merged and may be closed without a reply. Bug reports and questions are welcome as [issues](https://github.com/koedame/webextension-nanokvm-capture/issues), without any promise of an answer. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License. See [LICENSE](./LICENSE).
