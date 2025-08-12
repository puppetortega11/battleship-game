export interface Ship {
  type: string;
  size: number;
  name: string;
  cells: { row: number; col: number }[];
  orientation: 'horizontal' | 'vertical';
  hits: number;
  sunk: boolean;
}

export interface GameStats {
  score: number;
  shotsFired: number;
  hits: number;
  enemyShipsRemaining: number;
}

export interface GameState {
  gameMode: string;
  gamePhase: 'setup' | 'playing';
  playerGrid: (string | null)[][];
  enemyGrid: (string | null)[][];
  playerShips: Ship[];
  enemyShips: Ship[];
  selectedShip: Ship | null;
  selectedPlacedShip: Ship | null;
  orientation: 'horizontal' | 'vertical';
  playerTurn: boolean;
  gameOver: boolean;
  gameStats: GameStats;
  placedShips: Record<string, boolean>;
}

export interface ShipType {
  type: string;
  size: number;
  name: string;
}

export interface AITarget {
  row: number;
  col: number;
}

export const SHIPS: ShipType[] = [
  { type: 'carrier', size: 5, name: 'Aircraft Carrier' },
  { type: 'battleship', size: 4, name: 'Battleship' },
  { type: 'cruiser', size: 3, name: 'Cruiser' },
  { type: 'submarine', size: 3, name: 'Submarine' },
  { type: 'destroyer', size: 2, name: 'Destroyer' }
];
