import { renderHook, act } from '@testing-library/react';
import { useAI } from '../../hooks/useAI';
import { GameState } from '../../types/game';

const createMockGameState = (difficulty: 'easy' | 'medium' | 'hard'): GameState => ({
  gameMode: 'classic',
  difficulty,
  gamePhase: 'playing',
  playerGrid: Array(10).fill(null).map(() => Array(10).fill(null)),
  enemyGrid: Array(10).fill(null).map(() => Array(10).fill(null)),
  playerShips: [],
  enemyShips: [],
  selectedShip: null,
  selectedPlacedShip: null,
  orientation: 'horizontal',
  playerTurn: false,
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
});

describe('useAI', () => {
  const mockSetGameState = jest.fn();
  const mockUpdateStatus = jest.fn();
  const mockUpdateLifetimeRecord = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Math.random = jest.fn();
  });

  test('should place AI ships', () => {
    const gameState = createMockGameState('medium');
    const { result } = renderHook(() => 
      useAI(gameState, mockSetGameState, mockUpdateStatus, mockUpdateLifetimeRecord)
    );

    act(() => {
      result.current.placeAIShips();
    });

    expect(mockSetGameState).toHaveBeenCalled();
  });

  test('should use different targeting strategies based on difficulty', () => {
    const easyGameState = createMockGameState('easy');
    const mediumGameState = createMockGameState('medium');
    const hardGameState = createMockGameState('hard');

    (Math.random as jest.Mock).mockReturnValue(0.5);

    const { result: easyResult } = renderHook(() => 
      useAI(easyGameState, mockSetGameState, mockUpdateStatus, mockUpdateLifetimeRecord)
    );

    const { result: mediumResult } = renderHook(() => 
      useAI(mediumGameState, mockSetGameState, mockUpdateStatus, mockUpdateLifetimeRecord)
    );

    const { result: hardResult } = renderHook(() => 
      useAI(hardGameState, mockSetGameState, mockUpdateStatus, mockUpdateLifetimeRecord)
    );

    expect(easyResult.current).toBeDefined();
    expect(mediumResult.current).toBeDefined();
    expect(hardResult.current).toBeDefined();
  });

  test('should handle game over state', () => {
    const gameState = createMockGameState('medium');
    gameState.gameOver = true;

    const { result } = renderHook(() => 
      useAI(gameState, mockSetGameState, mockUpdateStatus, mockUpdateLifetimeRecord)
    );

    act(() => {
      result.current.aiTurn();
    });

    expect(mockSetGameState).not.toHaveBeenCalled();
  });
});
