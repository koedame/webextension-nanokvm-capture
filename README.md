# NanoKVM Capture - Chrome Extension

![NanoKVM Capture](./docs/screenshot.png)

A Chrome extension that adds screenshot and video recording capabilities to NanoKVM.

## Features

- Screenshot Capture of NanoKVM Interface
  - High-quality PNG image capture
  - One-click saving
  - Automatic timestamped filenames
- Video Recording of NanoKVM Interface
  - High-quality WebM recording with VP9 codec
  - Start/stop recording at any time
  - Real-time recording duration display
  - Visual recording indicator
- Local Storage of Captured Media
  - Automatic saving with timestamped filenames
  - PNG format for screenshots
  - WebM format for videos
- Easy-to-use Interface Integrated with Chrome Browser
  - Simple and intuitive floating controls
  - Visual feedback for recording status

## Technical Details

- Video Format: WebM with VP9 codec
- Image Format: PNG
- Browser Support: Chrome with VP9 codec support
- Interface Detection: Automatic detection of NanoKVM interface
- Performance: Optimized for minimal resource usage

## Development Setup

### Requirements

- [Bun](https://bun.sh/) 1.0.0 or later
- Chrome Browser

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/koedame/webextension-nanokvm-capture.git
cd webextension-nanokvm-capture
```

2. Install dependencies
```bash
bun install
```

### Development Mode

To start development mode with hot reload:
```bash
bun run dev
```

### Production Build

To create a production build:
```bash
bun run build:prod
```

### Installing the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `dist` directory from this project
4. The extension icon should appear in your browser toolbar

### Development Tips

- After making changes to the code, the extension will automatically rebuild in development mode
- You may need to click the refresh button on the extension card in `chrome://extensions` to apply changes
- Check the browser console for any errors or logs
- The extension automatically detects the NanoKVM interface by checking for specific DOM elements

## License

MIT License
