# Force Labs Control Center

A macOS-inspired React web application for agent orchestration and monitoring. Built with Next.js, Tailwind CSS, and a fusion of glassmorphism and neumorphism design aesthetics.

Force Labs OS is the personal command and control center for Jason, powering AI agent coordination, work task management, cron job orchestration, and system monitoring.

## Features

- **Dock Navigation**: macOS-style bottom dock for switching between modules
- **Tabbed Interface**: Browser-like tab interface with reorderable tabs
- **Agent Status Dashboard**: Real-time monitoring of agent activity, uptime, and resource usage
- **PM Board**: Kanban-style work task management with drag-drop swimlanes
- **Cron Job Orchestration**: Monitor and manage scheduled automation
- **Labs Module**: Prototype management and client work tracking
- **Light/Dark Mode**: Full support for light and dark themes
- **Modern Design**: Glassmorphism and neumorphism blend for a refined, tactile interface

## Agent Hierarchy

```
Revan (Main Agent)
├── Bastila (Full-Stack Web Development Lead)
│   └── Squad: Frontend & backend systems
├── Obi-Wan (Operations Lead)
│   ├── Thrawn (Monitoring & Health Checks)
│   ├── Fennec Shand (Deployment & Build)
│   └── Cad Bane (CI/CD & Build Automation)
└── Additional Specialist Agents
    └── (Skill-specific contributions to Force Labs)
```

## Architecture Overview

Force Labs OS follows a **hierarchical React Context architecture** for state management and cross-module communication:

```
AppContext                     ← Global UI state (nav, tabs, badges)
  ├── AgentsContext            ← Live agent list & status
  ├── WorkContext              ← PM board tasks (central work queue)
  │   ├── OpsContext           ← Cron jobs & workspace
  │   ├── BrainContext         ← Briefs & memory
  │   └── LabsContext          ← Ideas & prototypes
```

**Key Design Principles:**
- Context is a transport mechanism, not a storage layer
- All domain data has exactly one owning context
- Cross-module writes flow through context functions, never bypass via direct API calls
- All context values are memoized; all functions use `useCallback`
- SQLite is the source of truth; Context is the live data layer

See `docs/ARCHITECTURE.md` for the complete architecture guide (mandatory reading before any code changes).

## Modules

### Operations Module (🛰️ Ops)
- **Agent Status Dashboard**: Monitor all active agents with real-time status, uptime, task count, and resource usage
- **Cron Job Management**: View cron jobs, scheduled automation, and execution history
- **Workspace Health**: Monitor system resources and deployment status
- **Owner**: Obi-Wan (Operations Lead) + squad

### Brain Module (🧠 Brain)
- **Daily Briefs**: Intelligence summaries and daily reports
- **Memory History**: Long-term memory snapshots and learning records
- **Status**: Coming soon (scaffolding in place)
- **Owner**: Revan + agents contributing knowledge

### Labs Module (🔬 Labs)
- **Idea Cards**: Prototype ideas and experimental features
- **Client Work**: Project tracking and deliverables
- **Integration**: Approved ideas flow to PM board as tasks
- **Status**: In development
- **Owner**: Experimental & client work coordination

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

The application will be available at **`http://localhost:3000`** (development port).

**Port Convention:**
- **3000**: Development (local `npm run dev`)
- **5000**: Production / Docker (deployed container)

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

- **Port**: 5000 (production/container, configurable in `docker-compose.yml`)
- **Base Image**: `node:20-alpine` (lightweight)
- **Build**: Multi-stage build for optimized final image
- **Health Check**: Enabled (30s interval, 10s timeout)
- **Node Version**: 20 (LTS)
- **Environment**: NODE_ENV=production

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

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Animation**: Framer Motion
- **Icons**: Lucide React (no emojis in UI)
- **Theme**: next-themes
- **Language**: TypeScript (strict mode)
- **Fonts**: Google Fonts (Inter, Sora)

### Backend
- **Runtime**: Node.js 18+
- **Database**: SQLite via `better-sqlite3`
- **API Routes**: Next.js API routes (no Express)
- **ORM/Query**: Direct SQLite queries

### Database
- **Primary**: SQLite (`data/work.db`)
- **Backup data**: JSON files (`data/labs-ideas.json`, etc.) — migrate to SQLite over time

### DevOps
- **Container**: Docker (multi-stage build, node:20-alpine)
- **Compose**: Docker Compose for local development
- **Build**: npm scripts (no make, no custom tooling)

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
