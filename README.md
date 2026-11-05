# Doodle Time!

A Quick, Draw!-style classroom game. Students draw the English word shown, and the browser-based DoodleNet model (via [ml5.js](https://ml5js.org) 0.12.2) tries to guess it. If it doesn't guess within 20 seconds, the Japanese meaning is revealed.

Static site, no build step. Serve the folder (`python3 -m http.server`) or enable GitHub Pages.

## Files
- `index.html`, `style.css`, `game.js`: the game
- `words.js`: 145 words from the New Horizon Elementary vocabulary list that DoodleNet can recognise (generated from `NHElementaryVocab.xlsx`)

## Settings (top of `game.js`)
`TIME_LIMIT`, `ROUNDS`, `WIN_TOP_N` and `WIN_MIN_CONF` control timing and how easily the model "gets it" (top-1 always wins; otherwise the word must be in the top N guesses with enough confidence).

## Notes
- ml5 is pinned to 0.12.2 because the DoodleNet classifier ships in the 0.x line. The model is fetched from a CDN, so a network connection is required.
- Drawings are cropped, centred and thresholded to 28x28 before classifying, which helps thin or off-centre doodles.
- Ambiguous words (saw, nail, mouse, bat, fan) are left out of `words.js`.
