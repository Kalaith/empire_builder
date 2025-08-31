// Game data from JSON
const BUILDING_TYPES = {
    "castle": {"name": "Castle", "cost": 0, "income": 10, "color": "#8B4513", "symbol": "🏰"},
    "warriorGuild": {"name": "Warrior Guild", "cost": 100, "income": 5, "color": "#FF6B6B", "symbol": "⚔️"},
    "rangerGuild": {"name": "Ranger Guild", "cost": 120, "income": 5, "color": "#4ECDC4", "symbol": "🏹"},
    "wizardGuild": {"name": "Wizard Guild", "cost": 150, "income": 5, "color": "#45B7D1", "symbol": "🔮"},
    "rogueGuild": {"name": "Rogue Guild", "cost": 80, "income": 5, "color": "#96CEB4", "symbol": "🗡️"},
    "marketplace": {"name": "Marketplace", "cost": 60, "income": 15, "color": "#FFEAA7", "symbol": "🏪"},
    "blacksmith": {"name": "Blacksmith", "cost": 80, "income": 8, "color": "#636E72", "symbol": "🔨"},
    "inn": {"name": "Inn", "cost": 50, "income": 12, "color": "#FD79A8", "symbol": "🍺"},
    "guardTower": {"name": "Guard Tower", "cost": 40, "income": 2, "color": "#2D3436", "symbol": "🗼"}
};

const HERO_CLASSES = {
    "warrior": {"name": "Warrior", "health": 100, "damage": 20, "speed": 1, "color": "#FF6B6B", "symbol": "🛡️", "preferences": ["attack", "defend"]},
    "ranger": {"name": "Ranger", "health": 80, "damage": 15, "speed": 2, "color": "#4ECDC4", "symbol": "🏹", "preferences": ["explore", "attack"]},
    "wizard": {"name": "Wizard", "health": 60, "damage": 25, "speed": 1, "color": "#45B7D1", "symbol": "🔮", "preferences": ["attack", "explore"]},
    "rogue": {"name": "Rogue", "health": 70, "damage": 18, "speed": 2, "color": "#96CEB4", "symbol": "🗡️", "preferences": ["gold", "explore"]}
};

const FLAG_TYPES = {
    "attack": {"name": "Attack Flag", "color": "#FF0000", "symbol": "⚔️", "baseCost": 50},
    "explore": {"name": "Explore Flag", "color": "#00FF00", "symbol": "🔍", "baseCost": 30},
    "defend": {"name": "Defend Flag", "color": "#0000FF", "symbol": "🛡️", "baseCost": 40}
};

const ENEMY_TYPES = {
    "goblin": {"name": "Goblin", "health": 40, "damage": 8, "reward": 20, "color": "#228B22", "symbol": "👹"},
    "orc": {"name": "Orc", "health": 60, "damage": 12, "reward": 35, "color": "#8B0000", "symbol": "👹"},
    "troll": {"name": "Troll", "health": 120, "damage": 25, "reward": 80, "color": "#4B0082", "symbol": "👹"}
};

