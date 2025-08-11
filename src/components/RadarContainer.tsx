'use client';

import { useGameState } from '../hooks/useGameState';
import { useShipPlacement } from '../hooks/useShipPlacement';
import { useAI } from '../hooks/useAI';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CommandHeader from './CommandHeader';
import StatusMessage from './StatusMessage';
import BattleInterface from './BattleInterface';

export default function RadarContainer() {
  const { gameState, setGameState, statusMessage, updateStatus, selectShip, rotateOrientation, startGame, resetGame } = useGameState();
  const { updateLifetimeRecord, lifetimeRecord } = useLocalStorage();
  const { placeShip, randomPlacement, clearAllShips, checkAllShipsPlaced } = useShipPlacement(gameState, setGameState, updateStatus);
  const { placeAIShips, aiTurn } = useAI(gameState, setGameState, updateStatus, updateLifetimeRecord);

  return (
    <div className="radar-container">
      <CommandHeader 
        gameStats={gameState.gameStats}
        lifetimeRecord={lifetimeRecord}
        onExit={resetGame}
      />
      <StatusMessage message={statusMessage} />
      <BattleInterface
        gameState={gameState}
        setGameState={setGameState}
        updateStatus={updateStatus}
        selectShip={selectShip}
        rotateOrientation={rotateOrientation}
        placeShip={placeShip}
        randomPlacement={randomPlacement}
        clearAllShips={clearAllShips}
        checkAllShipsPlaced={checkAllShipsPlaced}
        startGame={startGame}
        placeAIShips={placeAIShips}
        aiTurn={aiTurn}
        updateLifetimeRecord={updateLifetimeRecord}
      />
    </div>
  );
}
