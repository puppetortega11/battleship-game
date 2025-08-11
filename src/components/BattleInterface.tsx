import { GameState } from '../types/game';
import ShipCommand from './ShipCommand';
import RadarScreen from './RadarScreen';

interface BattleInterfaceProps {
  gameState: GameState;
  setGameState: (updater: (prev: GameState) => GameState) => void;
  updateStatus: (message: string) => void;
  selectShip: (shipType: string) => void;
  rotateOrientation: () => void;
  placeShip: (row: number, col: number) => boolean;
  randomPlacement: () => void;
  clearAllShips: () => void;
  checkAllShipsPlaced: () => boolean;
  startGame: () => void;
  placeAIShips: () => void;
  aiTurn: () => void;
  updateLifetimeRecord: (won: boolean) => void;
}

export default function BattleInterface({
  gameState,
  setGameState,
  updateStatus,
  selectShip,
  rotateOrientation,
  placeShip,
  randomPlacement,
  clearAllShips,
  checkAllShipsPlaced,
  startGame,
  placeAIShips,
  aiTurn,
  updateLifetimeRecord
}: BattleInterfaceProps) {
  return (
    <div className="battle-interface">
      <ShipCommand
        gameState={gameState}
        selectShip={selectShip}
        rotateOrientation={rotateOrientation}
        randomPlacement={randomPlacement}
        clearAllShips={clearAllShips}
        checkAllShipsPlaced={checkAllShipsPlaced}
        startGame={startGame}
        placeAIShips={placeAIShips}
      />
      
      <RadarScreen
        title="🏠 HOME SECTOR"
        grid={gameState.playerGrid}
        ships={gameState.playerShips}
        gridType="player"
        gameState={gameState}
        setGameState={setGameState}
        updateStatus={updateStatus}
        placeShip={placeShip}
      />
      
      <RadarScreen
        title="🎯 ENEMY SECTOR"
        grid={gameState.enemyGrid}
        ships={gameState.enemyShips}
        gridType="enemy"
        gameState={gameState}
        setGameState={setGameState}
        updateStatus={updateStatus}
        aiTurn={aiTurn}
        updateLifetimeRecord={updateLifetimeRecord}
      />
    </div>
  );
}
