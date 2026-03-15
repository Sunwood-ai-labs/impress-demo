<p align="center">
  <img src="./assets/impress-demo-mark.svg" width="160" alt="impress-demo slide mark" />
</p>

<div align="center">

# impress-demo

A public showcase of `impress.js` slide decks built around the `draw-io-skill` v0.1.0 article. This repository keeps multiple variants side by side so you can compare the original structure, stronger 3D motion, readability-focused edits, and a presentation-first edition from a single landing page.

<p>
  <a href="https://github.com/Sunwood-ai-labs/impress-demo/actions/workflows/deploy-pages.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/Sunwood-ai-labs/impress-demo/deploy-pages.yml?branch=main&style=flat-square&label=Pages%20Deploy" alt="Pages Deploy status" />
  </a>
  <a href="https://sunwood-ai-labs.github.io/impress-demo/">
    <img src="https://img.shields.io/badge/GitHub%20Pages-Live-0c7a80?style=flat-square" alt="GitHub Pages Live" />
  </a>
  <img src="https://img.shields.io/badge/Decks-4-d4573f?style=flat-square" alt="4 decks" />
</p>

<p>
  <a href="./README.md"><strong>English</strong></a>
  ·
  <a href="./README.ja.md">日本語</a>
</p>

</div>

## ✨ Overview

- Hosts four `impress.js` deck variants for the same `draw-io-skill` topic.
- Publishes a GitHub Pages landing page with direct links to every deck.
- Keeps Pages-safe static assets in-repo, including a shared `impress.js` bundle.
- Includes text and whitespace checks for the readability and presentation-focused decks.

## 🌐 Live Decks

- Landing page: [sunwood-ai-labs.github.io/impress-demo](https://sunwood-ai-labs.github.io/impress-demo/)

| Deck | Focus | Live URL |
| --- | --- | --- |
| `draw-io-skill` | Original article-based structure | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill/) |
| `draw-io-skill-3d` | Stronger 3D camera movement | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill-3d/) |
| `draw-io-skill-3d-readable` | Improved line breaks and reading comfort | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill-3d-readable/) |
| `draw-io-skill-3d-presentation` | Presentation-first layout with bullets and whitespace checks | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill-3d-presentation/) |

## 🧭 Deck Guide

- Choose `draw-io-skill` when you want the most faithful article-to-slide conversion.
- Choose `draw-io-skill-3d` when the transition itself should feel spatial and dramatic.
- Choose `draw-io-skill-3d-readable` when readability matters more than maximal motion.
- Choose `draw-io-skill-3d-presentation` for talks, demos, and speaker-led delivery.

## 🚀 Quick Start

```bash
npm install
npm start
```

Then open one of these local URLs:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/slide/draw-io-skill/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d-readable/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d-presentation/`

## 🧪 Quality Checks

```bash
npm run check
npm run check:slide-text:readable
npm run check:slide-text:presentation
npm run check:slide-space:presentation
npm run build:pages
```

- `npm run check` runs the default text and whitespace checks used by the presentation workflow.
- `npm run build:pages` exports the public artifact into `dist-pages/`.

## 🎛️ Controls

- `Space`
- `←` / `→`
- `Tab`

## 📁 Repository Layout

```text
.
|-- index.html
|-- site.css
|-- slide/
|   |-- draw-io-skill/
|   |-- draw-io-skill-3d/
|   |-- draw-io-skill-3d-readable/
|   |-- draw-io-skill-3d-presentation/
|   `-- shared/
|-- scripts/
|   |-- build-pages.mjs
|   |-- check-slide-text.mjs
|   `-- check-slide-whitespace.mjs
`-- .github/workflows/
    `-- deploy-pages.yml
```

## ⚙️ Deployment

- GitHub Actions deploys GitHub Pages on every push to `main`.
- The workflow lives in [`deploy-pages.yml`](./.github/workflows/deploy-pages.yml).
- The Pages build is created by [`build-pages.mjs`](./scripts/build-pages.mjs).
- The live site is published at [sunwood-ai-labs.github.io/impress-demo](https://sunwood-ai-labs.github.io/impress-demo/).

## 📝 Notes

- Project-specific notes stay inside each deck directory under `slide/*/README.md`.
- Shared runtime assets for GitHub Pages live in `slide/shared/`.
- The presentation-focused deck also includes heuristic whitespace detection to catch layouts that feel too top-heavy.
