# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Empire Builder is a kingdom-building strategy game inspired by Majesty, featuring hero recruitment, building placement, and real-time enemy combat. The project uses a hybrid architecture combining a legacy vanilla JavaScript implementation with a modern React TypeScript frontend.

## Architecture

### Dual Implementation Structure
The project maintains two parallel implementations:
- **Legacy Implementation**: Vanilla JavaScript (`app.js`, `index.html`, `style.css`) - fully functional standalone version
- **Modern Implementation**: React TypeScript frontend (`frontend/`) - modular component-based version

Both implementations share the same core game mechanics and data structures but use different rendering and state management approaches.

### Modern Frontend Stack
- **React 19** with TypeScript 5.x
- **Vite 6.x** for build tooling and development server
- **Tailwind CSS 4.x** for styling with custom CSS variables
- **Zustand 5.x** for state management with persistence
- **Framer Motion** for animations
- **Chart.js** for data visualization

## Common Development Commands

### Frontend Development
```bash
# Navigate to frontend directory
cd frontend/

# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Deployment
```powershell
# Deploy to preview environment (H:\xampp\htdocs)
.\publish.ps1

# Deploy to production (F:\WebHatchery)
.\publish.ps1 -Production

# Clean deployment with verbose output
.\publish.ps1 -Clean -Verbose
```

## Game Architecture

### Core Game Systems
- **Grid-based Building Placement**: 20x15 tile grid with castle at center
- **Hero Management**: Four classes (Warrior, Ranger, Wizard, Rogue) with AI behavior
- **Flag System**: Reward flags (Attack, Explore, Defend) guide hero actions
- **Real-time Combat**: Heroes automatically engage enemies based on preferences
- **Economy**: Gold generation through buildings, income collection loops

### State Management (React Implementation)
- **GameStore** (`stores/gameStore.ts`): Core game state, building placement, hero/enemy management
- **UIStore** (`stores/uiStore.ts`): UI state, modal management, game messages
- Both stores use Zustand persistence for save/load functionality

### Data Architecture
- **Game Data** (`data/gameData.ts`): Centralized configuration for buildings, heroes, flags, enemies
- **Type Definitions** (`types/game.ts`): Comprehensive TypeScript interfaces for all game entities
- **Game Loop** (`hooks/useGameLoop.ts`): Custom hook managing game timing and updates

## Component Organization

### Layout Components (`components/layout/`)
- **TopBar**: Resource display (gold, heroes, population, enemies)
- **LeftSidebar**: Building placement menu organized by category
- **RightSidebar**: Entity info panel and hero list

### Game Components (`components/game/`)
- **GameGrid**: Main game area with tile-based interaction
- **Hero/Enemy/Building entities**: Individual game object representations

### UI Components (`components/ui/`)
- **GameMessages**: Status messages and notifications
- **GameOverModal**: End-game restart interface

## Legacy Implementation

The vanilla JavaScript implementation (`app.js`) contains the complete game logic in a single file:
- **GameState class**: Main state container with grid management
- **Entity classes**: Hero, Enemy, Building, Flag objects
- **Game loops**: Intervals for income, enemy spawning, and updates
- **DOM manipulation**: Direct HTML element management

## Key Configuration

### Game Constants (`GAME_CONFIG`)
- `GRID_WIDTH`: 20, `GRID_HEIGHT`: 15
- `STARTING_GOLD`: 500
- `INCOME_INTERVAL`: 3000ms (income collection)
- `ENEMY_SPAWN_INTERVAL`: 5000ms (enemy spawning)
- `HERO_UPDATE_INTERVAL`: 1000ms (hero AI updates)

### Entity Types
- **Buildings**: Castle, Guilds (Warrior/Ranger/Wizard/Rogue), Economy (Marketplace/Blacksmith/Inn), Defense (Guard Tower)
- **Heroes**: Class-based with health, damage, speed, and flag preferences
- **Enemies**: Goblin, Orc, Troll with escalating difficulty
- **Flags**: Attack, Explore, Defend with different costs and effects

## Development Patterns

### React Implementation Patterns
- **Custom Hooks**: `useGameLoop` for centralized game timing
- **Component Props**: Fully typed interfaces for all props
- **Store Actions**: Centralized state mutations through Zustand actions
- **Effect Management**: Careful cleanup of intervals and subscriptions

### Styling Approach
- **CSS Custom Properties**: Comprehensive color system in `style.css`
- **Tailwind Integration**: Modern utility classes in React components
- **Responsive Design**: Grid-based layout adapting to different screen sizes

## Testing and Quality

### Frontend Quality Tools
- **ESLint**: Code quality and React best practices
- **TypeScript**: Compile-time type checking
- **Prettier**: Code formatting (configured in ESLint)

### Development Workflow
1. **Setup**: `npm install` in frontend directory
2. **Development**: `npm run dev` for hot reloading
3. **Quality Check**: `npm run lint` before deployment
4. **Build**: `npm run build` for production assets
5. **Deploy**: `.\publish.ps1` for environment deployment

## Important Notes

- **No Backend**: This is a frontend-only game with local state persistence
- **Dual Architecture**: Maintain compatibility between vanilla JS and React implementations
- **State Persistence**: Game saves automatically via Zustand persistence
- **Real-time Updates**: Game loops handle continuous state updates and rendering
- **Modular Design**: React implementation prioritizes component reusability and type safety