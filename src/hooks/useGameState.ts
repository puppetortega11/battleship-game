import { useState, useCallback } from 'react';
import { GameState, Ship, SHIPS } from '../types/game';

const initialGameState: GameState = {
  gameMode: 'classic',
  gamePhase: 'setup',
  playerGrid: Array(10).fill(null).map(() => Array(10).fill(null)),
  enemyGrid: Array(10).fill(null).map(() => Array(10).fill(null)),
  playerShips: [],
  enemyShips: [],
  selectedShip: null,
  selectedPlacedShip: null,
  orientation: 'horizontal',
  playerTurn: true,
  gameOver: false,
  gameStats: {
    score: 0,
    shotsFired: 0,
    hits: 0,
    enemyShipsRemaining: 5
  },
  placedShips: {
    carrier: false,
    battleship: false,
    cruiser: false,
    submarine: false,
    destroyer: false
  }
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [statusMessage, setStatusMessage] = useState('AWAITING ORDERS - SELECT VESSELS FOR DEPLOYMENT');

  const updateStatus = useCallback((message: string) => {
    setStatusMessage(message);
  }, []);

  const selectShip = useCallback((shipType: string) => {
    if (gameState.placedShips[shipType]) return;
    
    const ship = SHIPS.find(s => s.type === shipType);
    if (ship) {
      setGameState(prev => ({
        ...prev,
        selectedShip: {
          ...ship,
          cells: [],
          orientation: prev.orientation,
          hits: 0,
          sunk: false
        }
      }));
    }
  }, [gameState.placedShips]);

  const rotateOrientation = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      orientation: prev.orientation === 'horizontal' ? 'vertical' : 'horizontal'
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing'
    }));
    updateStatus('Your turn! Select a target on the enemy grid.');
  }, [updateStatus]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setStatusMessage('AWAITING ORDERS - SELECT VESSELS FOR DEPLOYMENT');
  }, []);

  return {
    gameState,
    setGameState,
    statusMessage,
    updateStatus,
    selectShip,
    rotateOrientation,
    startGame,
    resetGame
  };
}
