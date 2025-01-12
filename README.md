# NanoKVM Capture - Chrome Extension

A Chrome extension that allows you to capture screenshots and record videos of NanoKVM control interface.

## Features

- Take screenshots of NanoKVM interface
- Record video of NanoKVM interface
- Save captured media locally
- Easy-to-use interface integrated with Chrome browser

## Development

### Requirements

- [Bun](https://bun.sh/) 1.0.0 or later
- Chrome Browser

### Setup

1. Clone this repository
```bash
git clone https://github.com/koedame/webextension-nanokvm-capture.git
cd webextension-nanokvm-capture
```

2. Install dependencies
```bash
bun install
```

### Development Mode

Run the following command to start development mode with hot reload:
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

- After making changes to the code, the extension will automatically rebuild
- You may need to click the refresh button on the extension card in `chrome://extensions` to apply the changes
- Check the browser console for any errors or logs

## License

[License information to be added] 