import { useState } from 'react';
import { GameState, Ship } from '../types/game';

interface RadarGridProps {
  grid: (string | null)[][];
  ships: Ship[];
  gridType: 'player' | 'enemy';
  gameState: GameState;
  setGameState: (updater: (prev: GameState) => GameState) => void;
  updateStatus: (message: string) => void;
  placeShip?: (row: number, col: number) => boolean;
  aiTurn?: () => void;
  updateLifetimeRecord?: (won: boolean) => void;
}

export default function RadarGrid({
  grid,
  ships,
  gridType,
  gameState,
  setGameState,
  updateStatus,
  placeShip,
  aiTurn,
  updateLifetimeRecord
}: RadarGridProps) {
  const [previewCells, setPreviewCells] = useState<Set<string>>(new Set());

  const handleEnemyGridClick = (row: number, col: number) => {
    if (gameState.gamePhase !== 'playing' || !gameState.playerTurn || gameState.gameOver) return;
    if (gameState.enemyGrid[row][col] === 'hit' || gameState.enemyGrid[row][col] === 'miss') return;

    let hitShip: Ship | null = null;
    for (const ship of gameState.enemyShips) {
      if (ship.cells.some(c => c.row === row && c.col === col)) {
        hitShip = ship;
        break;
      }
    }

    const isHit = !!hitShip;
    const newEnemyGrid = gameState.enemyGrid.map(row => [...row]);
    newEnemyGrid[row][col] = isHit ? 'hit' : 'miss';

    const newStats = {
      ...gameState.gameStats,
      shotsFired: gameState.gameStats.shotsFired + 1,
      hits: gameState.gameStats.hits + (isHit ? 1 : 0),
      score: gameState.gameStats.score + (isHit ? 10 : 0)
    };

    if (isHit && hitShip) {
      hitShip.hits++;
      if (hitShip.hits === hitShip.size) {
        hitShip.sunk = true;
        newStats.enemyShipsRemaining--;
        updateStatus(`Enemy ${hitShip.name.toUpperCase()} destroyed!`);

        if (gameState.enemyShips.every(s => s.sunk)) {
          setGameState(prev => ({
            ...prev,
            enemyGrid: newEnemyGrid,
            gameStats: newStats,
            gameOver: true
          }));
          updateStatus('You win! All enemy ships sunk!');
          updateLifetimeRecord?.(true);
          return;
        }
      } else {
        updateStatus('Direct hit! Enemy vessel damaged!');
      }
    } else {
      updateStatus('Miss! No contact with enemy vessels.');
    }

    setGameState(prev => ({
      ...prev,
      enemyGrid: newEnemyGrid,
      gameStats: newStats,
      playerTurn: false
    }));

    if (!gameState.gameOver) {
      setTimeout(() => {
        aiTurn?.();
      }, 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    if (gridType !== 'player' || gameState.gamePhase !== 'setup') return;
    
    e.preventDefault();
    
    let dragData = null;
    try {
      dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {}
    
    if (!dragData) return;

    const newPreviewCells = new Set<string>();
    for (let i = 0; i < dragData.size; i++) {
      const targetRow = row + (dragData.orientation === 'vertical' ? i : 0);
      const targetCol = col + (dragData.orientation === 'horizontal' ? i : 0);
      if (targetRow >= 0 && targetRow < 10 && targetCol >= 0 && targetCol < 10) {
        newPreviewCells.add(`${targetRow}-${targetCol}`);
      }
    }
    setPreviewCells(newPreviewCells);
  };

  const handleDragLeave = () => {
    setPreviewCells(new Set());
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    if (gridType !== 'player' || gameState.gamePhase !== 'setup') return;
    
    e.preventDefault();
    setPreviewCells(new Set());
    
    let dragData = null;
    try {
      dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {}
    
    if (!dragData) return;

    placeShip?.(row, col);
  };

  const getCellContent = (row: number, col: number) => {
    const cellValue = grid[row][col];
    
    if (cellValue === 'hit') return '💥';
    if (cellValue === 'miss') return '💧';
    
    if (gridType === 'player' && cellValue && cellValue !== 'hit' && cellValue !== 'miss') {
      const ship = ships.find(s => s.cells.some(c => c.row === row && c.col === col));
      if (ship?.sunk) return '💥';
      return '🚢';
    }
    
    return '';
  };

  const getCellClass = (row: number, col: number) => {
    const cellValue = grid[row][col];
    const cellKey = `${row}-${col}`;
    
    let classes = 'radar-cell';
    
    if (cellValue === 'hit') classes += ' impact';
    if (cellValue === 'miss') classes += ' miss';
    if (gridType === 'player' && cellValue && cellValue !== 'hit' && cellValue !== 'miss') {
      const ship = ships.find(s => s.cells.some(c => c.row === row && c.col === col));
      if (ship?.sunk) {
        classes += ' destroyed';
      } else {
        classes += ' vessel';
      }
    }
    
    if (previewCells.has(cellKey)) {
      classes += ' selected';
    }
    
    return classes;
  };

  return (
    <div className="radar-grid">
      {Array.from({ length: 100 }, (_, index) => {
        const row = Math.floor(index / 10);
        const col = index % 10;
        
        return (
          <div
            key={`${row}-${col}`}
            className={getCellClass(row, col)}
            data-grid={gridType}
            data-row={row}
            data-col={col}
            onClick={() => gridType === 'enemy' ? handleEnemyGridClick(row, col) : undefined}
            onDragOver={(e) => handleDragOver(e, row, col)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, row, col)}
          >
            {getCellContent(row, col)}
          </div>
        );
      })}
    </div>
  );
}
