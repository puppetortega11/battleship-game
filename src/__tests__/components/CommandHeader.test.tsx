import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommandHeader from '../../components/CommandHeader';
import { GameStats } from '../../types/game';

const mockGameStats: GameStats = {
  score: 100,
  shotsFired: 10,
  hits: 5,
  enemyShipsRemaining: 3
};

const mockLifetimeRecord = {
  gamesPlayed: 5,
  gamesWon: 3,
  winPercentage: 60
};

describe('CommandHeader', () => {
  const mockOnExit = jest.fn();
  const mockOnDifficultyChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render header with stats', () => {
    render(
      <CommandHeader
        gameStats={mockGameStats}
        lifetimeRecord={mockLifetimeRecord}
        difficulty="medium"
        onExit={mockOnExit}
        onDifficultyChange={mockOnDifficultyChange}
      />
    );

    expect(screen.getByText('⚡ NAVAL RADAR COMMAND ⚡')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('010')).toBeDefined();
    expect(screen.getByText('50%')).toBeDefined();
    expect(screen.getByText('03')).toBeDefined();
  });

  test('should render difficulty buttons', () => {
    render(
      <CommandHeader
        gameStats={mockGameStats}
        lifetimeRecord={mockLifetimeRecord}
        difficulty="medium"
        onExit={mockOnExit}
        onDifficultyChange={mockOnDifficultyChange}
      />
    );

    expect(screen.getByText('Easy')).toBeDefined();
    expect(screen.getByText('Medium')).toBeDefined();
    expect(screen.getByText('Hard')).toBeDefined();
  });

  test('should highlight active difficulty', () => {
    render(
      <CommandHeader
        gameStats={mockGameStats}
        lifetimeRecord={mockLifetimeRecord}
        difficulty="hard"
        onExit={mockOnExit}
        onDifficultyChange={mockOnDifficultyChange}
      />
    );

    const hardButton = screen.getByText('Hard');
    expect(hardButton.className).toContain('active');
  });

  test('should call onDifficultyChange when difficulty button is clicked', () => {
    render(
      <CommandHeader
        gameStats={mockGameStats}
        lifetimeRecord={mockLifetimeRecord}
        difficulty="medium"
        onExit={mockOnExit}
        onDifficultyChange={mockOnDifficultyChange}
      />
    );

    fireEvent.click(screen.getByText('Easy'));
    expect(mockOnDifficultyChange).toHaveBeenCalledWith('easy');

    fireEvent.click(screen.getByText('Hard'));
    expect(mockOnDifficultyChange).toHaveBeenCalledWith('hard');
  });

  test('should call onExit when exit button is clicked', () => {
    render(
      <CommandHeader
        gameStats={mockGameStats}
        lifetimeRecord={mockLifetimeRecord}
        difficulty="medium"
        onExit={mockOnExit}
        onDifficultyChange={mockOnDifficultyChange}
      />
    );

    fireEvent.click(screen.getByText('EXIT'));
    expect(mockOnExit).toHaveBeenCalled();
  });
});
