# Automotive Manufacturing Flow

A static, scroll-driven page that walks through eight manufacturing stations
(Design → Plan & Source → Make → Quality → Maintain → Deliver → Serve → Learn & Improve)
using 2.5D isometric SVG scenes with ambient CSS animation.

- Plain HTML / CSS / vanilla JS, no runtime dependencies, relative paths only.
- Scenes are inline SVG animated with CSS `@keyframes` (`transform` / `opacity` only).
- `IntersectionObserver` handles text fade-in, side navigation and pausing off-screen animation.
- Respects `prefers-reduced-motion`.

## Deploy to GitHub Pages

Push this folder to a repository, then **Settings → Pages → Deploy from a branch** and pick the branch and `/ (root)`.
`index.html` is already generated, so no build step is needed on GitHub.

## Editing the scenes

The SVG scenes are generated from small isometric helpers so they stay consistent:

```
tools/iso.js     projection + box / cylinder / plane helpers, palette
tools/parts.js   conveyor, robot arm, worker, car, boards, tower light, ...
tools/scenes.js  the eight scenes
tools/build.js   writes index.html (step text lives here)
```

After editing anything in `tools/`, regenerate the page (Node.js required locally):

```
node tools/build.js
```

Styling and animation live in `css/style.css`; scroll behaviour in `js/main.js`.
