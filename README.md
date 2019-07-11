## DEMO

<https://googflog.github.io/photobooth/dist/prod/>

## Web サイトをホームにインストール（Web Clip の作り方）

PWA 対応なので Web サイトのショートカットをホーム画面にアプリのように置いて使用することができます。

1. Safari で画面下部の「共有」を押して「UIActivityViewController」を表示
2. 「UIActivityViewController」最下部から「ホーム画面に追加」を探して選択
3. 「ホームに追加」画面が開くのでタイトルを設定
4. 「追加」を押す

## デコレーション用 png データについて

プリントされた紙を上下左右 5mm をカットするので、デコレーション用 png のデータは余白分を含んだデータを作成すること。

```
画像解像度 : 印刷に耐える解像度
アスペクト比 : 119：89
```

## 対応プリンタ

### CANON コンパクトフォトプリンター SELPHY

#### 用紙サイズ・フチ無し

```
W:119mm
H:89mm
```

#### トリミング後

```
W:109mm
H:79mm
```

## 開発環境

### 初期インストール

`npm install`

<!-- `gulp dev-pc` -->
<!-- `gulp dev-sp` -->

### 開発

`npm run dev`

### ステージング

`npm run stage`

### 公開版

`npm run production`

## 参考

### Canvas で画像の Exif の向きを調整する方法

<https://nori-life.com/javascript-canvas-exif-adjust/>

### PWA(Progressive Web Apps) 化 参考

<https://bagelee.com/programming/pwa/ios-korekara-pwa/>

### 画像を localStorage に保存、取得

<https://qiita.com/shimtaro_sakai/items/c29cf477503bd157632d>

### マテリアルデザイン向けに作成された Google アイコンフォント「Material icons」

<https://nelog.jp/how-to-use-google-material-icons>

### Material icons

<https://material.io/tools/icons/>

### input[type=“file]でキャンセル押下時にプレビュー画面を削除する方法

<https://dymingcode.com/file_upload/>