// Game state
class GameState {
    constructor() {
        this.gold = 500;
        this.gridWidth = 20;
        this.gridHeight = 15;
        this.grid = [];
        this.buildings = [];
        this.heroes = [];
        this.enemies = [];
        this.flags = [];
        this.selectedBuildingType = null;
        this.selectedFlagType = null;
        this.selectedEntity = null;
        this.gameTime = 0;
        this.isGameOver = false;
        this.nextHeroId = 1;
        this.nextEnemyId = 1;
        
        this.initializeGrid();
        this.placeCastle();
    }
    
    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            const row = [];
            for (let x = 0; x < this.gridWidth; x++) {
                row.push({ x, y, building: null, hero: null, enemy: null, flag: null });
            }
            this.grid.push(row);
        }
    }
    
    placeCastle() {
        const centerX = Math.floor(this.gridWidth / 2);
        const centerY = Math.floor(this.gridHeight / 2);
        
        const castle = {
            id: 'castle',
            type: 'castle',
            x: centerX,
            y: centerY,
            ...BUILDING_TYPES.castle
        };
        
        this.buildings.push(castle);
        this.grid[centerY][centerX].building = castle;
    }
    
    canPlaceBuilding(x, y) {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return false;
        return this.grid[y][x].building === null;
    }
    
    placeBuilding(type, x, y) {
        if (!this.canPlaceBuilding(x, y)) {
            return false;
        }
        
        const buildingData = BUILDING_TYPES[type];
        if (this.gold < buildingData.cost) {
            return false;
        }
        
        const building = {
            id: `building_${this.buildings.length}`,
            type,
            x,
            y,
            ...buildingData
        };
        
        this.buildings.push(building);
        this.grid[y][x].building = building;
        this.gold -= building.cost;
        
        return building;
    }
    
    spawnHero(guildType) {
        const heroType = guildType.replace('Guild', '').toLowerCase();
        const guild = this.buildings.find(b => b.type === guildType);
        if (!guild || !HERO_CLASSES[heroType]) return null;
        
        const heroClass = HERO_CLASSES[heroType];
        const hero = {
            id: `hero_${this.nextHeroId++}`,
            type: heroType,
            x: guild.x,
            y: guild.y,
            targetX: guild.x,
            targetY: guild.y,
            maxHealth: heroClass.health,
            health: heroClass.health,
            damage: heroClass.damage,
            gold: 0,
            level: 1,
            experience: 0,
            equipment: 0,
            moveCooldown: 0,
            lastAction: 'spawned',
            name: heroClass.name,
            symbol: heroClass.symbol,
            preferences: [...heroClass.preferences]
        };
        
        this.heroes.push(hero);
        this.updateHeroPosition(hero);
        
        return hero;
    }
    
    spawnEnemy() {
        const enemyTypes = Object.keys(ENEMY_TYPES);
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        // Spawn at random edge
        let x, y;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // Top
                x = Math.floor(Math.random() * this.gridWidth);
                y = 0;
                break;
            case 1: // Right
                x = this.gridWidth - 1;
                y = Math.floor(Math.random() * this.gridHeight);
                break;
            case 2: // Bottom
                x = Math.floor(Math.random() * this.gridWidth);
                y = this.gridHeight - 1;
                break;
            case 3: // Left
                x = 0;
                y = Math.floor(Math.random() * this.gridHeight);
                break;
        }
        
        if (this.grid[y][x].building || this.grid[y][x].enemy) {
            return null; // Try again later
        }
        
        const enemyData = ENEMY_TYPES[type];
        const enemy = {
            id: `enemy_${this.nextEnemyId++}`,
            type,
            x,
            y,
            targetX: x,
            targetY: y,
            maxHealth: enemyData.health,
            health: enemyData.health,
            damage: enemyData.damage,
            reward: enemyData.reward,
            moveCooldown: 0,
            name: enemyData.name,
            symbol: enemyData.symbol
        };
        
        this.enemies.push(enemy);
        this.updateEnemyPosition(enemy);
        
        return enemy;
    }
    
    placeFlag(type, x, y) {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return false;
        if (this.gold < FLAG_TYPES[type].baseCost) return false;
        if (this.grid[y][x].flag || this.grid[y][x].building) return false;
        
        const flagData = FLAG_TYPES[type];
        const flag = {
            id: `flag_${this.flags.length}`,
            type,
            x,
            y,
            reward: flagData.baseCost,
            name: flagData.name,
            symbol: flagData.symbol,
            baseCost: flagData.baseCost
        };
        
        this.flags.push(flag);
        this.grid[y][x].flag = flag;
        this.gold -= flag.baseCost;
        
        return flag;
    }
    
    updateHeroPosition(hero) {
        // Clear old position
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x].hero === hero) {
                    this.grid[y][x].hero = null;
                }
            }
        }
        
        // Set new position
        this.grid[hero.y][hero.x].hero = hero;
    }
    
    updateEnemyPosition(enemy) {
        // Clear old position
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x].enemy === enemy) {
                    this.grid[y][x].enemy = null;
                }
            }
        }
        
        // Set new position
        this.grid[enemy.y][enemy.x].enemy = enemy;
    }
    
    removeFlag(flag) {
        this.flags = this.flags.filter(f => f.id !== flag.id);
        this.grid[flag.y][flag.x].flag = null;
    }
    
    removeEnemy(enemy) {
        this.enemies = this.enemies.filter(e => e.id !== enemy.id);
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x].enemy === enemy) {
                    this.grid[y][x].enemy = null;
                }
            }
        }
    }
    
    removeHero(hero) {
        this.heroes = this.heroes.filter(h => h.id !== hero.id);
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x].hero === hero) {
                    this.grid[y][x].hero = null;
                }
            }
        }
    }
    
    collectIncome() {
        let income = 0;
        this.buildings.forEach(building => {
            income += building.income || 0;
        });
        this.gold += income;
        if (income > 0) {
            showMessage(`Collected ${income} gold from buildings`, 'success');
        }
    }
    
    isGameRunning() {
        return !this.isGameOver;
    }
}

