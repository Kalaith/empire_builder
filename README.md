# Empire Builder

A kingdom-building strategy game inspired by Majesty, featuring hero recruitment, building placement, and real-time enemy combat. Build your empire, recruit heroes, and defend against waves of enemies in this engaging strategy game.

## 🎮 Game Features

- **Grid-based Building System**: Place buildings on a 20x15 tile grid with your castle at the center
- **Hero Recruitment**: Recruit four distinct hero classes (Warrior, Ranger, Wizard, Rogue) with unique abilities and AI behavior
- **Real-time Combat**: Heroes automatically engage enemies based on their preferences and flag assignments
- **Flag System**: Guide hero actions with Attack, Explore, and Defend flags
- **Economy Management**: Generate gold through buildings and manage your kingdom's resources
- **Enemy Waves**: Face escalating enemy threats from goblins to trolls
- **Save/Load System**: Persistent game state with automatic saving

## 🏗️ Architecture

###  Implementation

- ** Implementation**: React TypeScript frontend (`frontend/`) - modular and component-based

### Tech Stack (Modern Frontend)
- **React 19** with TypeScript 5.x
- **Vite 6.x** for build tooling and development server
- **Tailwind CSS 4.x** for styling
- **Zustand 5.x** for state management with persistence
- **Framer Motion** for animations
- **Chart.js** for data visualization
- **React Router DOM** for navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd empire-builder
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:5173`

## 🎯 How to Play

1. **Build Your Kingdom**: Start with your castle in the center. Place buildings around it to generate income and recruit heroes.

2. **Recruit Heroes**: Build guilds (Warrior, Ranger, Wizard, Rogue) to recruit heroes. Each hero class has unique stats and preferences.

3. **Place Flags**: Use flags to guide hero behavior:
   - **Attack Flag** (Red): Directs heroes to engage enemies
   - **Explore Flag** (Green): Encourages exploration and discovery
   - **Defend Flag** (Blue): Positions heroes for defense

4. **Manage Resources**: Collect gold from your buildings to fund expansion and hero recruitment.

5. **Defend Your Kingdom**: Enemies will spawn periodically. Your heroes will automatically engage based on their preferences and flag assignments.

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── game/          # Game-specific components
│   │   ├── layout/        # Layout components (TopBar, Sidebars)
│   │   └── ui/            # UI components (Messages, Modals)
│   ├── stores/            # Zustand state management
│   │   ├── gameStore.ts   # Core game state
│   │   └── uiStore.ts     # UI state
│   ├── hooks/             # Custom React hooks
│   ├── data/              # Game configuration data
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── public/                # Static assets
└── package.json
```

### Key Components

- **GameGrid**: Main game area with tile-based interaction
- **TopBar**: Displays resources (gold, heroes, population, enemies)
- **LeftSidebar**: Building placement menu
- **RightSidebar**: Entity information and hero list
- **GameMessages**: Status messages and notifications
- **GameOverModal**: End-game restart interface

## 🎲 Game Mechanics

### Buildings
- **Castle**: Your central stronghold (free, generates 10 gold)
- **Guilds**: Recruit heroes (Warrior: 100g, Ranger: 120g, Wizard: 150g, Rogue: 80g)
- **Economy**: Generate income (Marketplace: 60g, Blacksmith: 80g, Inn: 50g)
- **Defense**: Guard Tower (40g) for protection

### Heroes
Each hero class has unique stats and preferences:
- **Warrior**: High health/damage, prefers Attack/Defend
- **Ranger**: Fast movement, prefers Explore/Attack
- **Wizard**: High damage, prefers Attack/Explore
- **Rogue**: Balanced, prefers Gold/Explore

### Enemies
- **Goblin**: Basic enemy (40 HP, 8 damage, 20g reward)
- **Orc**: Medium threat (60 HP, 12 damage, 35g reward)
- **Troll**: Elite enemy (120 HP, 25 damage, 80g reward)

## 🚀 Deployment

### Local Deployment
```powershell
# Deploy to preview environment
.\publish.ps1

# Deploy to production
.\publish.ps1 -Production

# Clean deployment with verbose output
.\publish.ps1 -Clean -Verbose
```

### Build for Production
```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## 🙏 Acknowledgments

- Inspired by the classic game Majesty
- Built with modern web technologies
- Special thanks to the open-source community

## License

This project is licensed under the MIT License - see the individual component README files for details.

**Enjoy building your empire! 🏰**

Part of the WebHatchery game collection.
