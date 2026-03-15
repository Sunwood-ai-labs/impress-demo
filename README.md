# impress-demo

`slide/` 配下にスライドプロジェクトをまとめていくためのリポジトリです。

## 構成

- `slide/draw-io-skill/`
  - `draw-io-skill` v0.1.0 を紹介する `impress.js` デッキ
- `slide/draw-io-skill-3d/`
  - 同内容をより立体的な遷移で見せる `impress.js` デッキ
- `slide/draw-io-skill-3d-readable/`
  - 3D 遷移を維持しつつ、文字サイズと改行の読みやすさを改善したデッキ
- `slide/draw-io-skill-3d-presentation/`
  - 発表向けに文章量を削り、短い bullet と図解を中心に再構成したデッキ

## 使い方

```bash
npm install
npm start
```

サーバー起動後、ブラウザで各プロジェクトのパスを開きます。

- `http://127.0.0.1:4173/slide/draw-io-skill/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d-readable/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d-presentation/`

## メモ

- 依存関係はルートの `package.json` でまとめて管理します
- スライドごとの説明は各プロジェクト配下の `README.md` に置きます
- テキストの静的チェックは `npm run check:slide-text:readable` で実行できます
- 発表向けデッキのチェックは `npm run check:slide-text:presentation` で実行できます
- 発表向けデッキの余白チェックは `npm run check:slide-space:presentation` で実行できます
  - 上に寄りすぎて下半分が空くレイアウトも検知します
