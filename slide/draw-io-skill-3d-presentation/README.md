# draw-io-skill 3D Presentation Slide

`draw-io-skill` v0.1.0 を紹介する `impress.js` スライドの、発表向けに情報量を絞ったバージョンです。

## 使い方

リポジトリのルートでサーバーを起動します。

```bash
npm install
npm start
```

ブラウザで `http://127.0.0.1:4173/slide/draw-io-skill-3d-presentation/` を開くとスライドを確認できます。

## チェック

```bash
npm run check:slide-text:presentation
npm run check:slide-space:presentation
```

## 方針

- 1スライド1メッセージ
- 長文段落より短い bullet を優先
- 発表者が話すための視覚的な骨組みに寄せる
- 余白が偏りすぎていないかもヒューリスティックで検査する
- 特に「上に詰まりすぎて下半分が空く」レイアウトを検知する
