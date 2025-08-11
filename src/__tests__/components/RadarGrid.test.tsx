import { render, screen } from '@testing-library/react';
import RadarGrid from '../../components/RadarGrid';
import { GameState, Ship } from '../../types/game';

const createMockGameState = (): GameState => ({
  gameMode: 'classic',
  difficulty: 'medium',
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
});

describe('RadarGrid', () => {
  const mockGrid = Array(10).fill(null).map(() => Array(10).fill(null));
  const mockShips: Ship[] = [];
  const mockGameState = createMockGameState();
  const mockSetGameState = jest.fn();
  const mockUpdateStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render 10x10 grid', () => {
    render(
      <RadarGrid
        grid={mockGrid}
        ships={mockShips}
        gridType="player"
        gameState={mockGameState}
        setGameState={mockSetGameState}
        updateStatus={mockUpdateStatus}
      />
    );

    const gridCells = screen.getAllByRole('generic');
    expect(gridCells).toHaveLength(102); // 100 cells + 2 containers
  });

  test('should display hit and miss markers', () => {
    const gridWithHits = mockGrid.map(row => [...row]);
    gridWithHits[0][0] = 'hit';
    gridWithHits[0][1] = 'miss';

    render(
      <RadarGrid
        grid={gridWithHits}
        ships={mockShips}
        gridType="enemy"
        gameState={mockGameState}
        setGameState={mockSetGameState}
        updateStatus={mockUpdateStatus}
      />
    );

    expect(screen.getByText('💥')).toBeDefined();
    expect(screen.getByText('💧')).toBeDefined();
  });

  test('should render player grid with ships', () => {
    const gridWithShip = mockGrid.map(row => [...row]);
    gridWithShip[0][0] = 'carrier';
    
    const shipsWithCarrier = [{
      type: 'carrier',
      size: 5,
      name: 'Aircraft Carrier',
      cells: [{ row: 0, col: 0 }],
      orientation: 'horizontal' as const,
      hits: 0,
      sunk: false
    }];

    render(
      <RadarGrid
        grid={gridWithShip}
        ships={shipsWithCarrier}
        gridType="player"
        gameState={mockGameState}
        setGameState={mockSetGameState}
        updateStatus={mockUpdateStatus}
      />
    );

    expect(screen.getByText('🚢')).toBeDefined();
  });
});