// Game instance
let game = new GameState();

// UI Elements
const goldDisplay = document.getElementById('gold-amount');
const heroCountDisplay = document.getElementById('hero-count');
const populationDisplay = document.getElementById('population');
const enemyCountDisplay = document.getElementById('enemy-count');
const gameGrid = document.getElementById('game-grid');
const selectedInfo = document.getElementById('selected-info');
const heroList = document.getElementById('hero-list');
const gameMessages = document.getElementById('game-messages');
const gameOverModal = document.getElementById('game-over-modal');
const restartBtn = document.getElementById('restart-btn');

// Game logic
function initializeGame() {
    createGrid();
    setupEventListeners();
    updateUI();
    startGameLoop();
}

function createGrid() {
    gameGrid.innerHTML = '';
    
    for (let y = 0; y < game.gridHeight; y++) {
        for (let x = 0; x < game.gridWidth; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            cell.addEventListener('click', () => handleCellClick(x, y));
            gameGrid.appendChild(cell);
        }
    }
}

function setupEventListeners() {
    // Building buttons
    document.querySelectorAll('.building-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            selectBuildingType(type);
        });
    });
    
    // Flag buttons
    document.querySelectorAll('.flag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            if (type) {
                selectFlagType(type);
            } else {
                cancelSelection();
            }
        });
    });
    
    // Restart button
    restartBtn.addEventListener('click', restartGame);
}

function selectBuildingType(type) {
    game.selectedBuildingType = type;
    game.selectedFlagType = null;
    
    // Update button states
    document.querySelectorAll('.building-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.type === type);
    });
    document.querySelectorAll('.flag-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    updateBuildingButtons();
    showMessage(`Selected ${BUILDING_TYPES[type].name} - click empty cell to build`, 'info');
}

function selectFlagType(type) {
    game.selectedFlagType = type;
    game.selectedBuildingType = null;
    
    // Update button states
    document.querySelectorAll('.flag-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.type === type);
    });
    document.querySelectorAll('.building-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    showMessage(`Selected ${FLAG_TYPES[type].name} - click empty cell to place`, 'info');
}

