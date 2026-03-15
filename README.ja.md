<p align="center">
  <img src="./assets/impress-demo-mark.svg" width="160" alt="impress-demo slide mark" />
</p>

<div align="center">

# impress-demo

`draw-io-skill` v0.1.0 記事をもとにした `impress.js` スライド群を公開するリポジトリです。元版、3D 強化版、可読性改善版、発表向け版を 1 つのランディングページから見比べられるように整理しています。

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
  <a href="./README.md">English</a>
  ·
  <a href="./README.ja.md"><strong>日本語</strong></a>
</p>

</div>

## ✨ 概要

- 同じ `draw-io-skill` テーマに対して 4 種類の `impress.js` デッキを収録しています。
- GitHub Pages のランディングページから各デッキへ直接移動できます。
- Pages でそのまま動くように、共有 `impress.js` を含む静的アセットをリポジトリ内に持っています。
- 可読性重視版と発表版には、テキストや余白のチェックコマンドも用意しています。

## 🌐 公開デッキ

- ランディングページ: [sunwood-ai-labs.github.io/impress-demo](https://sunwood-ai-labs.github.io/impress-demo/)

| デッキ | 役割 | 公開 URL |
| --- | --- | --- |
| `draw-io-skill` | 記事構成をベースにした元版 | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill/) |
| `draw-io-skill-3d` | 空間移動を強めた 3D 版 | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill-3d/) |
| `draw-io-skill-3d-readable` | 改行と文字サイズを読みやすく調整した版 | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill-3d-readable/) |
| `draw-io-skill-3d-presentation` | bullet と余白設計を重視した発表版 | [Open](https://sunwood-ai-labs.github.io/impress-demo/slide/draw-io-skill-3d-presentation/) |

## 🧭 デッキの選び方

- 記事内容をそのまま追いたいなら `draw-io-skill`
- 立体的な遷移を強く見せたいなら `draw-io-skill-3d`
- 読みやすさを優先したいなら `draw-io-skill-3d-readable`
- 登壇やデモ用途なら `draw-io-skill-3d-presentation`

## 🚀 クイックスタート

```bash
npm install
npm start
```

起動後は次のローカル URL を開けます。

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/slide/draw-io-skill/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d-readable/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d-presentation/`

## 🧪 チェック

```bash
npm run check
npm run check:slide-text:readable
npm run check:slide-text:presentation
npm run check:slide-space:presentation
npm run build:pages
```

- `npm run check` は発表版に使っている主要チェックをまとめて実行します。
- `npm run build:pages` は公開用アーティファクトを `dist-pages/` に出力します。

## 🎛️ 操作

- `Space`
- `←` / `→`
- `Tab`

## 📁 リポジトリ構成

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

## ⚙️ デプロイ

- `main` への push ごとに GitHub Actions から GitHub Pages へデプロイします。
- workflow は [`deploy-pages.yml`](./.github/workflows/deploy-pages.yml) にあります。
- Pages ビルドは [`build-pages.mjs`](./scripts/build-pages.mjs) で生成します。
- 公開 URL は [sunwood-ai-labs.github.io/impress-demo](https://sunwood-ai-labs.github.io/impress-demo/) です。

## 📝 補足

- デッキごとの補足は `slide/*/README.md` に置いています。
- GitHub Pages 用の共有ランタイムは `slide/shared/` にまとめています。
- 発表版では「上に詰まりすぎて下半分が空く」ような余白の偏りもヒューリスティックで検知します。
