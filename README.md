# impress-demo

`slide/` 配下にスライドプロジェクトをまとめていくためのリポジトリです。

## 構成

- `slide/draw-io-skill/`
  - `draw-io-skill` v0.1.0 を紹介する `impress.js` デッキ
- `slide/draw-io-skill-3d/`
  - 同内容をより立体的な遷移で見せる `impress.js` デッキ

## 使い方

```bash
npm install
npm start
```

サーバー起動後、ブラウザで各プロジェクトのパスを開きます。

- `http://127.0.0.1:4173/slide/draw-io-skill/`
- `http://127.0.0.1:4173/slide/draw-io-skill-3d/`

## メモ

- 依存関係はルートの `package.json` でまとめて管理します
- スライドごとの説明は各プロジェクト配下の `README.md` に置きます
