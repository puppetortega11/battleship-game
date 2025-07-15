// Trigger redeploy
// script.js - Battleship Game Logic

const playerGrid = Array(10).fill().map(() => Array(10).fill(null));
const aiGrid = Array(10).fill().map(() => Array(10).fill(null));
const ships = [
  { type: 'Carrier', size: 5, hits: 0 },
  { type: 'Battleship', size: 4, hits: 0 },
  { type: 'Cruiser', size: 3, hits: 0 },
  { type: 'Submarine', size: 3, hits: 0 },
  { type: 'Destroyer', size: 2, hits: 0 }
];
let playerShips = JSON.parse(JSON.stringify(ships));
let aiShips = JSON.parse(JSON.stringify(ships));
let gameState = {
  turn: 'player',
  gameOver: false,
  winner: null
};

function placeShips(grid, shipList) {
  shipList.forEach(ship => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;
    // Fix: Prevent infinite loop and out-of-bounds placement by limiting attempts and checking boundaries
    while (!placed && attempts < maxAttempts) {
      const isHorizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      if (canPlaceShip(grid, row, col, ship.size, isHorizontal)) {
        for (let i = 0; i < ship.size; i++) {
          if (isHorizontal) grid[row][col + i] = ship.type;
          else grid[row + i][col] = ship.type;
        }
        placed = true;
      }
      attempts++;
    }
    if (!placed) {
      console.warn(`Could not place ship: ${ship.type}`);
    }
  });
}

function canPlaceShip(grid, row, col, size, isHorizontal) {
  if (isHorizontal) {
    if (col + size > 10) return false;
    for (let i = 0; i < size; i++) {
      if (grid[row][col + i]) return false;
    }
  } else {
    if (row + size > 10) return false;
    for (let i = 0; i < size; i++) {
      if (grid[row + i][col]) return false;
    }
  }
  return true;
}

function renderGrid(gridId, grid, showShips = false) {
  const board = document.getElementById(gridId);
  board.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (grid[i][j] === 'hit') cell.classList.add('hit');
      else if (grid[i][j] === 'miss') cell.classList.add('miss');
      else if (showShips && grid[i][j] && grid[i][j] !== 'hit' && grid[i][j] !== 'miss') cell.classList.add('ship');
      if (gridId === 'ai-board' && !gameState.gameOver) {
        cell.addEventListener('click', () => handlePlayerAttack(i, j));
      }
      board.appendChild(cell);
    }
  }
}

function handlePlayerAttack(row, col) {
  // Fix: Ignore clicks on already attacked cells (hit or miss)
  if (gameState.gameOver || gameState.turn !== 'player' || aiGrid[row][col] === 'hit' || aiGrid[row][col] === 'miss') return;
  const shipType = aiGrid[row][col];
  if (shipType) {
    aiGrid[row][col] = 'hit';
    const ship = aiShips.find(s => s.type === shipType);
    ship.hits++;
    if (ship.hits === ship.size) {
      updateStatus(`You sunk the AI's ${ship.type}!`);
    }
  } else {
    aiGrid[row][col] = 'miss';
    updateStatus('You missed!');
  }
  renderGrid('ai-board', aiGrid, false);
  checkWin();
  if (!gameState.gameOver) {
    gameState.turn = 'ai';
    setTimeout(handleAIAttack, 500);
  }
}

function handleAIAttack() {
  if (gameState.gameOver) return;
  let row, col;
  do {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
  } while (playerGrid[row][col] === 'hit' || playerGrid[row][col] === 'miss');
  const shipType = playerGrid[row][col];
  if (shipType) {
    playerGrid[row][col] = 'hit';
    const ship = playerShips.find(s => s.type === shipType);
    ship.hits++;
    if (ship.hits === ship.size) {
      updateStatus(`AI sunk your ${ship.type}!`);
    }
  } else {
    playerGrid[row][col] = 'miss';
    updateStatus('AI missed!');
  }
  renderGrid('player-board', playerGrid, true);
  checkWin();
  if (!gameState.gameOver) {
    gameState.turn = 'player';
    updateStatus('Your turn!');
  }
}

function checkWin() {
  const playerLost = playerShips.every(ship => ship.hits === ship.size);
  const aiLost = aiShips.every(ship => ship.hits === ship.size);
  if (playerLost || aiLost) {
    gameState.gameOver = true;
    gameState.winner = playerLost ? 'AI' : 'Player';
    updateStatus(`Game Over! ${gameState.winner} wins!`);
    renderGrid('ai-board', aiGrid, true); // Show AI ships at game end
  }
}

function updateStatus(message) {
  document.getElementById('status').textContent = message;
}

function resetGame() {
  playerGrid.forEach(row => row.fill(null));
  aiGrid.forEach(row => row.fill(null));
  playerShips = JSON.parse(JSON.stringify(ships));
  aiShips = JSON.parse(JSON.stringify(ships));
  gameState = { turn: 'player', gameOver: false, winner: null };
  updateStatus('Click "Start Game" to begin!');
}

document.getElementById('start-game').addEventListener('click', () => {
  resetGame();
  placeShips(playerGrid, playerShips);
  placeShips(aiGrid, aiShips);
  renderGrid('player-board', playerGrid, true);
  renderGrid('ai-board', aiGrid, false);
  updateStatus('Your turn!');
});

document.getElementById('random-ships').addEventListener('click', () => {
  resetGame();
  placeShips(playerGrid, playerShips);
  renderGrid('player-board', playerGrid, true);
  updateStatus('Ships placed! Click "Start Game" to play.');
});

// Initial render
renderGrid('player-board', playerGrid, true);
renderGrid('ai-board', aiGrid, false);
