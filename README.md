# SRM Auto Login

A Chrome extension that automatically fills and submits the SRM campus network portal login when your session expires. Eliminates the need to manually enter credentials every day.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=googlechrome)](https://chromewebstore.google.com/detail/behkfphgkbobbfocneknileklhkkmfjc)
[![Version](https://img.shields.io/badge/version-1.0.2-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Features

- **Instant Auto-Login** — Automatically detects the portal and fills credentials
- **Secure Local Storage** — Credentials encrypted using Chrome's secure storage API
- **One-Time Setup** — Save credentials once, never type them again
- **Toggle Control** — Enable or disable auto-login with a single click
- **Dual Portal Support** — Works on both `iach.srmist.edu.in` and `iac.srmist.edu.in`
- **Lightweight** — Minimal resource usage, only activates when needed
- **Modern Interface** — Clean, intuitive popup design

---

## Installation

### From Chrome Web Store

[**Install from Chrome Web Store**](https://chromewebstore.google.com/detail/behkfphgkbobbfocneknileklhkkmfjc)

Click the link above and select "Add to Chrome" for one-click installation.

### Manual Installation (For Developers)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/SMFawaz24/srm-auto-login.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** using the toggle in the top-right corner

4. Click **Load unpacked** and select the repository folder

5. The extension is now installed and ready to use

---

## How to Use

### Initial Setup

1. Click the extension icon in your Chrome toolbar
2. Enter your SRM network credentials:
   - Username (e.g., `xx0000`)
   - Password
3. Click "Save Credentials"
4. The extension is now active

### Daily Operation

Once configured, the extension works automatically:

1. Your SRM WiFi session expires (every 23 hours)
2. You attempt to browse any website
3. Browser redirects to the SRM network portal
4. Extension automatically fills and submits your credentials
5. Portal authenticates and redirects you to your intended page
6. You're connected without any manual intervention

---

## Privacy and Security

### Credential Storage

Your credentials are stored **exclusively on your local device** using Chrome's `chrome.storage.local` API. This storage mechanism:

- **Encrypts data** using your operating system's built-in encryption (Windows DPAPI, macOS Keychain, or Linux Secret Service)
- **Isolates data** per extension (other extensions cannot access your credentials)
- **Never transmits** data to any external server
- **Automatically removes** data when you uninstall the extension

The security level is equivalent to Chrome's built-in password manager.

### Technical Security Details

**Storage Location:**
- Windows: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Local Extension Settings\[extension-id]`
- macOS: `~/Library/Application Support/Google/Chrome/Default/Local Extension Settings/[extension-id]`
- Linux: `~/.config/google-chrome/Default/Local Extension Settings/[extension-id]`

**Encryption:**
- Data is encrypted at rest using OS-level encryption APIs
- Credentials are never stored in plain text
- Can only be decrypted by Chrome running under your user account

### Required Permissions

The extension requests minimal permissions:

- **`storage`** — Required to save your credentials locally
- **`host_permissions` for iach.srmist.edu.in and iac.srmist.edu.in** — Required to detect portal pages and inject the auto-fill script

The extension operates exclusively on SRM portal URLs and cannot access any other websites.

**Full Privacy Policy:** [https://sites.google.com/view/srm-autologin-privacy](https://sites.google.com/view/srm-autologin-privacy)

---

## Technical Overview

### How It Works

1. **Portal Detection:** Content script activates when the browser loads an SRM portal URL
2. **Credential Retrieval:** Extension reads saved credentials from secure local storage
3. **Form Identification:** Locates form elements by their HTML IDs:
   - Username field: `LoginUserPassword_auth_username`
   - Password field: `LoginUserPassword_auth_password`
   - Submit button: `UserCheck_Login_Button`
4. **Form Submission:** Populates fields and triggers the login button
5. **Authentication:** Portal validates credentials and redirects to the original destination

### Architecture

```
Extension Components:
├── popup.html/js     → User interface and settings management
├── content.js        → Portal detection and form auto-fill logic
├── background.js     → Service worker for extension initialization
├── manifest.json     → Extension configuration and permissions
└── icons/            → Extension icons (16px, 48px, 128px)
```

---

## Project Structure

```
srm-auto-login/
├── manifest.json       # Extension configuration
├── content.js          # Auto-fill logic
├── background.js       # Background service worker
├── popup.html          # Extension popup interface
├── popup.js            # Popup interaction handlers
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── LICENSE             # MIT License
└── README.md           # Documentation
```

---

## For Developers

### Development Setup

```bash
# Clone the repository
git clone https://github.com/SMFawaz24/srm-auto-login.git
cd srm-auto-login

# No build process required — load directly as unpacked extension
```

### Testing Changes

1. Make code modifications
2. Navigate to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test functionality on the SRM portal

### Key Files for Modification

- **UI changes:** `popup.html` and `popup.js`
- **Auto-fill logic:** `content.js`
- **Field selectors:** Update element IDs in `content.js` if portal HTML changes

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

### Potential Contributions

- Support for additional SRM portal domains
- Credential import/export functionality
- Alternative authentication methods
- Firefox browser compatibility
- Login success notifications
- Multi-account credential management

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.2 | February 2025 | Removed tabs permission, updated manifest |
| 1.0.1 | February 2025 | Initial Chrome Web Store submission |
| 1.0.0 | February 2025 | Initial development release |

---

## Frequently Asked Questions

**Does this work off-campus?**  
The extension only activates when your browser is redirected to the SRM portal, which occurs exclusively on the campus WiFi network.

**How do I update my credentials?**  
Click the extension icon and enter your new credentials. The previous credentials will be overwritten.

**Can I temporarily disable the extension?**  
Yes. Click the extension icon and use the toggle switch to disable auto-login. You can re-enable it at any time.

**Does it work on mobile devices?**  
Chrome extensions currently have limited support on mobile browsers. This extension is designed for desktop Chrome.

**How often does the session expire?**  
SRM's network session remains valid for 23 hours. The extension automatically re-authenticates when the session expires.

**What happens if the portal layout changes?**  
If SRM modifies the portal HTML structure, the extension may require updates. Report issues via GitHub Issues.

---

## Troubleshooting

**Auto-fill not working:**
- Verify the toggle is enabled (check extension popup)
- Confirm credentials are saved correctly
- Open browser console (F12) and check for error messages

**"No credentials saved" message:**
- Click the extension icon
- Re-enter your credentials and click "Save Credentials"

**Login fails after auto-fill:**
- Verify your credentials by logging in manually
- Ensure username and password are correct
- Re-save credentials in the extension

**Extension icon not visible:**
- Click the puzzle icon in Chrome toolbar
- Locate "SRM Auto Login" and pin it for persistent visibility

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete terms.

```
MIT License

Copyright (c) 2025 SM Fawaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Support

- **Bug Reports:** [GitHub Issues](https://github.com/SMFawaz24/srm-auto-login/issues)
- **Feature Requests:** [GitHub Issues](https://github.com/SMFawaz24/srm-auto-login/issues)
- **Privacy Policy:** [Google Sites](https://sites.google.com/view/srm-autologin-privacy)
- **Chrome Web Store:** [Extension Page](https://chromewebstore.google.com/detail/behkfphgkbobbfocneknileklhkkmfjc)

---

## Acknowledgments

Built for the SRM Institute of Science and Technology student community to streamline daily network authentication.

---

<div align="center">

**Made for SRM Students**

[Install Extension](https://chromewebstore.google.com/detail/behkfphgkbobbfocneknileklhkkmfjc) • [Report Bug](https://github.com/SMFawaz24/srm-auto-login/issues) • [Request Feature](https://github.com/SMFawaz24/srm-auto-login/issues)

</div>
