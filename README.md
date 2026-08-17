# DeepSeek Code Collapser

> Chrome extension for collapsing code blocks and headers in DeepSeek chat

## Features

- 📦 **Collapse code blocks** - hide long code blocks with one click
- 📑 **Collapse headers** - collapse entire sections by clicking on headers
- ⚡ **Auto-collapse** - automatically collapse code blocks
- ⚙️ **Settings panel** - configure everything from DeepSeek settings

## Installation

### Manual installation

1. Download the latest release
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `build` folder

## Usage

### Code blocks
- Click **Collapse** button to hide long code blocks
- Click **Expand** to show full code
- Enable auto-collapse in settings

### Headers
- Click the arrow icon next to any header (H1-H6)
- The entire section will collapse
- Click again to expand

## Settings

Open DeepSeek settings → **General** → **Chat Collapser** section:

- **Auto-collapse long code blocks** - collapse blocks >300 lines
- **Auto-collapse all code blocks** - collapse every code block
- **Auto-collapse all headers** - collapse all header sections
- **Long block threshold** - set line count for auto-collapse

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/deepseek-code-collapser.git

# Install dependencies
npm install

# Run development build
npm run dev

# Build for production
npm run build
````

## Support
![Stars](https://img.shields.io/github/stars/LegoManchik/deepseek-chat-collapser)

If you find this extension useful, please ⭐ star the repository!