function cancelSelection() {
    game.selectedBuildingType = null;
    game.selectedFlagType = null;
    
    document.querySelectorAll('.building-btn, .flag-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    showMessage('Selection cancelled', 'info');
}

function handleCellClick(x, y) {
    const cell = game.grid[y][x];
    
    if (game.selectedBuildingType) {
        // Try to place building
        const building = game.placeBuilding(game.selectedBuildingType, x, y);
        if (building) {
            showMessage(`${building.name} built for ${building.cost} gold!`, 'success');
            updateUI();
            
            // Auto-spawn heroes from guilds after a short delay
            if (building.type.includes('Guild')) {
                setTimeout(() => {
                    const hero = game.spawnHero(building.type);
                    if (hero) {
                        showMessage(`${hero.name} ${hero.type} joins your kingdom!`, 'success');
                        updateUI();
                    }
                }, 1000);
            }
            
            cancelSelection();
        } else {
            if (game.gold < BUILDING_TYPES[game.selectedBuildingType].cost) {
                showMessage('Not enough gold!', 'error');
            } else {
                showMessage('Cannot place building here!', 'error');
            }
        }
    } else if (game.selectedFlagType) {
        // Try to place flag
        const flag = game.placeFlag(game.selectedFlagType, x, y);
        if (flag) {
            showMessage(`${flag.name} placed for ${flag.baseCost} gold!`, 'success');
            updateUI();
            cancelSelection();
        } else {
            if (game.gold < FLAG_TYPES[game.selectedFlagType].baseCost) {
                showMessage('Not enough gold!', 'error');
            } else {
                showMessage('Cannot place flag here!', 'error');
            }
        }
    } else {
        // Select entity for inspection
        if (cell.hero) {
            selectEntity(cell.hero, 'hero');
        } else if (cell.enemy) {
            selectEntity(cell.enemy, 'enemy');
        } else if (cell.building) {
            selectEntity(cell.building, 'building');
        } else if (cell.flag) {
            selectEntity(cell.flag, 'flag');
        } else {
            game.selectedEntity = null;
            updateSelectedInfo();
        }
    }
}

function selectEntity(entity, type) {
    game.selectedEntity = { entity, type };
    updateSelectedInfo();
    updateHeroList();
}

function updateUI() {
    updateStats();
    updateGrid();
    updateSelectedInfo();
    updateHeroList();
    updateBuildingButtons();
}

function updateStats() {
    goldDisplay.textContent = game.gold;
    heroCountDisplay.textContent = game.heroes.length;
    populationDisplay.textContent = game.buildings.length;
    enemyCountDisplay.textContent = game.enemies.length;
}

function updateGrid() {
    const cells = gameGrid.children;
    
    for (let i = 0; i < cells.length; i++) {
        const x = i % game.gridWidth;
        const y = Math.floor(i / game.gridWidth);
        const cell = cells[i];
        const gridCell = game.grid[y][x];
        
        // Clear cell
        cell.className = 'grid-cell';
        cell.innerHTML = '';
        cell.style.outline = '';
        
        // Add building
        if (gridCell.building) {
            cell.classList.add('building');
            cell.innerHTML += `<span class="building-sprite">${gridCell.building.symbol}</span>`;
        }
        
        // Add flag
        if (gridCell.flag) {
            cell.classList.add('flag');
            cell.innerHTML += `<span class="flag-sprite">${gridCell.flag.symbol}</span>`;
        }
        
        // Add enemy
        if (gridCell.enemy) {
            cell.classList.add('enemy');
            cell.innerHTML += `<span class="enemy-sprite">${gridCell.enemy.symbol}</span>`;
            
            // Add health bar
            const healthBar = document.createElement('div');
            healthBar.className = 'health-bar';
            const healthFill = document.createElement('div');
            healthFill.className = 'health-fill';
            healthFill.style.width = `${(gridCell.enemy.health / gridCell.enemy.maxHealth) * 100}%`;
            healthBar.appendChild(healthFill);
            cell.appendChild(healthBar);
        }
        
        // Add hero
        if (gridCell.hero) {
            cell.classList.add('hero');
            cell.innerHTML += `<span class="hero-sprite">${gridCell.hero.symbol}</span>`;
            
            // Add health bar
            const healthBar = document.createElement('div');
            healthBar.className = 'health-bar';
            const healthFill = document.createElement('div');
            healthFill.className = 'health-fill';
            healthFill.style.width = `${(gridCell.hero.health / gridCell.hero.maxHealth) * 100}%`;
            healthBar.appendChild(healthFill);
            cell.appendChild(healthBar);
        }
        
        // Highlight selected entity
        if (game.selectedEntity) {
            const { entity } = game.selectedEntity;
            if ((gridCell.hero && gridCell.hero.id === entity.id) ||
                (gridCell.enemy && gridCell.enemy.id === entity.id) ||
                (gridCell.building && gridCell.building.id === entity.id) ||
                (gridCell.flag && gridCell.flag.id === entity.id)) {
                cell.style.outline = '2px solid var(--color-primary)';
            }
        }
    }
}

function updateSelectedInfo() {
    if (!game.selectedEntity) {
        selectedInfo.innerHTML = '<p>Click on a building, hero, or enemy to see details</p>';
        return;
    }
    
    const { entity, type } = game.selectedEntity;
    let html = '';
    
    switch (type) {
        case 'hero':
            html = `
                <h4>${entity.name} ${entity.type} (Level ${entity.level})</h4>
                <p><strong>Health:</strong> ${entity.health}/${entity.maxHealth}</p>
                <p><strong>Damage:</strong> ${entity.damage + entity.equipment}</p>
                <p><strong>Gold:</strong> ${entity.gold}</p>
                <p><strong>Experience:</strong> ${entity.experience}/100</p>
                <p><strong>Action:</strong> ${entity.lastAction}</p>
                <p><strong>Position:</strong> (${entity.x}, ${entity.y})</p>
            `;
            break;
        case 'enemy':
            html = `
                <h4>${entity.name}</h4>
                <p><strong>Health:</strong> ${entity.health}/${entity.maxHealth}</p>
                <p><strong>Damage:</strong> ${entity.damage}</p>
                <p><strong>Reward:</strong> ${entity.reward} gold</p>
                <p><strong>Position:</strong> (${entity.x}, ${entity.y})</p>
            `;
            break;
        case 'building':
            html = `
                <h4>${entity.name}</h4>
                <p><strong>Cost:</strong> ${entity.cost} gold</p>
                <p><strong>Income:</strong> ${entity.income} gold/turn</p>
                <p><strong>Location:</strong> (${entity.x}, ${entity.y})</p>
            `;
            break;
        case 'flag':
            html = `
                <h4>${entity.name}</h4>
                <p><strong>Reward:</strong> ${entity.reward} gold</p>
                <p><strong>Type:</strong> ${entity.type}</p>
                <p><strong>Location:</strong> (${entity.x}, ${entity.y})</p>
                <button onclick="removeFlag('${entity.id}')" class="btn btn--sm">Remove Flag</button>
            `;
            break;
    }
    
    selectedInfo.innerHTML = html;
}

function updateHeroList() {
    if (game.heroes.length === 0) {
        heroList.innerHTML = '<p class="empty-message">No heroes recruited yet</p>';
        return;
    }
    
    let heroHtml = '';
    game.heroes.forEach(hero => {
        const isSelected = game.selectedEntity && game.selectedEntity.entity.id === hero.id;
        heroHtml += `
            <div class="hero-item ${isSelected ? 'selected' : ''}" onclick="selectEntityById('${hero.id}', 'hero')">
                <div class="hero-avatar">${hero.symbol}</div>
                <div class="hero-details">
                    <div class="hero-name">${hero.name} ${hero.type} (Lv.${hero.level})</div>
                    <div class="hero-stats">HP: ${hero.health}/${hero.maxHealth} | Gold: ${hero.gold}</div>
                </div>
            </div>
        `;
    });
    
    heroList.innerHTML = heroHtml;
}

function updateBuildingButtons() {
    document.querySelectorAll('.building-btn').forEach(btn => {
        const type = btn.dataset.type;
        const cost = BUILDING_TYPES[type].cost;
        const canAfford = game.gold >= cost;
        
        btn.disabled = !canAfford;
        btn.style.opacity = canAfford ? '1' : '0.5';
    });
    
    document.querySelectorAll('.flag-btn:not(.cancel-btn)').forEach(btn => {
        const type = btn.dataset.type;
        const cost = FLAG_TYPES[type].baseCost;
        const canAfford = game.gold >= cost;
        
        btn.disabled = !canAfford;
        btn.style.opacity = canAfford ? '1' : '0.5';
    });
}

function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `game-message ${type}`;
    message.textContent = text;
    
    gameMessages.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 4000);
}

