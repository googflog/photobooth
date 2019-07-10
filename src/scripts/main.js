//ライブラリ埋め込み
// import $ from "jquery";
import EXIF from "exif-js";
// sub.jsファイルを読み込む
import { changeCanvasToImg, sceneToChange } from "./_sub";

$(function() {
  /** キャンバス */
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const canvas_setting = document.getElementById("canvas_setting");
  const ctx_setting = canvas_setting.getContext("2d");

  /** 書き出す画像のサイズ設定 */
  const imgWidth = 1280;
  const imgHeight = 2274;

  let orientation;

  /** ボタン */
  const $retry_btn = $("#retry_btn");
  const $upload_btn = $("#upload_btn");
  const $settings_btn = $("#settings_btn");
  const $reset_btn = $("#reset_btn");
  const $settings_close_btn = $("#settings_close_btn");
  const $canvas = $("#canvas");
  const $canvas_setting = $("#canvas_setting");
  const $upload_overlay_img_btn = $("#upload_overlay_img_btn");

  /** デコレーション画像の設定 */
  let overlay_img_obj;
  const default_overlay_img_path = "/assets/images/deco_2019_7_10.png";

  $canvas.attr({
    width: imgWidth,
    height: imgHeight
  });

  $canvas_setting.attr({
    width: imgWidth,
    height: imgHeight
  });

  if (!localStorage.getItem("photobooth_data")) {
    // 初回
    drawCtxImage(ctx_setting, default_overlay_img_path, true, true);
  } else {
    // 2回目以降ロード時
    overlay_img_obj = localStorage.getItem("photobooth_data");
    drawCtxImage(ctx_setting, overlay_img_obj, true, true);
  }

  /** 画像ファイルフォーム変更イベント */
  $upload_btn[0].addEventListener("change", upLoadImg, false);

  /** 画像が指定されたら */
  function upLoadImg(e) {
    // ファイル情報を取得
    var fileData = e.target.files[0];

    // 画像ファイル以外は処理を止める
    if (!fileData.type.match("image.*")) {
      alert("画像を選択してください");
      sceneToChange("home");
      return;
    }

    // EXIFを調べる
    EXIF.getData(fileData, function() {
      orientation = fileData.exifdata.Orientation;
      console.log(orientation);
    });

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();
    reader.onload = function() {
      // Canvas上にアップロードした画像を追記する
      upLoadImgDrawOnCanvas(reader.result, function() {
        // 飾り用画像を書き足す
        drawCtxImage(ctx, overlay_img_obj, false, false, function() {
          changeCanvasToImg(function() {
            sceneToChange("generated");
          });
        });
      });
    };
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
  }

  /**
   * 飾り用画像を書き足す
   *
   * @param context ctx
   * @param img data パスだったり、base64だったり
   * @param bool reset ctxの描画をリセットする場合 true
   * @param bool save 読み込まれた ↑data を localstorage に保存するか
   * @param function callback データが読み込まれてcanvasに反映されたら呼ばれる
   */
  function drawCtxImage(ctx, data, reset, save, callback = function() {}) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = data; //ローカルストレージ のキーを画像のデータに
    img.onload = function() {
      if (reset) ctx.clearRect(0, 0, imgWidth, imgHeight);
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      if (save) {
        overlay_img_obj = canvas_setting.toDataURL();
        window.localStorage["photobooth_data"] = overlay_img_obj;
      }
      callback();
    };
  }

  /** デコレーション用ファイル情報を取得 */
  function upLoadDecoImg(e) {
    // ファイル情報を取得
    var fileData = e.target.files[0];

    // 画像ファイル以外は処理を止める
    if (!fileData.type.match("image.*")) {
      alert("画像を選択してください");
      return;
    }

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();
    reader.onload = function() {
      drawCtxImage(ctx_setting, reader.result, true, true);
      $upload_overlay_img_btn.val("");
    };
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
  }

  /**
   * Canvas上にアップロードした画像を追記する
   *
   * @param base64 uploadImgSrc
   * @param function callback
   */
  function upLoadImgDrawOnCanvas(uploadImgSrc, callback) {
    // canvas内の要素をクリアする
    ctx.clearRect(0, 0, imgWidth, imgHeight);

    // Canvas上に画像を表示;
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = uploadImgSrc;
    img.onload = function() {
      let photoWidth = img.width;
      let photoHeight = img.height;
      let draw_width = imgHeight;
      let draw_height = imgWidth;
      if (orientation == 6) {
        photoWidth = img.height;
        photoHeight = img.width;
        draw_width = photoWidth * (imgWidth / photoWidth);
        draw_height = photoHeight * (imgWidth / photoWidth);
      }

      if (orientation == 6) {
        ctx.transform(1, 0, 0, 1, imgWidth, 0);
        ctx.rotate((90 * Math.PI) / 180);
      }

      ctx.drawImage(img, 0, 0, draw_height, draw_width);

      if (orientation == 6) {
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.transform(1, 0, 0, 1, -imgWidth, 0);
      }

      callback();
    };
  }

  /** 設定ボタン */
  $settings_btn.on("click", function() {
    sceneToChange("setting");
  });

  /** 設定戻るボタン */
  $settings_close_btn.on("click", function() {
    sceneToChange("home");
  });

  /** 設定リセットボタン */
  $reset_btn.on("click", function() {
    ctx_setting.clearRect(0, 0, imgWidth, imgHeight);
    drawCtxImage(ctx_setting, default_overlay_img_path, true, true);
  });

  /** 設定 ファイル選択 */
  $upload_overlay_img_btn[0].addEventListener("change", upLoadDecoImg, false);

  /** 再撮影ボタン */
  $retry_btn.on("click", function() {
    sceneToChange("home");
  });
});
