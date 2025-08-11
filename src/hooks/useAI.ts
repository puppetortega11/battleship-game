import { useState, useCallback } from 'react';
import { GameState, Ship, AITarget } from '../types/game';

export function useAI(gameState: GameState, setGameState: (updater: (prev: GameState) => GameState) => void, updateStatus: (message: string) => void, updateLifetimeRecord: (won: boolean) => void) {
  const [aiTargetQueue, setAiTargetQueue] = useState<AITarget[]>([]);

  const placeAIShips = useCallback(() => {
    const newGrid = Array(10).fill(null).map(() => Array(10).fill(null));
    const newShips: Ship[] = [];

    const ships = [
      { type: 'carrier', size: 5, name: 'Aircraft Carrier' },
      { type: 'battleship', size: 4, name: 'Battleship' },
      { type: 'cruiser', size: 3, name: 'Cruiser' },
      { type: 'submarine', size: 3, name: 'Submarine' },
      { type: 'destroyer', size: 2, name: 'Destroyer' }
    ];

    const canPlaceShip = (grid: (string | null)[][], row: number, col: number, size: number, orientation: 'horizontal' | 'vertical'): boolean => {
      const isEmpty = (r: number, c: number) => {
        return r >= 0 && r < 10 && c >= 0 && c < 10 && !grid[r][c];
      };

      for (let i = 0; i < size; i++) {
        const targetRow = row + (orientation === 'vertical' ? i : 0);
        const targetCol = col + (orientation === 'horizontal' ? i : 0);
        
        if (!isEmpty(targetRow, targetCol)) {
          return false;
        }
      }

      for (let i = 0; i < size; i++) {
        const targetRow = row + (orientation === 'vertical' ? i : 0);
        const targetCol = col + (orientation === 'horizontal' ? i : 0);
        
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const adjRow = targetRow + dr;
            const adjCol = targetCol + dc;
            if (adjRow >= 0 && adjRow < 10 && adjCol >= 0 && adjCol < 10) {
              if (grid[adjRow][adjCol] && !(dr === 0 && dc === 0)) {
                return false;
              }
            }
          }
        }
      }

      return true;
    };

    ships.forEach(shipType => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        
        if (canPlaceShip(newGrid, row, col, shipType.size, orientation)) {
          const ship: Ship = {
            ...shipType,
            orientation,
            cells: [],
            hits: 0,
            sunk: false
          };

          const shipCells = [];
          for (let i = 0; i < shipType.size; i++) {
            const targetRow = row + (orientation === 'vertical' ? i : 0);
            const targetCol = col + (orientation === 'horizontal' ? i : 0);
            newGrid[targetRow][targetCol] = shipType.type;
            shipCells.push({ row: targetRow, col: targetCol });
          }

          ship.cells = shipCells;
          newShips.push(ship);
          placed = true;
        }
        attempts++;
      }
    });

    setGameState(prev => ({
      ...prev,
      enemyShips: newShips
    }));
  }, [setGameState]);

  const aiTurn = useCallback(() => {
    if (gameState.gameOver) return;

    let target: AITarget | null = null;
    const newTargetQueue = [...aiTargetQueue];

    while (newTargetQueue.length > 0) {
      const candidate = newTargetQueue.shift()!;
      if (gameState.playerGrid[candidate.row][candidate.col] !== 'hit' && 
          gameState.playerGrid[candidate.row][candidate.col] !== 'miss') {
        target = candidate;
        break;
      }
    }

    if (!target) {
      const available: AITarget[] = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          if (gameState.playerGrid[row][col] !== 'hit' && gameState.playerGrid[row][col] !== 'miss') {
            available.push({ row, col });
          }
        }
      }
      if (available.length === 0) {
        updateStatus("Enemy has no more moves!");
        return;
      }
      target = available[Math.floor(Math.random() * available.length)];
    }

    const { row, col } = target;
    let hitShip: Ship | null = null;
    
    for (const ship of gameState.playerShips) {
      if (ship.cells.some(c => c.row === row && c.col === col)) {
        hitShip = ship;
        break;
      }
    }

    const isHit = !!hitShip;
    const newGrid = gameState.playerGrid.map(row => [...row]);
    
    if (newGrid[row][col] !== 'hit' && newGrid[row][col] !== 'miss') {
      newGrid[row][col] = isHit ? 'hit' : 'miss';
    }

    if (isHit && hitShip) {
      hitShip.hits++;
      if (hitShip.hits === hitShip.size) {
        hitShip.sunk = true;
        updateStatus(`Your ${hitShip.name.toUpperCase()} has been sunk!`);
        
        if (gameState.playerShips.every(s => s.sunk)) {
          setGameState(prev => ({
            ...prev,
            playerGrid: newGrid,
            gameOver: true
          }));
          updateStatus('AI wins! All your ships have been sunk!');
          updateLifetimeRecord(false);
          return;
        }
      } else {
        updateStatus('Enemy hit your ship!');
      }

      const directions = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 }
      ];

      for (const { dr, dc } of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10 &&
            gameState.playerGrid[nr][nc] !== 'hit' && gameState.playerGrid[nr][nc] !== 'miss') {
          newTargetQueue.push({ row: nr, col: nc });
        }
      }
    }

    setAiTargetQueue(newTargetQueue);
    setGameState(prev => ({
      ...prev,
      playerGrid: newGrid,
      playerTurn: true
    }));

    if (!gameState.gameOver) {
      updateStatus("Your turn! Select a target on the enemy grid.");
    }
  }, [gameState, aiTargetQueue, setGameState, updateStatus, updateLifetimeRecord]);

  return {
    placeAIShips,
    aiTurn
  };
}