// Game loop
function startGameLoop() {
    setInterval(() => {
        if (!game.isGameRunning()) return;
        
        updateHeroes();
        updateEnemies();
        updateCombat();
        
        // Income every 5 seconds
        if (game.gameTime % 5 === 0) {
            game.collectIncome();
        }
        
        // Spawn enemies periodically
        if (game.gameTime % 8 === 0 && Math.random() < 0.5) {
            const enemy = game.spawnEnemy();
            if (enemy) {
                showMessage(`${enemy.name} approaches your kingdom!`, 'error');
            }
        }
        
        // Check win/lose conditions
        checkGameState();
        
        game.gameTime++;
        updateUI();
    }, 1000);
}

function updateHeroes() {
    game.heroes.forEach(hero => {
        if (hero.moveCooldown > 0) {
            hero.moveCooldown--;
            return;
        }
        
        updateHeroAI(hero);
        hero.moveCooldown = Math.max(1, 3 - hero.speed);
    });
}

function updateHeroAI(hero) {
    // Find nearby enemies
    const nearbyEnemies = findNearbyEnemies(hero, 4);
    const nearbyFlags = findNearbyFlags(hero, 6);
    
    let targetFlag = null;
    let bestScore = -1;
    
    // Evaluate flags based on hero preferences
    nearbyFlags.forEach(flag => {
        let score = 0;
        if (hero.preferences.includes(flag.type)) {
            score += 50;
        }
        if (flag.type === 'attack' && nearbyEnemies.length > 0) {
            score += 30;
        }
        if (flag.type === 'explore' && hero.type === 'ranger') {
            score += 40;
        }
        
        // Distance penalty
        const distance = Math.abs(hero.x - flag.x) + Math.abs(hero.y - flag.y);
        score -= distance * 5;
        
        if (score > bestScore) {
            bestScore = score;
            targetFlag = flag;
        }
    });
    
    // Decide action
    if (nearbyEnemies.length > 0 && (hero.health > hero.maxHealth * 0.3)) {
        // Attack nearby enemy
        const enemy = nearbyEnemies[0];
        moveHeroTowards(hero, enemy.x, enemy.y);
        hero.lastAction = 'hunting enemy';
    } else if (targetFlag && bestScore > 20) {
        // Move towards attractive flag
        moveHeroTowards(hero, targetFlag.x, targetFlag.y);
        hero.lastAction = `seeking ${targetFlag.name}`;
    } else {
        // Random exploration
        const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];
        
        if (Math.random() < 0.8) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const newX = Math.max(0, Math.min(game.gridWidth - 1, hero.x + direction.dx));
            const newY = Math.max(0, Math.min(game.gridHeight - 1, hero.y + direction.dy));
            
            if (!game.grid[newY][newX].building && !game.grid[newY][newX].hero) {
                hero.x = newX;
                hero.y = newY;
                game.updateHeroPosition(hero);
                hero.lastAction = 'exploring';
            }
        }
    }
}

