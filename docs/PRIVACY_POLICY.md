# Privacy Policy for NanoKVM Capture

Last updated: October 3, 2026

NanoKVM Capture is a Chrome extension that adds screenshot and video recording to the NanoKVM remote desktop page. It is an unofficial extension made by an individual and is not affiliated with Sipeed.

## Summary

NanoKVM Capture does not collect, transmit, or store any data about you. It has no server, no analytics, and no account.

## What the extension does with your data

- **Screen content.** When you press the screenshot or record button, the extension reads the video of the NanoKVM remote desktop in the page you are viewing and turns it into a PNG image or a WebM video. This happens entirely inside your browser on your device.
- **Where the result goes.** The image or video is saved to your device as a downloaded file, using your browser's normal download behavior. The extension keeps no copy and does not send the file anywhere.
- **Page detection.** The extension's content script is loaded on web pages so that it can recognize the NanoKVM remote desktop page (by its page title and the presence of its video element). On any other page it does nothing: it does not read page content, and it shows no controls. The page title and URL are checked in memory only and are never recorded or sent.
- **Settings and history.** The extension does not use browser storage (`chrome.storage`, `localStorage`, cookies, or similar) and keeps no settings or history.

## What the extension does not do

- It makes no network requests of its own.
- It does not collect personal information, authentication information, browsing history, or any other user data.
- It does not sell or share data with third parties, because it has no data.
- It does not use remote code. All code is contained in the extension package, and its source is available in this repository.

## Third parties

Files you download are yours. What you do with them afterwards, including sharing them, is outside the extension's control.

## Changes to this policy

If the extension ever changes how it handles data, this document will be updated before the change is released. The history of this file is public in this repository.

## Contact

Questions or concerns: open an issue at https://github.com/koedame/webextension-nanokvm-capture/issues
