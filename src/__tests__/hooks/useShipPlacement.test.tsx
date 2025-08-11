import { renderHook, act } from '@testing-library/react';
import { useShipPlacement } from '../../hooks/useShipPlacement';
import { GameState } from '../../types/game';

const createMockGameState = (): GameState => ({
  gameMode: 'classic',
  difficulty: 'medium',
  gamePhase: 'setup',
  playerGrid: Array(10).fill(null).map(() => Array(10).fill(null)),
  enemyGrid: Array(10).fill(null).map(() => Array(10).fill(null)),
  playerShips: [],
  enemyShips: [],
  selectedShip: {
    type: 'destroyer',
    size: 2,
    name: 'Destroyer',
    cells: [],
    orientation: 'horizontal',
    hits: 0,
    sunk: false
  },
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
});

describe('useShipPlacement', () => {
  const mockSetGameState = jest.fn();
  const mockUpdateStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should place ship successfully', () => {
    const gameState = createMockGameState();
    const { result } = renderHook(() => 
      useShipPlacement(gameState, mockSetGameState, mockUpdateStatus)
    );

    act(() => {
      result.current.placeShip(0, 0);
    });

    expect(mockSetGameState).toHaveBeenCalled();
  });

  test('should clear all ships', () => {
    const gameState = createMockGameState();
    const { result } = renderHook(() => 
      useShipPlacement(gameState, mockSetGameState, mockUpdateStatus)
    );

    act(() => {
      result.current.clearAllShips();
    });

    expect(mockSetGameState).toHaveBeenCalled();
    expect(mockUpdateStatus).toHaveBeenCalledWith('All ships cleared. Deploy your fleet, Admiral!');
  });

  test('should perform random placement', () => {
    const gameState = createMockGameState();
    const { result } = renderHook(() => 
      useShipPlacement(gameState, mockSetGameState, mockUpdateStatus)
    );

    act(() => {
      result.current.randomPlacement();
    });

    expect(mockSetGameState).toHaveBeenCalled();
  });

  test('should check if all ships are placed', () => {
    const gameState = createMockGameState();
    gameState.placedShips = {
      carrier: true,
      battleship: true,
      cruiser: true,
      submarine: true,
      destroyer: true
    };

    const { result } = renderHook(() => 
      useShipPlacement(gameState, mockSetGameState, mockUpdateStatus)
    );

    const allPlaced = result.current.checkAllShipsPlaced();
    expect(allPlaced).toBe(true);
  });
});
