import { GameState, Ship } from '../types/game';
import RadarGrid from './RadarGrid';

interface RadarScreenProps {
  title: string;
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

export default function RadarScreen({
  title,
  grid,
  ships,
  gridType,
  gameState,
  setGameState,
  updateStatus,
  placeShip,
  aiTurn,
  updateLifetimeRecord
}: RadarScreenProps) {
  return (
    <div className="radar-screen">
      <div className="screen-title">{title}</div>
      <div className="grid-display">
        <div className="coordinate-labels letters">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(letter => (
            <span key={letter}>{letter}</span>
          ))}
        </div>
        <div className="coordinate-labels numbers">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => (
            <span key={number}>{number}</span>
          ))}
        </div>
        <RadarGrid
          grid={grid}
          ships={ships}
          gridType={gridType}
          gameState={gameState}
          setGameState={setGameState}
          updateStatus={updateStatus}
          placeShip={placeShip}
          aiTurn={aiTurn}
          updateLifetimeRecord={updateLifetimeRecord}
        />
      </div>
    </div>
  );
}