function findNearbyEnemies(hero, range) {
    return game.enemies.filter(enemy => {
        const distance = Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y);
        return distance <= range;
    });
}

function findNearbyFlags(hero, range) {
    return game.flags.filter(flag => {
        const distance = Math.abs(hero.x - flag.x) + Math.abs(hero.y - flag.y);
        return distance <= range;
    });
}

function moveHeroTowards(hero, targetX, targetY) {
    const dx = targetX - hero.x;
    const dy = targetY - hero.y;
    
    let moveX = 0, moveY = 0;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        moveX = dx > 0 ? 1 : -1;
    } else {
        moveY = dy > 0 ? 1 : -1;
    }
    
    const newX = Math.max(0, Math.min(game.gridWidth - 1, hero.x + moveX));
    const newY = Math.max(0, Math.min(game.gridHeight - 1, hero.y + moveY));
    
    if (!game.grid[newY][newX].building && !game.grid[newY][newX].hero) {
        hero.x = newX;
        hero.y = newY;
        game.updateHeroPosition(hero);
    }
}

function updateEnemies() {
    game.enemies.forEach(enemy => {
        if (enemy.moveCooldown > 0) {
            enemy.moveCooldown--;
            return;
        }
        
        // Simple AI: move towards castle or random
        const castle = game.buildings.find(b => b.type === 'castle');
        if (castle && Math.random() < 0.7) {
            moveEnemyTowards(enemy, castle.x, castle.y);
        } else {
            // Random movement
            const directions = [
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
                { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
            ];
            
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const newX = Math.max(0, Math.min(game.gridWidth - 1, enemy.x + direction.dx));
            const newY = Math.max(0, Math.min(game.gridHeight - 1, enemy.y + direction.dy));
            
            if (!game.grid[newY][newX].building && !game.grid[newY][newX].enemy) {
                enemy.x = newX;
                enemy.y = newY;
                game.updateEnemyPosition(enemy);
            }
        }
        
        enemy.moveCooldown = 2;
    });
}

function moveEnemyTowards(enemy, targetX, targetY) {
    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;
    
    let moveX = 0, moveY = 0;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        moveX = dx > 0 ? 1 : -1;
    } else {
        moveY = dy > 0 ? 1 : -1;
    }
    
    const newX = Math.max(0, Math.min(game.gridWidth - 1, enemy.x + moveX));
    const newY = Math.max(0, Math.min(game.gridHeight - 1, enemy.y + moveY));
    
    if (!game.grid[newY][newX].building && !game.grid[newY][newX].enemy) {
        enemy.x = newX;
        enemy.y = newY;
        game.updateEnemyPosition(enemy);
    }
}

