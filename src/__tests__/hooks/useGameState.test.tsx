import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../../hooks/useGameState';

describe('useGameState', () => {
  test('should initialize with default state', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.gameMode).toBe('classic');
    expect(result.current.gameState.difficulty).toBe('medium');
    expect(result.current.gameState.gamePhase).toBe('setup');
    expect(result.current.gameState.playerTurn).toBe(true);
    expect(result.current.gameState.gameOver).toBe(false);
    expect(result.current.statusMessage).toBe('AWAITING ORDERS - SELECT VESSELS FOR DEPLOYMENT');
  });

  test('should update difficulty', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.setDifficulty('hard');
    });
    
    expect(result.current.gameState.difficulty).toBe('hard');
  });

  test('should start game and change phase', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.startGame();
    });
    
    expect(result.current.gameState.gamePhase).toBe('playing');
    expect(result.current.statusMessage).toBe('Your turn! Select a target on the enemy grid.');
  });

  test('should reset game to initial state', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.setDifficulty('hard');
      result.current.startGame();
    });
    
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.gameState.difficulty).toBe('medium');
    expect(result.current.gameState.gamePhase).toBe('setup');
    expect(result.current.statusMessage).toBe('AWAITING ORDERS - SELECT VESSELS FOR DEPLOYMENT');
  });

  test('should rotate orientation', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.orientation).toBe('horizontal');
    
    act(() => {
      result.current.rotateOrientation();
    });
    
    expect(result.current.gameState.orientation).toBe('vertical');
    
    act(() => {
      result.current.rotateOrientation();
    });
    
    expect(result.current.gameState.orientation).toBe('horizontal');
  });
});
