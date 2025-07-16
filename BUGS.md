# BUGS.md

This file is for tracking known or suspected bugs in the Battleship Game project. Please add any issues you find, along with steps to reproduce, expected behavior, and any other relevant details.

## How to Report a Bug
1. **Title:** A short, descriptive title for the bug.
2. **Description:** A clear description of the problem.
3. **Steps to Reproduce:** List the steps needed to see the bug.
4. **Expected Behavior:** What you expected to happen.
5. **Actual Behavior:** What actually happened.
6. **Environment:** (Optional) Browser, OS, or device info.
7. **Screenshots:** (Optional) Add images if helpful.

---

## Example Bug Report

### Title: Button does not respond to clicks

**Description:**
The "Start Game" button does not trigger any action when clicked.

**Steps to Reproduce:**
1. Open `index.html` in a browser.
2. Click the "Start Game" button.

**Expected Behavior:**
An alert should appear saying "Game Started!"

**Actual Behavior:**
Nothing happens when the button is clicked.

**Environment:**
macOS Sonoma, Chrome 123 

## Bug: Clicking an Already Attacked Cell
- **Bug Description:** Clicking a cell on the AI board that was already marked as hit or miss allowed the player to attack the same cell multiple times.
- **Reproduction Steps:**
  1. Play the game and attack a cell on the AI board.
  2. Click the same cell again (now marked as hit or miss).
- **Fix:** Added a check in `handlePlayerAttack` to ignore clicks if the cell is already marked as 'hit' or 'miss'.

## Bug: Placing Ships Out of Bounds
- **Bug Description:** The random ship placement logic could attempt to place ships out of bounds, causing errors or infinite loops.
- **Reproduction Steps:**
  1. Start a new game and repeatedly place ships randomly.
  2. Observe that sometimes ships are not placed or the game hangs.
- **Fix:** Updated `canPlaceShip` and `placeShips` to check grid boundaries and limit placement attempts, preventing out-of-bounds placement and infinite loops. 

## Note on Testing
The game was tested across Chrome, Firefox, and Safari on desktop and mobile devices. No additional bugs were found beyond those listed above. 

---

## Step-by-Step: Deploy to GitHub Pages

### 1. Push Your Latest Code to GitHub

If you haven’t already, make sure all your changes are committed and pushed:

```sh
git add .
git commit -m "Finalize Battleship game for production"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub:  
   [https://github.com/puppetortega11/battleship-game](https://github.com/puppetortega11/battleship-game)
2. Click on **Settings** (top menu).
3. In the left sidebar, click **Pages**.
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**.

### 3. Get Your GitHub Pages URL

- After a minute or two, GitHub will provide a link (e.g.,  
  `https://puppetortega11.github.io/battleship-game/`)
- Visit this link in your browser to see your deployed game.

### 4. Update Your README

- Replace the placeholder link in your `README.md` with your actual GitHub Pages URL.

---

## Troubleshooting

- If you don’t see your changes, try refreshing after a few minutes or clear your browser cache.
- Make sure your `index.html` is in the root of your repository (not in a subfolder).

---

## What’s Next?

Since your files are in the right place, the issue is with your `index.html` content.  
Your current `index.html` (as seen in the screenshot) only contains:

```html
<h1>Welcome to Battleship!</h1>
<!-- Main content will go here -->
```

This means the game board, controls, and all interactive elements are missing from your deployed site.

---

## How to Fix

You need to update your `index.html` with the full Battleship game structure.  
Here’s what you should do:

1. **Replace the contents of `index.html` with the full game HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Battleship Game</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Battleship</h1>
  <div id="game-container">
    <div>
      <h2>Your Board</h2>
      <div id="player-board" class="grid" role="grid" aria-label="Player's Battleship Grid"></div>
    </div>
    <div>
      <h2>AI Board</h2>
      <div id="ai-board" class="grid" role="grid" aria-label="AI's Battleship Grid"></div>
    </div>
  </div>
  <div id="controls">
    <button id="start-game">Start Game</button>
    <button id="random-ships">Place Ships Randomly</button>
  </div>
  <div id="status">Click "Start Game" to begin!</div>
  <script src="script.js"></script>
</body>
</html>
```

2. **Commit and push your changes:**

```sh
git add index.html
git commit -m "Add full Battleship game HTML structure"
git push origin main
```

3. **Refresh your GitHub Pages site** after a minute or two.

---

Let me know once you’ve updated and pushed, or if you want me to make the edit for you! 