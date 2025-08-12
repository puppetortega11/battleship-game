import { GameStats } from '../types/game';

interface LifetimeRecord {
  gamesPlayed: number;
  gamesWon: number;
  winPercentage: number;
}

interface CommandHeaderProps {
  gameStats: GameStats;
  lifetimeRecord: LifetimeRecord;
  onExit: () => void;
}

export default function CommandHeader({ gameStats, lifetimeRecord, onExit }: CommandHeaderProps) {
  return (
    <div className="command-header">
      <h1>⚡ NAVAL RADAR COMMAND ⚡</h1>
      <button className="exit-btn" title="Exit to Home / Start New Game" onClick={onExit}>
        EXIT
      </button>
      
      <div className="status-bar">
        <div className="mode-selector">
          <button className="mode-btn active" data-mode="classic">
            Standard
          </button>
        </div>
        
        <div className="radar-stats">
          <div className="stat-item">
            <div className="stat-value">{gameStats.score.toString().padStart(3, '0')}</div>
            <div>SCORE</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{gameStats.shotsFired.toString().padStart(3, '0')}</div>
            <div>FIRED</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {gameStats.shotsFired > 0 ? Math.round((gameStats.hits / gameStats.shotsFired) * 100) : 0}%
            </div>
            <div>ACCURACY</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{gameStats.enemyShipsRemaining.toString().padStart(2, '0')}</div>
            <div>TARGETS</div>
          </div>
        </div>
        
        <div className="lifetime-record">
          <div className="lifetime-record-title">LIFETIME RECORD</div>
          <div className="lifetime-record-value">Games Played: {lifetimeRecord.gamesPlayed}</div>
          <div className="lifetime-record-value">Win %: {lifetimeRecord.winPercentage}%</div>
        </div>
      </div>
    </div>
  );
}
