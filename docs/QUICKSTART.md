# CometX - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Git** for cloning the repository

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ALKHOARZMI/cometx.git
cd cometx
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 18 and React DOM
- TypeScript
- Vite build tool
- Tailwind CSS
- Chart.js
- @xenova/transformers
- Monaco Editor
- XTerm.js
- i18next for internationalization

### 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is busy).

## Features Overview

### Dashboard
- View real-time system metrics
- Interactive charts showing CPU and memory usage
- System status indicators

### AI Chat
- 100% local AI processing
- Privacy-first conversational interface
- No cloud dependencies
- Powered by Transformers.js

### Terminal
- Full-featured terminal emulator
- Built-in commands (help, clear, echo, date, whoami, about)
- Professional xterm.js integration

### Code Editor
- Monaco Editor (VS Code's editor)
- Syntax highlighting for multiple languages
- Code execution (JavaScript only for security)
- Save code to local files

### App Factory
- Create new applications from templates
- Multiple project templates available
- Quick scaffolding system

### Orchestrator
- Manage system services
- Start, stop, and restart services
- Monitor service status and resource usage

## Building for Production

### Create Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Language Support

CometX supports both English and Arabic with RTL (Right-to-Left) support:

1. Click the language icon in the sidebar
2. Select "العربية" for Arabic or "English" for English
3. The interface will automatically adjust layout direction

## Customization

### Changing Theme Colors

The neon green theme can be customized in `src/index.css`. Look for color values:
- Primary green: `#10b981`
- Accent green: `#4ade80`
- Dark background: `#030712`

### Adding New Pages

1. Create a new component in `src/pages/`
2. Import it in `src/App.tsx`
3. Add navigation item in `src/components/Layout.tsx`
4. Add translations in `src/locales/en.json` and `src/locales/ar.json`

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR. Your changes will appear immediately without page refresh.

### TypeScript Type Checking

```bash
npm run build
```

This command runs TypeScript compiler before building, catching type errors.

### Linting

```bash
npm run lint
```

Run ESLint to check code quality.

## Troubleshooting

### Port Already in Use

If port 5173 is busy, Vite will automatically use the next available port. Check the console output for the actual port.

### Build Errors

If you encounter build errors:

1. Delete `node_modules/` and `package-lock.json`
2. Run `npm install` again
3. Clear browser cache
4. Try `npm run build` again

### AI Model Loading Issues

The AI model downloads on first use. Ensure you have:
- Stable internet connection (first time only)
- Sufficient disk space (~500MB)
- Modern browser with WebAssembly support

### Performance Issues

For better performance:
- Use a Chromium-based browser (Chrome, Edge, Brave)
- Ensure WebGL is enabled
- Close unnecessary browser tabs
- Allow sufficient RAM (minimum 4GB recommended)

## Next Steps

- Read the [Deployment Guide](./DEPLOYMENT.md) for production deployment
- Explore the [Arabic Quick Start Guide](./QUICKSTART_AR.md)
- Check the main [README](./README.md) for detailed features

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Refer to documentation in the `docs/` folder

## License

MIT License - See [LICENSE](../LICENSE) file for details.
