# Doodle Time!

A Quick, Draw!-style classroom game. Students draw the English word shown, and the browser-based DoodleNet model (via [ml5.js](https://ml5js.org) 0.12.2) tries to guess it. If it doesn't guess within 20 seconds, the Japanese meaning is revealed.

Static site, no build step. Serve the folder (`python3 -m http.server`) or enable GitHub Pages.

## Files
- `index.html`, `style.css`, `game.js`: the game (UI, sounds and confetti are all generated in code, no asset files)
- `words.js`: 136 words from the students' textbooks (Let's Try 1 & 2, New Horizon 5 & 6, Picture Dictionary) that DoodleNet can recognise. Each has a Japanese meaning with furigana and the school years (3-6) whose books contain it. Colors, shapes and words that are too hard to draw are left out.

## Settings (top of `game.js`)
`TIME_LIMIT`, `ROUNDS`, `WIN_TOP_N` and `WIN_MIN_CONF` control timing and how easily the model "gets it" (top-1 always wins; otherwise the word must be in the top N guesses with enough confidence).

## Notes
- ml5 is pinned to 0.12.2 because the DoodleNet classifier ships in the 0.x line. The model is fetched from a CDN, so a network connection is required.
- Drawings are cropped, centred and thresholded to 28x28 before classifying, which helps thin or off-centre doodles.
- Words whose textbook meaning differs from the dataset's (saw = 見た, nail = 爪, fan) are left out of `words.js`.
- The how-to-play modal (simple Japanese) opens on a first visit and from the ？ button on the start screen. The year picker (3年-6年, ぜんぶ) filters the word pool.
