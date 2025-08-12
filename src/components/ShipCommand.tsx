import { GameState, SHIPS } from '../types/game';
import ShipSelector from './ShipSelector';

interface ShipCommandProps {
  gameState: GameState;
  selectShip: (shipType: string) => void;
  rotateOrientation: () => void;
  randomPlacement: () => void;
  clearAllShips: () => void;
  checkAllShipsPlaced: () => boolean;
  startGame: () => void;
  placeAIShips: () => void;
}

export default function ShipCommand({
  gameState,
  selectShip,
  rotateOrientation,
  randomPlacement,
  clearAllShips,
  checkAllShipsPlaced,
  startGame,
  placeAIShips
}: ShipCommandProps) {
  const handleStartBattle = () => {
    if (checkAllShipsPlaced()) {
      placeAIShips();
      startGame();
    }
  };

  return (
    <div className="ship-command">
      <h3>🚢 FLEET COMMAND</h3>
      <div className="fleet-roster">
        {SHIPS.map(ship => (
          <ShipSelector
            key={ship.type}
            ship={ship}
            isSelected={gameState.selectedShip?.type === ship.type}
            isDeployed={gameState.placedShips[ship.type]}
            onSelect={() => selectShip(ship.type)}
          />
        ))}
      </div>
      
      <div className="command-controls">
        <button className="control-button" onClick={rotateOrientation}>
          ↻ ROTATE
        </button>
        <button className="control-button" onClick={randomPlacement}>
          ⚡ AUTO DEPLOY
        </button>
        <button className="control-button" onClick={clearAllShips}>
          ⌫ CLEAR ALL
        </button>
        <button 
          className="control-button" 
          disabled={!gameState.selectedPlacedShip}
        >
          🗑 DELETE
        </button>
        <button 
          className={`control-button ${checkAllShipsPlaced() ? 'pulse-start' : ''}`}
          disabled={!checkAllShipsPlaced()}
          onClick={handleStartBattle}
        >
          ▶ START BATTLE
        </button>
      </div>
    </div>
  );
}
