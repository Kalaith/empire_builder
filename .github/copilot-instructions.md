# Empire Builder - GitHub Copilot Instructions

**FOLLOW THESE INSTRUCTIONS FIRST** - Only fallback to additional search and context gathering if the information in these instructions is incomplete or found to be in error.

Empire Builder is a kingdom-building strategy game inspired by Majesty, featuring hero recruitment, building placement, and real-time enemy combat. This is a **frontend-only React TypeScript application** with no backend dependency.

## Working Effectively

### Initial Setup (Required for Fresh Clone)
```bash
# Navigate to frontend directory (ALL commands must be run from here)
cd frontend/

# Install dependencies
npm install
```
**Expected time**: 20-25 seconds (measured: 24s). No additional dependencies or SDKs required.

### Development Workflow
```bash
# Start development server (runs on port 5173)
npm run dev
# **NEVER CANCEL** - Development server runs continuously
# Expected startup time: 2-3 seconds (measured: 525ms startup)
# Access at: http://localhost:5173/

# In separate terminal window, run type checking
npm run type-check
# Expected time: 3-5 seconds (measured: 0.3s)

# Run linting before making changes
npm run lint
# Expected time: 2-3 seconds (measured: 1.7s)
```

### Build and Test
```bash
# Build for production
npm run build
# **NEVER CANCEL** - Build takes 5-10 seconds maximum (measured: 5s). Set timeout to 60+ seconds for safety.
# Output: dist/ directory with optimized files

# Preview production build
npm run preview
# **NEVER CANCEL** - Starts preview server on port 4173
# Expected startup time: 1-2 seconds (measured: instant)

# Run test command (currently no tests configured)
npm run test:run
# Expected time: Immediate (just echo command)
```

## Validation Requirements

### **CRITICAL**: Manual Validation After Changes
After making ANY code changes, you MUST test actual functionality:

1. **Start the development server**: `npm run dev`
2. **Navigate to http://localhost:5173**
3. **Test core game scenarios**:
   - Click on a building (e.g., "🏪 Marketplace") to select it
   - Verify the building becomes highlighted/active
   - Verify status message appears: "Selected [Building] - click empty cell to build"
   - Click on an empty grid cell to place the building
   - Verify the building appears on the grid
   - Wait 5-10 seconds to observe real-time game mechanics (gold income, enemy spawning)
   - Test hero recruitment by clicking "🦸 Recruit Hero" on any guild
   - Test flag placement by selecting a flag and placing it

4. **Test UI components**:
   - Verify resource counters update in real-time (gold, mana, supplies, population)
   - Test sidebar navigation (Info, Heroes, Quests, Awards, Saves tabs)
   - Test game restart functionality

### Pre-Commit Validation
ALWAYS run these commands before committing:
```bash
# Required quality checks
npm run lint          # Must pass - takes 2-3 seconds
npm run type-check     # Must pass - takes 3-5 seconds  
npm run build          # Must succeed - takes 5-10 seconds

# Manual testing
npm run dev            # Test actual gameplay scenarios above
```

## Repository Structure and Key Locations

### Primary Development Areas
```
frontend/src/
├── components/
│   ├── game/          # Core game components (GameGrid, entities)
│   ├── layout/        # UI layout (TopBar, LeftSidebar, RightSidebar)
│   └── ui/            # UI components (GameMessages, modals)
├── stores/            # Zustand state management
│   ├── gameStore.ts   # **CRITICAL**: Core game state and logic
│   └── uiStore.ts     # UI state and modal management
├── hooks/             # Custom React hooks
│   └── useGameLoop.ts # **CRITICAL**: Game timing and updates
├── data/              # Game configuration
│   └── gameData.ts    # **CRITICAL**: Buildings, heroes, enemies config
├── types/             # TypeScript definitions
│   └── game.ts        # **CRITICAL**: All game entity interfaces
└── utils/             # Helper functions
```

### Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - Styling configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - Linting rules

### CI/CD
- `.github/workflows/ci.yml` - Runs lint, type-check, test, and build
- `publish.ps1` - PowerShell deployment script (Windows environments only)

## Common Development Tasks

### Making Game Logic Changes
1. **Always check these files when modifying game mechanics**:
   - `stores/gameStore.ts` - Core state management
   - `data/gameData.ts` - Game configuration
   - `hooks/useGameLoop.ts` - Game timing
   - `types/game.ts` - Type definitions

2. **Test game mechanics changes**:
   - Build placement and validation
   - Hero recruitment and movement
   - Enemy spawning and combat
   - Resource generation and management
   - Real-time game loops

### Adding New Components
1. **Follow existing patterns**:
   - Use TypeScript interfaces for all props
   - Implement proper state management with Zustand
   - Use Tailwind CSS for styling
   - Add proper accessibility attributes

2. **Component organization**:
   - Game-specific: `components/game/`
   - Layout: `components/layout/`
   - UI elements: `components/ui/`

### Debugging Issues
1. **Check browser console** for React/TypeScript errors
2. **Use React DevTools** for component state inspection
3. **Common issues**:
   - Type errors: Run `npm run type-check`
   - Linting errors: Run `npm run lint`
   - Build failures: Check Vite configuration
   - Game loop issues: Check `useGameLoop.ts`

## Build and CI Information

### Build Times and Timeouts
- **npm install**: 20-25 seconds (measured: 24s)
- **npm run lint**: 2-3 seconds (measured: 1.7s)
- **npm run type-check**: 3-5 seconds (measured: 0.3s)
- **npm run build**: 5-10 seconds (measured: 5s) - NEVER CANCEL - set 60+ second timeout
- **npm run dev**: 2-3 second startup (measured: 525ms)
- **npm run preview**: 1-2 second startup (measured: instant)

### CI Pipeline (.github/workflows/ci.yml)
The CI runs on Ubuntu with Node.js 18 and executes:
1. Install dependencies (`npm ci`)
2. Linting (`npm run lint`)
3. Type checking (`npm run type-check`) 
4. Test runner (`npm run test:run`)
5. Production build (`npm run build`)
6. Build artifact verification

**All CI steps must pass** - always run the same commands locally before committing.

## Important Notes

- **No Backend**: This is a frontend-only game with local state persistence via Zustand
- **Real-time Game**: Uses intervals for income collection (3s), enemy spawning (5s), hero updates (1s)
- **State Persistence**: Game saves automatically - no manual save required
- **Modern Stack**: React 19, TypeScript 5.x, Vite 6.x, Tailwind CSS 4.x
- **No Tests**: Currently no unit tests configured (`npm run test:run` just echoes a message)

## Frequently Used Commands Reference

```bash
# Quick development cycle
cd frontend/
npm run dev              # Start development server
npm run lint             # Check code quality  
npm run type-check       # Verify TypeScript
npm run build            # Production build

# Full validation sequence
npm run lint && npm run type-check && npm run build && npm run dev
```

**Always validate changes through actual gameplay testing** - simply starting the application is not sufficient validation.