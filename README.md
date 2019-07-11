## 開発

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

## DEMO

<https://googflog.github.io/photobooth/dist/prod/>

## 参考

### Canvas で画像の Exif の向きを調整する方法

<https://nori-life.com/javascript-canvas-exif-adjust/>

### PWA(Progressive Web Apps) 化 参考

<https://bagelee.com/programming/pwa/ios-korekara-pwa/>

### 画像を localStorage に保存、取得

<https://qiita.com/shimtaro_sakai/items/c29cf477503bd157632d>

### ICON

<https://material.io/tools/icons/>

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

## デコレーション用 png データについて

プリントされた紙を上下左右 5mm をカットするので、デコレーション用 png のデータは余白分を含んだデータを作成すること。

```
画像解像度 : 印刷に耐える解像度
アスペクト比 : 119：89
```