function updateCombat() {
    // Check for hero-enemy encounters
    for (let y = 0; y < game.gridHeight; y++) {
        for (let x = 0; x < game.gridWidth; x++) {
            const cell = game.grid[y][x];
            if (cell.hero && cell.enemy) {
                resolveCombat(cell.hero, cell.enemy);
            }
        }
    }
}

function resolveCombat(hero, enemy) {
    // Hero attacks enemy
    const heroDamage = hero.damage + hero.equipment + Math.floor(Math.random() * 5);
    enemy.health -= heroDamage;
    
    if (enemy.health <= 0) {
        // Enemy defeated
        hero.gold += enemy.reward;
        hero.experience += 20;
        game.gold += Math.floor(enemy.reward / 2); // Kingdom also gets gold
        
        // Level up check
        if (hero.experience >= 100) {
            hero.level++;
            hero.maxHealth += 10;
            hero.health = hero.maxHealth;
            hero.damage += 2;
            hero.experience = 0;
            showMessage(`${hero.name} ${hero.type} reached level ${hero.level}!`, 'success');
        }
        
        // Check for flag completion
        const flag = game.grid[enemy.y][enemy.x].flag;
        if (flag && flag.type === 'attack') {
            hero.gold += flag.reward;
            game.gold += flag.reward;
            showMessage(`Attack flag completed! +${flag.reward} gold`, 'success');
            game.removeFlag(flag);
        }
        
        game.removeEnemy(enemy);
        showMessage(`${enemy.name} defeated by ${hero.name} ${hero.type}!`, 'success');
    } else {
        // Enemy attacks back
        const enemyDamage = enemy.damage + Math.floor(Math.random() * 3);
        hero.health -= enemyDamage;
        
        if (hero.health <= 0) {
            // Hero defeated
            showMessage(`${hero.name} ${hero.type} has fallen!`, 'error');
            
            // Respawn at guild (simplified)
            const guild = game.buildings.find(b => b.type === hero.type + 'Guild');
            if (guild && game.gold >= 50) {
                hero.health = hero.maxHealth;
                hero.x = guild.x;
                hero.y = guild.y;
                game.gold -= 50;
                game.updateHeroPosition(hero);
                showMessage(`${hero.name} ${hero.type} respawned at guild (-50 gold)`, 'info');
            } else {
                game.removeHero(hero);
                showMessage(`${hero.name} ${hero.type} could not be revived`, 'error');
            }
        }
    }
}

function checkGameState() {
    const castle = game.buildings.find(b => b.type === 'castle');
    if (!castle) {
        game.isGameOver = true;
        showGameOver('Your castle has been destroyed!');
        return;
    }
    
    // Check if enemy reached castle
    const castleCell = game.grid[castle.y][castle.x];
    if (castleCell.enemy) {
        game.isGameOver = true;
        showGameOver('Enemies have overrun your castle!');
        return;
    }
}

function showGameOver(message) {
    document.getElementById('game-over-message').textContent = message;
    gameOverModal.classList.remove('hidden');
}

function restartGame() {
    game = new GameState();
    gameOverModal.classList.add('hidden');
    gameMessages.innerHTML = '';
    createGrid();
    updateUI();
    showMessage('Welcome to your new kingdom!', 'success');
}

function removeFlag(flagId) {
    const flag = game.flags.find(f => f.id === flagId);
    if (flag) {
        game.removeFlag(flag);
        game.gold += Math.floor(flag.baseCost / 2); // Refund half
        showMessage('Flag removed - half cost refunded', 'info');
        updateUI();
    }
}

function selectEntityById(entityId, type) {
    let entity = null;
    switch(type) {
        case 'hero':
            entity = game.heroes.find(h => h.id === entityId);
            break;
        case 'enemy':
            entity = game.enemies.find(e => e.id === entityId);
            break;
        case 'building':
            entity = game.buildings.find(b => b.id === entityId);
            break;
        case 'flag':
            entity = game.flags.find(f => f.id === entityId);
            break;
    }
    
    if (entity) {
        selectEntity(entity, type);
    }
}

// Make functions available globally for onclick handlers
window.selectEntity = selectEntity;
window.selectEntityById = selectEntityById;
window.removeFlag = removeFlag;

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    showMessage('Welcome to your kingdom! Build guilds to recruit heroes.', 'success');
});