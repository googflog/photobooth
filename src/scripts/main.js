//ライブラリ埋め込み
// import $ from "jquery";
import EXIF from "exif-js";
// sub.jsファイルを読み込む
import { changeCanvasToImg, sceneToChange } from "./_sub";

$(function() {
  /** キャンバス */
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var canvas_setting = document.getElementById("canvas_setting");
  var context_setting = canvas_setting.getContext("2d");

  /** 書き出す画像のサイズ設定 */
  var imgWidth = 1280;
  var imgHeight = 2274;

  var orientation;

  /** ボタン */
  var $retry_btn = $("#retry_btn");
  var $upload_btn = $("#upload_btn");
  var $settings_btn = $("#settings_btn");
  var $reset_btn = $("#reset_btn");
  var $settings_close_btn = $("#settings_close_btn");
  var $canvas = $("#canvas");
  var $canvas_setting = $("#canvas_setting");
  var $upload_overlay_img_btn = $("#upload_overlay_img_btn");

  /** デコレーション画像の設定 */
  var overlay_img_obj;
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
    drawCtxImage(context_setting, default_overlay_img_path, true, true);
  } else {
    // 2回目以降ロード時
    overlay_img_obj = localStorage.getItem("photobooth_data");
    drawCtxImage(context_setting, overlay_img_obj, true, true);
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
        drawCtxImage(context, overlay_img_obj, false, false, function() {
          changeCanvasToImg(function() {
            sceneToChange("generated");
          });
        });
      });
    };
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
  }

  /** 飾り用画像を書き足す */
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

    // if (set) {
    // 画像ファイル以外は処理を止める
    if (!fileData.type.match("image.*")) {
      alert("画像を選択してください");
      return;
    }

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();
    reader.onload = function() {
      drawCtxImage(context_setting, reader.result, true, true);
      $upload_overlay_img_btn.val("");
    };
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
  }

  /** Canvas上にアップロードした画像を追記する */
  function upLoadImgDrawOnCanvas(uploadImgSrc, callback) {
    // canvas内の要素をクリアする
    context.clearRect(0, 0, imgWidth, imgHeight);

    // Canvas上に画像を表示;
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = uploadImgSrc;
    img.onload = function() {
      var photoWidth = img.width;
      var photoHeight = img.height;
      var draw_width = imgHeight;
      var draw_height = imgWidth;
      if (orientation == 6) {
        photoWidth = img.height;
        photoHeight = img.width;
        draw_width = photoWidth * (imgWidth / photoWidth);
        draw_height = photoHeight * (imgWidth / photoWidth);
      }

      if (orientation == 6) {
        context.transform(1, 0, 0, 1, imgWidth, 0);
        context.rotate((90 * Math.PI) / 180);
      }

      context.drawImage(img, 0, 0, draw_height, draw_width);

      if (orientation == 6) {
        context.rotate((-90 * Math.PI) / 180);
        context.transform(1, 0, 0, 1, -imgWidth, 0);
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
    context_setting.clearRect(0, 0, imgWidth, imgHeight);
    drawCtxImage(context_setting, default_overlay_img_path, true, true);
  });

  /** 設定 ファイル選択 */
  $upload_overlay_img_btn[0].addEventListener("change", upLoadDecoImg, false);

  /** 再撮影ボタン */
  $retry_btn.on("click", function() {
    sceneToChange("home");
  });
});
