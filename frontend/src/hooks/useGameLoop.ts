import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { GAME_CONFIG } from '../data/gameData';
import type { Hero, Enemy, Flag } from '../types/game';

export const useGameLoop = () => {
  const {
    grid,
    gridWidth,
    gridHeight,
    heroes,
    enemies,
    flags,
    buildings,
    updateHeroPosition,
    updateEnemyPosition,
    removeFlag,
    removeEnemy,
    removeHero
  } = useGameStore();

  const { addGameMessage, setShowGameOverModal } = useUIStore();

  // Find nearby entities for heroes
  const findNearbyEnemies = useCallback((hero: Hero, range: number) => {
    return enemies.filter(enemy => {
      const distance = Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y);
      return distance <= range;
    });
  }, [enemies]);

  const findNearbyFlags = useCallback((hero: Hero, range: number) => {
    return flags.filter(flag => {
      const distance = Math.abs(hero.x - flag.x) + Math.abs(hero.y - flag.y);
      return distance <= range;
    });
  }, [flags]);

  // Move hero towards target
  const moveHeroTowards = useCallback((hero: Hero, targetX: number, targetY: number) => {
    const dx = targetX - hero.x;
    const dy = targetY - hero.y;

    let moveX = 0, moveY = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
      moveX = dx > 0 ? 1 : -1;
    } else {
      moveY = dy > 0 ? 1 : -1;
    }

    const newX = Math.max(0, Math.min(gridWidth - 1, hero.x + moveX));
    const newY = Math.max(0, Math.min(gridHeight - 1, hero.y + moveY));

    if (!grid[newY][newX].building && !grid[newY][newX].hero) {
      hero.x = newX;
      hero.y = newY;
      updateHeroPosition(hero);
      return true;
    }

    return false;
  }, [grid, gridWidth, gridHeight, updateHeroPosition]);

  // Move enemy towards target
  const moveEnemyTowards = useCallback((enemy: Enemy, targetX: number, targetY: number) => {
    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;

    let moveX = 0, moveY = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
      moveX = dx > 0 ? 1 : -1;
    } else {
      moveY = dy > 0 ? 1 : -1;
    }

    const newX = Math.max(0, Math.min(gridWidth - 1, enemy.x + moveX));
    const newY = Math.max(0, Math.min(gridHeight - 1, enemy.y + moveY));

    if (!grid[newY][newX].building && !grid[newY][newX].enemy) {
      enemy.x = newX;
      enemy.y = newY;
      updateEnemyPosition(enemy);
      return true;
    }

    return false;
  }, [grid, gridWidth, gridHeight, updateEnemyPosition]);

  // Resolve combat between hero and enemy
  const resolveCombat = useCallback((hero: Hero, enemy: Enemy) => {
    // Hero attacks enemy
    const heroDamage = hero.damage + hero.equipment + Math.floor(Math.random() * 5);
    enemy.health -= heroDamage;

    if (enemy.health <= 0) {
      // Enemy defeated
      hero.gold += enemy.reward;
      hero.experience += enemy.reward;
      addGameMessage(`${hero.name} defeated ${enemy.name} and gained ${enemy.reward} gold!`, 'success');
      removeEnemy(enemy);
      return;
    }

    // Enemy attacks hero
    const enemyDamage = enemy.damage + Math.floor(Math.random() * 3);
    hero.health -= enemyDamage;

    if (hero.health <= 0) {
      // Hero defeated
      addGameMessage(`${hero.name} was defeated by ${enemy.name}!`, 'error');
      removeHero(hero);
      return;
    }

    addGameMessage(`${hero.name} attacked ${enemy.name} for ${heroDamage} damage!`, 'info');
  }, [addGameMessage, removeEnemy, removeHero]);

  // Hero AI logic
  const updateHeroAI = useCallback((hero: Hero) => {
    // Find nearby enemies
    const nearbyEnemies = findNearbyEnemies(hero, 4);
    const nearbyFlags = findNearbyFlags(hero, 6);

    let targetFlag: Flag | null = null;
    let bestScore = -1;

    // Evaluate flags based on hero preferences
    nearbyFlags.forEach(flag => {
      let score = 0;
      if (hero.preferences.includes(flag.type)) {
        score += 10;
      }
      if (flag.type === 'gold' && hero.gold < 100) {
        score += 5;
      }
      if (score > bestScore) {
        bestScore = score;
        targetFlag = flag;
      }
    });

    // Decide action
    if (nearbyEnemies.length > 0 && hero.health > hero.maxHealth * 0.3) {
      // Attack nearest enemy
      const nearestEnemy = nearbyEnemies.reduce((nearest, enemy) => {
        const currentDist = Math.abs(hero.x - nearest.x) + Math.abs(hero.y - nearest.y);
        const enemyDist = Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y);
        return enemyDist < currentDist ? enemy : nearest;
      });

      if (Math.abs(hero.x - nearestEnemy.x) + Math.abs(hero.y - nearestEnemy.y) === 1) {
        // Adjacent - attack
        resolveCombat(hero, nearestEnemy);
      } else {
        // Move towards enemy
        moveHeroTowards(hero, nearestEnemy.x, nearestEnemy.y);
      }
    } else if (targetFlag) {
      // Move towards flag  
      const flag = targetFlag as Flag;
      if (Math.abs(hero.x - flag.x) + Math.abs(hero.y - flag.y) === 1) {
        // Reached flag - collect reward
        hero.gold += flag.reward;
        addGameMessage(`${hero.name} collected ${flag.reward} gold from ${flag.name}!`, 'success');
        removeFlag(flag);
      } else {
        moveHeroTowards(hero, flag.x, flag.y);
      }
    } else {
      // Idle - small chance to move randomly
      if (Math.random() < 0.3) {
        const directions = [
          { x: hero.x + 1, y: hero.y },
          { x: hero.x - 1, y: hero.y },
          { x: hero.x, y: hero.y + 1 },
          { x: hero.x, y: hero.y - 1 }
        ];
        const validDirections = directions.filter(dir =>
          dir.x >= 0 && dir.x < gridWidth && dir.y >= 0 && dir.y < gridHeight &&
          !grid[dir.y][dir.x].building && !grid[dir.y][dir.x].hero
        );
        if (validDirections.length > 0) {
          const randomDir = validDirections[Math.floor(Math.random() * validDirections.length)];
          moveHeroTowards(hero, randomDir.x, randomDir.y);
        }
      }
    }
  }, [findNearbyEnemies, findNearbyFlags, moveHeroTowards, resolveCombat, removeFlag, addGameMessage, gridWidth, gridHeight, grid]);

  // Update enemy AI
  const updateEnemyAI = useCallback((enemy: Enemy) => {
    // Find nearest building to attack
    const castle = buildings.find(b => b.type === 'castle');
    if (castle) {
      if (Math.abs(enemy.x - castle.x) + Math.abs(enemy.y - castle.y) === 1) {
        // Adjacent to castle - game over
        setShowGameOverModal(true);
        return;
      } else {
        moveEnemyTowards(enemy, castle.x, castle.y);
      }
    }
  }, [buildings, moveEnemyTowards, setShowGameOverModal]);

  // Main game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Update heroes
      heroes.forEach(hero => {
        if (Math.random() < 0.7) { // 70% chance to act each turn
          updateHeroAI(hero);
        }
      });

      // Update enemies
      enemies.forEach(enemy => {
        if (Math.random() < 0.5) { // 50% chance to move each turn
          updateEnemyAI(enemy);
        }
      });
    }, GAME_CONFIG.GAME_LOOP_INTERVAL);

    return () => clearInterval(gameLoop);
  }, [heroes, enemies, updateHeroAI, updateEnemyAI]);
};
