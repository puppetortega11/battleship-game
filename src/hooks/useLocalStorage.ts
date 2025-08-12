import { useState, useEffect } from 'react';

interface LifetimeRecord {
  gamesPlayed: number;
  gamesWon: number;
  winPercentage: number;
}

export function useLocalStorage() {
  const [lifetimeRecord, setLifetimeRecord] = useState<LifetimeRecord>({
    gamesPlayed: 0,
    gamesWon: 0,
    winPercentage: 0
  });

  useEffect(() => {
    updateLifetimeRecordDisplay();
  }, []);

  const updateLifetimeRecordDisplay = () => {
    const gamesPlayed = parseInt(localStorage.getItem('battleship_gamesPlayed') || '0', 10);
    const gamesWon = parseInt(localStorage.getItem('battleship_gamesWon') || '0', 10);
    const winPercentage = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    
    setLifetimeRecord({
      gamesPlayed,
      gamesWon,
      winPercentage
    });
  };

  const updateLifetimeRecord = (won: boolean) => {
    let gamesPlayed = parseInt(localStorage.getItem('battleship_gamesPlayed') || '0', 10);
    let gamesWon = parseInt(localStorage.getItem('battleship_gamesWon') || '0', 10);
    
    gamesPlayed++;
    if (won) gamesWon++;
    
    localStorage.setItem('battleship_gamesPlayed', gamesPlayed.toString());
    localStorage.setItem('battleship_gamesWon', gamesWon.toString());
    
    updateLifetimeRecordDisplay();
  };

  return {
    lifetimeRecord,
    updateLifetimeRecord
  };
}
