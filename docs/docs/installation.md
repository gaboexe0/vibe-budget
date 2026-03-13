# Installation

## Requirements

- Node.js 18 or higher
- npm

## Install globally
```bash
npm install -g vibe-budget
```

## Verify installation
```bash
vibe-budget --version
```

## Optional: OpenRouter API key

vibe-budget fetches live prices from OpenRouter automatically — 
no API key required for basic usage.

Prices are cached locally for 1 hour to avoid unnecessary requests.
If OpenRouter is unavailable, vibe-budget falls back to built-in pricing.

## Update to latest version
```bash
npm update -g vibe-budget
```

## Uninstall
```bash
npm uninstall -g vibe-budget
```