import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { GAME_CONFIG } from '../data/gameData';
import type { Hero, Enemy, Flag, CombatRecord } from '../types/game';

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
    removeHero,
    addCombatRecord,
    updateStatistics,
    updateAchievementProgress
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

  // Calculate position-based combat bonuses
  const getPositionBonus = useCallback((attacker: Hero, defender: Enemy) => {
    let bonus = 0;

    // High ground advantage (buildings provide elevation)
    const nearbyBuildings = buildings.filter(b =>
      Math.abs(b.x - attacker.x) <= 1 && Math.abs(b.y - attacker.y) <= 1
    );
    if (nearbyBuildings.length > 0) bonus += 0.1; // 10% bonus

    // Flanking bonus - check if enemy has heroes on opposite sides
    const oppositeX = defender.x + (defender.x - attacker.x);
    const oppositeY = defender.y + (defender.y - attacker.y);
    const flankingHero = heroes.find(h =>
      h.id !== attacker.id && Math.abs(h.x - oppositeX) <= 1 && Math.abs(h.y - oppositeY) <= 1
    );
    if (flankingHero) bonus += 0.15; // 15% flanking bonus

    return bonus;
  }, [buildings, heroes]);

  // Calculate formation bonuses for grouped heroes
  const getFormationBonus = useCallback((hero: Hero) => {
    const nearbyHeroes = heroes.filter(h =>
      h.id !== hero.id &&
      Math.abs(h.x - hero.x) <= 2 &&
      Math.abs(h.y - hero.y) <= 2
    );

    let bonus = 0;
    if (nearbyHeroes.length >= 1) bonus += 0.05; // 5% per nearby hero
    if (nearbyHeroes.length >= 2) bonus += 0.05; // Additional 5% for 2+ heroes
    if (nearbyHeroes.length >= 3) bonus += 0.1;  // Additional 10% for 3+ heroes

    // Class synergy bonuses
    const uniqueClasses = new Set(nearbyHeroes.map(h => h.type));
    if (uniqueClasses.size >= 2) bonus += 0.1; // Mixed group bonus

    return Math.min(bonus, 0.5); // Cap at 50% bonus
  }, [heroes]);

  // Check for critical hit
  const checkCriticalHit = useCallback((attacker: Hero) => {
    let critChance = 0.05; // Base 5% crit chance

    // Rogue class bonus
    if (attacker.type === 'rogue') critChance += 0.1;

    // Equipment bonuses
    if (attacker.equipment.weapon?.rarity === 'epic') critChance += 0.05;
    if (attacker.equipment.weapon?.rarity === 'legendary') critChance += 0.1;

    // Specialization bonuses
    if (attacker.specialization?.id === 'assassin') critChance += 0.15;
    if (attacker.specialization?.id === 'hunter') critChance += 0.1;

    return Math.random() < critChance;
  }, []);

  // Enhanced combat resolution with strategic elements
  const resolveCombat = useCallback((hero: Hero, enemy: Enemy) => {
    const startTime = Date.now();

    // Calculate all bonuses
    const positionBonus = getPositionBonus(hero, enemy);
    const formationBonus = getFormationBonus(hero);
    const isCritical = checkCriticalHit(hero);

    // Hero damage calculation with bonuses
    let heroDamage = hero.damage;

    // Apply equipment bonuses
    if (hero.equipment.weapon) heroDamage += hero.equipment.weapon.damageBonus;
    if (hero.equipment.accessory) heroDamage += hero.equipment.accessory.damageBonus;

    // Apply strategic bonuses
    heroDamage *= (1 + positionBonus + formationBonus);

    // Critical hit multiplier
    if (isCritical) {
      heroDamage *= 2;
      addGameMessage(`💥 ${hero.heroName} landed a CRITICAL HIT!`, 'success');
    }

    // Add some randomness
    heroDamage += Math.floor(Math.random() * 5);
    const finalHeroDamage = Math.floor(heroDamage);

    // Apply damage to enemy
    enemy.health -= finalHeroDamage;

    let experienceGained = 0;
    let goldGained = 0;

    if (enemy.health <= 0) {
      // Enemy defeated
      experienceGained = Math.floor(enemy.reward * 1.5);
      goldGained = enemy.reward;

      hero.gold += goldGained;

      let defeatMessage = `⚔️ ${hero.heroName} defeated ${enemy.name}!`;
      if (positionBonus > 0) defeatMessage += ' (Position advantage!)';
      if (formationBonus > 0) defeatMessage += ' (Formation bonus!)';

      addGameMessage(defeatMessage + ` +${goldGained} gold, +${experienceGained} XP`, 'success');

      // Create combat record
      const combatRecord: CombatRecord = {
        timestamp: startTime,
        opponent: enemy.name,
        result: 'victory',
        experienceGained,
        goldGained,
        damageDealt: finalHeroDamage,
        damageTaken: 0
      };

      addCombatRecord(hero.id, combatRecord);
      removeEnemy(enemy);

      // Update statistics and achievements
      updateStatistics({ totalEnemiesDefeated: 1 });
      updateAchievementProgress('first_victory', { enemiesDefeated: 1 });

      return;
    }

    // Enemy counter-attack with defensive calculations
    let enemyDamage = enemy.damage;

    // Hero's defensive bonuses
    let damageReduction = 0;
    if (hero.equipment.armor) {
      damageReduction += hero.equipment.armor.healthBonus * 0.1; // Each armor point reduces damage by 10%
    }

    // Warrior class defensive bonus
    if (hero.type === 'warrior') damageReduction += 0.1;

    // Guardian specialization bonus
    if (hero.specialization?.id === 'guardian') damageReduction += 0.2;

    // Apply damage reduction
    enemyDamage *= Math.max(0.1, 1 - damageReduction); // Minimum 10% damage gets through
    enemyDamage += Math.floor(Math.random() * 3);
    const finalEnemyDamage = Math.floor(enemyDamage);

    hero.health -= finalEnemyDamage;

    if (hero.health <= 0) {
      // Hero defeated
      addGameMessage(`💀 ${hero.heroName} was defeated by ${enemy.name}!`, 'error');

      // Create combat record for defeat
      const defeatRecord: CombatRecord = {
        timestamp: startTime,
        opponent: enemy.name,
        result: 'defeat',
        experienceGained: 0,
        goldGained: 0,
        damageDealt: finalHeroDamage,
        damageTaken: finalEnemyDamage
      };

      addCombatRecord(hero.id, defeatRecord);
      removeHero(hero);
      return;
    }

    // Both survived - ongoing combat
    let combatMessage = `⚔️ ${hero.heroName} hit ${enemy.name} for ${finalHeroDamage} damage`;
    if (finalEnemyDamage > 0) {
      combatMessage += `, ${enemy.name} retaliated for ${finalEnemyDamage} damage`;
    }

    addGameMessage(combatMessage, 'info');

    // Small experience gain for ongoing combat
    experienceGained = Math.floor(finalHeroDamage * 0.1);

    const ongoingRecord: CombatRecord = {
      timestamp: startTime,
      opponent: enemy.name,
      result: 'retreat', // Ongoing combat
      experienceGained,
      goldGained: 0,
      damageDealt: finalHeroDamage,
      damageTaken: finalEnemyDamage
    };

    addCombatRecord(hero.id, ongoingRecord);
  }, [addGameMessage, removeEnemy, removeHero, addCombatRecord, getPositionBonus, getFormationBonus, checkCriticalHit, updateStatistics, updateAchievementProgress]);

  // Enhanced strategic hero AI
  const updateHeroAI = useCallback((hero: Hero) => {
    // Skip if hero is low on morale
    if (hero.morale < 20) {
      hero.lastAction = 'resting (low morale)';
      return;
    }

    // Find nearby entities with extended ranges based on hero type
    const sightRange = hero.type === 'ranger' ? 6 : hero.type === 'wizard' ? 5 : 4;
    const nearbyEnemies = findNearbyEnemies(hero, sightRange);
    const nearbyFlags = findNearbyFlags(hero, sightRange + 2);
    const nearbyHeroes = heroes.filter(h =>
      h.id !== hero.id &&
      Math.abs(h.x - hero.x) <= 3 &&
      Math.abs(h.y - hero.y) <= 3
    );

    // Health-based decision making
    const healthPercent = hero.health / hero.maxHealth;
    const shouldRetreat = healthPercent < 0.3;
    const shouldBeAggressive = healthPercent > 0.7;

    // Strategic enemy selection
    let bestTarget: Enemy | null = null;
    let bestTargetScore = -1;

    nearbyEnemies.forEach(enemy => {
      let score = 0;
      const distance = Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y);

      // Prefer closer enemies
      score += (10 - distance);

      // Prefer enemies hero can defeat
      if (hero.damage > enemy.health) score += 15;
      if (hero.damage * 2 > enemy.health) score += 10; // Can kill in 2 hits

      // Class preferences
      if (hero.type === 'warrior' && enemy.damage > 15) score += 5; // Warriors like tough enemies
      if (hero.type === 'rogue' && enemy.health < hero.damage * 1.5) score += 10; // Rogues like weak enemies
      if (hero.type === 'ranger' && distance > 2) score += 5; // Rangers prefer ranged engagement
      if (hero.type === 'wizard' && nearbyEnemies.length > 1) score += 8; // Wizards like group combat

      // Tactical bonuses
      const positionBonus = getPositionBonus(hero, enemy);
      const formationBonus = getFormationBonus(hero);
      score += (positionBonus + formationBonus) * 10;

      if (score > bestTargetScore) {
        bestTargetScore = score;
        bestTarget = enemy;
      }
    });

    // Flag evaluation with strategic considerations
    let targetFlag: Flag | null = null;
    let bestFlagScore = -1;

    nearbyFlags.forEach(flag => {
      let score = 0;
      const distance = Math.abs(hero.x - flag.x) + Math.abs(hero.y - flag.y);

      // Distance penalty
      score += (15 - distance);

      // Preference bonuses
      if (hero.preferences.includes(flag.type)) score += 15;

      // Situational bonuses
      if (flag.type === 'attack' && nearbyEnemies.length > 0) score += 10;
      if (flag.type === 'defend' && nearbyEnemies.length > 2) score += 12;
      if (flag.type === 'explore' && nearbyEnemies.length === 0) score += 8;

      // Resource needs
      if (hero.gold < 50) score += 5;
      if (hero.health < hero.maxHealth * 0.6) score += 3;

      if (score > bestFlagScore) {
        bestFlagScore = score;
        targetFlag = flag;
      }
    });

    // Decision making logic
    if (shouldRetreat && nearbyEnemies.length > 0) {
      // Retreat behavior - move away from enemies
      const threatX = nearbyEnemies.reduce((sum, e) => sum + e.x, 0) / nearbyEnemies.length;
      const threatY = nearbyEnemies.reduce((sum, e) => sum + e.y, 0) / nearbyEnemies.length;

      const retreatX = hero.x + (hero.x - threatX > 0 ? 1 : -1);
      const retreatY = hero.y + (hero.y - threatY > 0 ? 1 : -1);

      moveHeroTowards(hero, retreatX, retreatY);
      hero.lastAction = 'retreating';

    } else if (bestTarget && (shouldBeAggressive || bestTargetScore > 15)) {
      // Engage in combat
      const distance = Math.abs(hero.x - bestTarget.x) + Math.abs(hero.y - bestTarget.y);

      if (distance === 1) {
        // Adjacent - attack
        resolveCombat(hero, bestTarget);
        hero.lastAction = `attacking ${bestTarget.name}`;
      } else {
        // Move strategically towards enemy
        let moveSuccess = false;

        // Try to move to advantageous position
        const possiblePositions = [
          { x: bestTarget.x + 1, y: bestTarget.y },
          { x: bestTarget.x - 1, y: bestTarget.y },
          { x: bestTarget.x, y: bestTarget.y + 1 },
          { x: bestTarget.x, y: bestTarget.y - 1 }
        ].filter(pos =>
          pos.x >= 0 && pos.x < gridWidth &&
          pos.y >= 0 && pos.y < gridHeight &&
          !grid[pos.y][pos.x].building &&
          !grid[pos.y][pos.x].hero &&
          !grid[pos.y][pos.x].enemy
        );

        if (possiblePositions.length > 0) {
          // Choose position with best tactical advantage
          const bestPosition = possiblePositions.reduce((best, pos) => {
            const nearbyBuildingCount = buildings.filter(b =>
              Math.abs(b.x - pos.x) <= 1 && Math.abs(b.y - pos.y) <= 1
            ).length;

            const nearbyHeroCount = nearbyHeroes.filter(h =>
              Math.abs(h.x - pos.x) <= 2 && Math.abs(h.y - pos.y) <= 2
            ).length;

            const posScore = nearbyBuildingCount * 2 + nearbyHeroCount;
            const bestScore = buildings.filter(b =>
              Math.abs(b.x - best.x) <= 1 && Math.abs(b.y - best.y) <= 1
            ).length * 2 + nearbyHeroes.filter(h =>
              Math.abs(h.x - best.x) <= 2 && Math.abs(h.y - best.y) <= 2
            ).length;

            return posScore > bestScore ? pos : best;
          });

          moveSuccess = moveHeroTowards(hero, bestPosition.x, bestPosition.y);
        }

        if (!moveSuccess) {
          moveHeroTowards(hero, bestTarget.x, bestTarget.y);
        }
        hero.lastAction = `pursuing ${bestTarget.name}`;
      }

    } else if (targetFlag && bestFlagScore > 10) {
      // Move towards flag
      const flag = targetFlag as Flag;
      const distance = Math.abs(hero.x - flag.x) + Math.abs(hero.y - flag.y);

      if (distance <= 1) {
        // Reached flag - collect reward
        hero.gold += flag.reward;
        addGameMessage(`${hero.heroName} collected ${flag.reward} gold from ${flag.name}!`, 'success');
        removeFlag(flag);
        hero.lastAction = `collected ${flag.name}`;
      } else {
        moveHeroTowards(hero, flag.x, flag.y);
        hero.lastAction = `moving to ${flag.name}`;
      }

    } else {
      // Patrol behavior - move towards areas with potential activity
      const patrolSuccess = false;

      // Try to move towards unexplored areas or support other heroes
      if (!patrolSuccess && nearbyHeroes.length === 0) {
        // Move to support other heroes
        const distantHeroes = heroes.filter(h =>
          h.id !== hero.id &&
          Math.abs(h.x - hero.x) + Math.abs(h.y - hero.y) > 5
        );

        if (distantHeroes.length > 0) {
          const supportTarget = distantHeroes[Math.floor(Math.random() * distantHeroes.length)];
          moveHeroTowards(hero, supportTarget.x, supportTarget.y);
          hero.lastAction = `moving to support ${supportTarget.heroName}`;
        } else {
          // Random patrol movement
          if (Math.random() < 0.4) {
            const directions = [
              { x: hero.x + 1, y: hero.y },
              { x: hero.x - 1, y: hero.y },
              { x: hero.x, y: hero.y + 1 },
              { x: hero.x, y: hero.y - 1 }
            ];
            const validDirections = directions.filter(dir =>
              dir.x >= 0 && dir.x < gridWidth &&
              dir.y >= 0 && dir.y < gridHeight &&
              !grid[dir.y][dir.x].building &&
              !grid[dir.y][dir.x].hero
            );
            if (validDirections.length > 0) {
              const randomDir = validDirections[Math.floor(Math.random() * validDirections.length)];
              moveHeroTowards(hero, randomDir.x, randomDir.y);
              hero.lastAction = 'patrolling';
            } else {
              hero.lastAction = 'standing guard';
            }
          } else {
            hero.lastAction = 'standing guard';
          }
        }
      }
    }
  }, [findNearbyEnemies, findNearbyFlags, moveHeroTowards, resolveCombat, removeFlag, addGameMessage, gridWidth, gridHeight, grid, heroes, buildings, getPositionBonus, getFormationBonus]);

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
