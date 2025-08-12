import { useCallback } from 'react';
import { GameState, Ship } from '../types/game';

export function useShipPlacement(gameState: GameState, setGameState: (updater: (prev: GameState) => GameState) => void, updateStatus: (message: string) => void) {
  
  const canPlaceShip = useCallback((grid: (string | null)[][], row: number, col: number, size: number, orientation: 'horizontal' | 'vertical'): boolean => {
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
  }, []);

  const placeShip = useCallback((row: number, col: number) => {
    if (!gameState.selectedShip || gameState.gamePhase !== 'setup') return false;

    if (!canPlaceShip(gameState.playerGrid, row, col, gameState.selectedShip.size, gameState.orientation)) {
      updateStatus('DEPLOYMENT BLOCKED - SELECT ALTERNATIVE COORDINATES');
      return false;
    }

    if (gameState.playerShips.length >= 5) {
      updateStatus('All ships already deployed!');
      return false;
    }

    const newShip: Ship = {
      ...gameState.selectedShip,
      orientation: gameState.orientation,
      cells: [],
      hits: 0,
      sunk: false
    };

    const newGrid = gameState.playerGrid.map(row => [...row]);
    const shipCells = [];

    for (let i = 0; i < gameState.selectedShip.size; i++) {
      const targetRow = row + (gameState.orientation === 'vertical' ? i : 0);
      const targetCol = col + (gameState.orientation === 'horizontal' ? i : 0);
      newGrid[targetRow][targetCol] = gameState.selectedShip.type;
      shipCells.push({ row: targetRow, col: targetCol });
    }

    newShip.cells = shipCells;

    setGameState(prev => ({
      ...prev,
      playerGrid: newGrid,
      playerShips: [...prev.playerShips, newShip],
      selectedShip: null,
      placedShips: {
        ...prev.placedShips,
        [newShip.type]: true
      }
    }));

    updateStatus(`${newShip.name} deployed successfully!`);
    return true;
  }, [gameState, canPlaceShip, setGameState, updateStatus]);

  const randomPlacement = useCallback(() => {
    const newGrid = Array(10).fill(null).map(() => Array(10).fill(null));
    const newShips: Ship[] = [];
    const newPlacedShips = { carrier: false, battleship: false, cruiser: false, submarine: false, destroyer: false };

    const ships = [
      { type: 'carrier', size: 5, name: 'Aircraft Carrier' },
      { type: 'battleship', size: 4, name: 'Battleship' },
      { type: 'cruiser', size: 3, name: 'Cruiser' },
      { type: 'submarine', size: 3, name: 'Submarine' },
      { type: 'destroyer', size: 2, name: 'Destroyer' }
    ];

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
          newPlacedShips[shipType.type as keyof typeof newPlacedShips] = true;
          placed = true;
        }
        attempts++;
      }
    });

    setGameState(prev => ({
      ...prev,
      gamePhase: 'setup',
      playerGrid: newGrid,
      playerShips: newShips,
      selectedShip: null,
      placedShips: newPlacedShips
    }));

    updateStatus('Fleet auto-deployed! Review positions and start battle when ready.');
  }, [canPlaceShip, setGameState, updateStatus]);

  const clearAllShips = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'setup',
      playerGrid: Array(10).fill(null).map(() => Array(10).fill(null)),
      playerShips: [],
      selectedShip: null,
      selectedPlacedShip: null,
      placedShips: {
        carrier: false,
        battleship: false,
        cruiser: false,
        submarine: false,
        destroyer: false
      }
    }));
    updateStatus('All ships cleared. Deploy your fleet, Admiral!');
  }, [setGameState, updateStatus]);

  const checkAllShipsPlaced = useCallback(() => {
    return Object.values(gameState.placedShips).every(placed => placed);
  }, [gameState.placedShips]);

  return {
    canPlaceShip,
    placeShip,
    randomPlacement,
    clearAllShips,
    checkAllShipsPlaced
  };
}
