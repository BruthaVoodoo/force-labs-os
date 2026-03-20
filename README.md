# Force Labs Control Center

A macOS-inspired React web application for agent orchestration and monitoring. Built with Next.js, Tailwind CSS, and a fusion of glassmorphism and neumorphism design aesthetics.

## Features

- **Dock Navigation**: macOS-style bottom dock for switching between modules
- **Tabbed Interface**: Browser-like tab interface with reorderable tabs
- **Agent Status Dashboard**: Real-time monitoring of agent activity, uptime, and resource usage
- **Light/Dark Mode**: Full support for light and dark themes
- **Modern Design**: Glassmorphism and neumorphism blend for a refined, tactile interface

## Project Structure

```
force-labs/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main application page
│   └── favicon.ico
├── components/
│   ├── dock/
│   │   └── dock.tsx        # macOS-style dock navigation
│   ├── tabs/
│   │   └── tab-bar.tsx     # Reorderable tab interface
│   ├── modules/
│   │   ├── operations-module.tsx
│   │   ├── agent-status.tsx      # Agent monitoring dashboard
│   │   └── coming-soon-module.tsx # Placeholder for future modules
│   └── theme/
│       └── theme-provider.tsx     # Next-themes provider
├── styles/
│   └── globals.css         # Global styles and custom utilities
├── tailwind.config.ts      # Tailwind configuration with custom colors
├── postcss.config.js       # PostCSS configuration
├── next.config.js          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd ~/ai-workspace/projects/force-labs
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production

```bash
npm run build
npm start
```

The application will run on `http://localhost:5000`.

## Docker

### Quick Start with Docker Compose

```bash
npm run docker:compose:up
```

The application will be available at `http://localhost:5000`.

To stop:
```bash
npm run docker:compose:down
```

### Manual Docker Build & Run

Build the image:
```bash
npm run docker:build
```

Run the container:
```bash
npm run docker:run
```

Or use docker directly:
```bash
docker build -t force-labs:latest .
docker run -p 5000:5000 force-labs:latest
```

### Docker Configuration

- **Port**: 5000 (configurable in `docker-compose.yml`)
- **Base Image**: `node:20-alpine` (lightweight)
- **Build**: Multi-stage build for optimized final image
- **Health Check**: Enabled (30s interval, 10s timeout)

## Design System

### Glassmorphism
- Frosted glass effect with backdrop blur
- Semi-transparent backgrounds with refined borders
- Creates a modern, layered aesthetic

### Neumorphism
- Soft shadow pairs (highlight + shadow) for depth
- Subtle embossed and debossed effects
- Tactile, touchable interface feel

### Color Palette
- **Light Mode**: White, slate, with gradient accents
- **Dark Mode**: Slate-900 base with blue/emerald accents
- **Accent Colors**: Blue, emerald, orange, purple for status indicators

### Typography
- **Display**: Sora (bold, modern sans-serif)
- **Body**: Inter (readable, clean sans-serif)

## Modules

### Operations Module
- **Agent Status**: Monitor all active agents with real-time status, uptime, task count, and resource usage

### Brain Module (Coming Soon)
- Knowledge base and learning systems

### Labs Module (Coming Soon)
- Experimental features and research tools

## Keyboard Shortcuts (Future)
- `⌘+T` / `Ctrl+T`: New tab
- `⌘+W` / `Ctrl+W`: Close tab (disabled)
- `⌘+1-9` / `Ctrl+1-9`: Switch to module

## Technologies

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Theme**: next-themes
- **Language**: TypeScript
- **Font**: Google Fonts (Inter, Sora)

## Development Roadmap

1. ✅ Core UI scaffold (dock, tabs, modules)
2. ✅ Agent Status dashboard with mock data
3. 🔄 Connect to real agent status API
4. 📋 Add Mission Control to Operations module
5. 🧠 Implement Brain module
6. 🔬 Implement Labs module
7. 🔐 Add authentication and session management
8. 📊 Advanced monitoring and analytics
9. 🎨 Customizable theme and layout options

## Notes

- Tabs are reorderable but cannot be deleted
- The entire view replaces when switching modules or tabs
- No history/state is maintained across tab switches
- All agents visible are currently mocked; real API integration coming soon

## Author

Jason (Developer + Musician) with Revan (Digital Tactician)
