// script.js - Battleship Game Logic (Strategy Panel and Gameplay)

const SHIPS = [
  { type: 'carrier', size: 5 },
  { type: 'battleship', size: 4 },
  { type: 'cruiser', size: 3 },
  { type: 'submarine', size: 3 },
  { type: 'destroyer', size: 2 }
];

let playerGrid = Array(10).fill().map(() => Array(10).fill(null));
let aiGrid = Array(10).fill().map(() => Array(10).fill(null));
let placedShips = [];
let selectedShip = null;
let orientation = 'horizontal';
let gamePhase = 'strategy'; // 'strategy' or 'gameplay'

function renderGrid(gridId, grid, showShips = false) {
  const board = document.getElementById(gridId);
  board.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (grid[i][j] && grid[i][j] !== 'hit' && grid[i][j] !== 'miss' && showShips) cell.classList.add('ship');
      if (grid[i][j] === 'hit') cell.classList.add('hit');
      if (grid[i][j] === 'miss') cell.classList.add('miss');
      if (gamePhase === 'strategy' && gridId === 'strategy-grid') {
        cell.addEventListener('mouseenter', () => highlightPlacement(i, j));
        cell.addEventListener('mouseleave', () => renderGrid('strategy-grid', playerGrid, true));
        cell.addEventListener('click', () => placeShip(i, j));
      }
      if (gamePhase === 'gameplay' && gridId === 'ai-board') {
        cell.addEventListener('click', () => handlePlayerAttack(i, j));
      }
      board.appendChild(cell);
    }
  }
}

function highlightPlacement(row, col) {
  renderGrid('strategy-grid', playerGrid, true);
  if (!selectedShip) return;
  const board = document.getElementById('strategy-grid');
  let valid = canPlaceShip(playerGrid, row, col, selectedShip.size, orientation);
  for (let i = 0; i < selectedShip.size; i++) {
    let r = row + (orientation === 'vertical' ? i : 0);
    let c = col + (orientation === 'horizontal' ? i : 0);
    if (r < 10 && c < 10) {
      const idx = r * 10 + c;
      board.children[idx].classList.add('selected');
      if (!valid) board.children[idx].style.background = '#e74c3c';
    }
  }
}

function canPlaceShip(grid, row, col, size, orientation) {
  if (orientation === 'horizontal') {
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

function placeShip(row, col) {
  if (!selectedShip) return;
  if (!canPlaceShip(playerGrid, row, col, selectedShip.size, orientation)) {
    updateStatus('Invalid placement!');
    return;
  }
  for (let i = 0; i < selectedShip.size; i++) {
    let r = row + (orientation === 'vertical' ? i : 0);
    let c = col + (orientation === 'horizontal' ? i : 0);
    playerGrid[r][c] = selectedShip.type;
  }
  placedShips.push({ ...selectedShip, row, col, orientation });
  document.querySelector(`.ship-silhouette[data-type="${selectedShip.type}"]`).classList.add('placed');
  selectedShip = null;
  renderGrid('strategy-grid', playerGrid, true);
  updateStatus('Ship placed!');
}

function updateStatus(msg) {
  document.getElementById('status').textContent = msg;
}

function resetStrategy() {
  playerGrid = Array(10).fill().map(() => Array(10).fill(null));
  placedShips = [];
  selectedShip = null;
  document.querySelectorAll('.ship-silhouette').forEach(el => {
    el.classList.remove('placed', 'selected');
  });
  renderGrid('strategy-grid', playerGrid, true);
  updateStatus('Click a ship to place it.');
}

function rotateShip() {
  orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
  updateStatus(`Orientation: ${orientation}`);
}

function deleteShip() {
  if (!selectedShip) return;
  // Remove ship from grid
  for (let i = 0; i < placedShips.length; i++) {
    if (placedShips[i].type === selectedShip.type) {
      let { row, col, size, orientation } = placedShips[i];
      for (let j = 0; j < size; j++) {
        let r = row + (orientation === 'vertical' ? j : 0);
        let c = col + (orientation === 'horizontal' ? j : 0);
        playerGrid[r][c] = null;
      }
      placedShips.splice(i, 1);
      break;
    }
  }
  document.querySelector(`.ship-silhouette[data-type="${selectedShip.type}"]`).classList.remove('placed');
  renderGrid('strategy-grid', playerGrid, true);
  updateStatus('Ship deleted.');
}

function closeStrategyPanel() {
  document.getElementById('strategy-panel').style.display = 'none';
  gamePhase = 'gameplay';
  aiGrid = Array(10).fill().map(() => Array(10).fill(null));
  placeAIShips();
  renderGrid('ai-board', aiGrid, false);
  renderGrid('strategy-grid', playerGrid, true);
  updateStatus('Game started! Attack the AI board.');
}

function placeAIShips() {
  SHIPS.forEach(ship => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      let orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      let row = Math.floor(Math.random() * 10);
      let col = Math.floor(Math.random() * 10);
      if (canPlaceShip(aiGrid, row, col, ship.size, orientation)) {
        for (let i = 0; i < ship.size; i++) {
          let r = row + (orientation === 'vertical' ? i : 0);
          let c = col + (orientation === 'horizontal' ? i : 0);
          aiGrid[r][c] = ship.type;
        }
        placed = true;
      }
      attempts++;
    }
  });
}

function handlePlayerAttack(row, col) {
  if (gamePhase !== 'gameplay') return;
  if (aiGrid[row][col] === 'hit' || aiGrid[row][col] === 'miss') return;
  if (aiGrid[row][col]) {
    aiGrid[row][col] = 'hit';
    updateStatus('Hit!');
  } else {
    aiGrid[row][col] = 'miss';
    updateStatus('Miss!');
  }
  renderGrid('ai-board', aiGrid, false);
  // TODO: Add win check and AI attack logic
}

document.addEventListener('DOMContentLoaded', () => {
  renderGrid('strategy-grid', playerGrid, true);
  renderGrid('ai-board', aiGrid, false);
  updateStatus('Click a ship to place it.');

  document.querySelectorAll('.ship-silhouette').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.ship-silhouette').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      selectedShip = SHIPS.find(s => s.type === el.dataset.type);
      updateStatus(`Placing: ${selectedShip.type} (${orientation})`);
    });
  });

  document.getElementById('rotate-btn').addEventListener('click', rotateShip);
  document.getElementById('reset-btn').addEventListener('click', resetStrategy);
  document.getElementById('delete-btn').addEventListener('click', deleteShip);
  document.getElementById('close-btn').addEventListener('click', closeStrategyPanel);
}); 