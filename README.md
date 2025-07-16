# Battleship Game

A web-based Battleship game where a player competes against an AI opponent. The game is implemented using HTML, CSS, and JavaScript and is deployed on GitHub Pages.

## Live Demo
Play the game here: [https://your-username.github.io/battleship-game/](https://your-username.github.io/battleship-game/)

## How to Play
- Click "Place Ships Randomly" to place your ships on the player grid.
- Click "Start Game" to begin.
- Click cells on the AI board to attack. The AI will respond with its own attacks.
- Sink all AI ships to win, or lose if the AI sinks all your ships.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/battleship-game.git
   ```
2. Open `index.html` in a browser to play locally.

## Bug Report
See [BUGS.md](./BUGS.md) for a detailed list of bugs found and fixed during development.

## Note on Testing
The game was tested across Chrome, Firefox, and Safari on desktop and mobile devices. No additional bugs were found beyond those listed in BUGS.md.

---

## 1. **Keep It Static**
- **GitHub Pages** is designed for static sites (HTML, CSS, JS only).
- Avoid any server-side code or build steps that require Node.js, Python, etc., unless you use a static site generator (which you are not).

---

## 2. **Minimize File Size**
- **Minify** your CSS and JS files (remove whitespace and comments).
  - Use tools like [cssnano](https://cssnano.co/) for CSS and [Terser](https://terser.org/) for JS.
  - For a small project, you can use [https://www.toptal.com/developers/cssminifier](https://www.toptal.com/developers/cssminifier) and [https://www.toptal.com/developers/javascript-minifier](https://www.toptal.com/developers/javascript-minifier) to quickly minify your files.
- **Remove unused code** and comments.

---

## 3. **Flatten the Directory Structure**
- Keep all your files (`index.html`, `styles.css`, `script.js`, etc.) in the root directory.
- Avoid unnecessary folders or deeply nested structures.

---

## 4. **Use Relative Paths**
- Always use relative paths for CSS and JS in your HTML:
  ```html
  <link rel="stylesheet" href="styles.css">
  <script src="script.js"></script>
  ```

---

## 5. **Avoid Large Assets**
- Don’t include large images, videos, or audio files unless necessary.
- If you use images, compress them with [TinyPNG](https://tinypng.com/) or similar tools.

---

## 6. **Check for Unused Dependencies**
- If you’re not using any package manager (like npm), make sure you don’t have unused libraries or files in your repo.

---

## 7. **Optimize Your HTML**
- Remove unnecessary comments and whitespace.
- Use semantic HTML for better accessibility and SEO.

---

## 8. **Test Locally Before Pushing**
- Open `index.html` in your browser and use DevTools to check for errors.
- Make sure all assets load correctly and the game works as expected.

---

## 9. **Keep Your README and Documentation Clean**
- A clear, concise `README.md` helps others (and yourself) understand and use your project.

---

## 10. **GitHub Actions (if used)**
- If you use custom GitHub Actions workflows, keep them simple and only run what’s necessary for a static site.
- Avoid unnecessary build steps or dependencies.

---

## Example: Minified JS and CSS

**Before:**
```js
function helloWorld() {
    console.log("Hello, world!");
}
```
**After:**
```js
function helloWorld(){console.log("Hello, world!");}
```

---

## Next Steps

1. **Minify your CSS and JS** (use the online tools above).
2. **Replace your current `styles.css` and `script.js` with the minified versions.**
3. **Commit and push the changes.**
4. **Test your site again.**

---

If you want, I can minify your current CSS and JS for you and update the files—just let me know!  
Or, if you want to see a sample minified version, I can provide that as well.

---

## 1. **Check What’s Changed**

Run:
```sh
<code_block_to_apply_changes_from>
git status
```
This will show you all modified files.

---

## 2. **Stage and Commit Files One by One**

For each file, do:

```sh
git add <filename>
git commit -m "Describe the change for <filename>"
git push origin main
```

**Example:**
```sh
<code_block_to_apply_changes_from>
```
Wait for the GitHub Actions job to start and see if it completes.  
If it does, move to the next file.

---

## 3. **Repeat for Each File**

- `script.js` (minified JS)
- `index.html` (structure/layout changes)
- `README.md` (documentation)
- `BUGS.md` (bug log)

---

## 4. **Monitor Each Deploy**

- After each push, check the Actions tab and your GitHub Pages site.
- If a deploy fails, you’ll know exactly which file/change caused it.

---

## 5. **If a Commit Fails**

- Wait a bit, then try again.
- If only one file is being pushed, it’s easier to retry and debug.

---

## Why This Works

- Smaller commits are less likely to hit GitHub’s runner backlog.
- You can get partial progress even if one deploy fails.
- Easier to identify and fix issues.

---

## Next Steps

Would you like me to start with `styles.css`, then move to `script.js`, then `index.html`, and so on?  
Just confirm, and I’ll walk you through each commit and push, one at a time!
