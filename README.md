<p align="center">
  <img src="icons/icon128.png" width="100" alt="PomodoLock Logo" />
</p>

<h1 align="center">PomodoLock - Focus Timer & Website Blocker</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/manifest-v3-green" alt="Manifest V3">
</p>

## Overview

**PomodoLock** is a powerful Chrome extension that combines the Pomodoro technique with website blocking functionality to boost your productivity. It helps you maintain focus during work sessions by temporarily blocking distracting websites, allowing you to concentrate on what matters most.

## Features

- **Pomodoro Timer**: 25-minute focus sessions with visual countdown and badge indicator
- **Distraction Blocking**: Automatically prevents access to specified websites during active focus sessions
- **Customizable Block List**: Easily add or remove websites from your personalized block list
- **Visual Reminders**: Modern, visually appealing screens when attempting to access blocked sites
- **Session Completion**: Congratulatory screen when your focus session is complete
- **Dark Mode Interface**: Clean, eye-friendly dark theme for comfortable use

## How It Works

PomodoLock uses a dual-approach strategy to help you stay focused:

1. **Timed Focus Sessions**: Start a 25-minute Pomodoro timer from the extension popup
2. **Website Blocking**: During active sessions, attempts to visit blocked sites are redirected to a reminder page
3. **Visual Feedback**: Browser badge shows remaining time and changes color as time decreases
4. **Session Completion**: When time's up, a completion screen celebrates your achievement

## Installation

### From Chrome Web Store

Install PomodoLock directly from the [Chrome Web Store](https://chrome.google.com/webstore/detail/mapddbpaaaachoidpbolhpckhillhbpj)

### Manual Installation

1. Download and extract the latest release
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the extracted extension folder
5. PomodoLock is now installed and ready to help you focus!

## Usage

- **Start a Session**: Click the extension icon and press "Start Focus" to begin a 25-minute focus session
- **Manage Block List**: Add or remove websites from your block list in the extension popup
- **End Session Early**: If needed, you can end a session early from either the popup or blocked site screen
- **Reset Timer**: Reset the timer to 25 minutes at any time

## Default Blocked Sites

PomodoLock comes pre-configured to block these common distractions:

- instagram.com
- twitter.com
- linkedin.com
- youtube.com
- facebook.com
- reddit.com

## Technical Details

PomodoLock is built with:

- Manifest V3 API
- Chrome's `storage` API for maintaining timer state and settings
- `webNavigation` API for detecting navigation to blocked sites
- `alarms` API for precise timer functionality
- Modern CSS with animations for a polished user experience

## Privacy Policy

Please refer to our [Privacy Policy](https://shubhs27.github.io/PomodoLock/privacy-policy) for information about data collection and privacy practices.

## Contributing

If you have ideas to improve this extension or have found a bug, please open an issue to discuss your ideas or report the problem. Pull requests are also welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Chrome Extension documentation and tutorials at [developer.chrome.com](https://developer.chrome.com/docs/extensions) were invaluable resources during development - their clear explanations and examples make extension development accessible and straightforward.
