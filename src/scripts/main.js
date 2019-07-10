//ライブラリ埋め込み
// import $ from "jquery";
import EXIF from "exif-js";
// sub.jsファイルを読み込む
import { onloadImg, changeImg, sceneToChange } from "./_sub";

$(function() {
  /** キャンバス */
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  /** 書き出す画像のサイズ設定 */
  var imgWidth = 1280;
  var imgHeight = 2274;

  var orientation;

  /** ボタン */
  var $retry_btn = $("#retry_btn");
  var $upload_btn = $("#upload_btn");
  var $canvas = $("canvas");

  /** 各画面 */
  var $home = $(".home");
  var $setting = $(".setting");
  var $generated = $(".generated");

  /** 画像が指定されたら */
  function loadLocalImage(e) {
    // ファイル情報を取得
    var fileData = e.target.files[0];

    // 画像ファイル以外は処理を止める
    if (!fileData.type.match("image.*")) {
      alert("画像を選択してください");
      sceneToChange("home");

      return;
    }

    EXIF.getData(fileData, function() {
      orientation = fileData.exifdata.Orientation;
      console.log(orientation);
    });

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();
    reader.onload = function() {
      // Canvas上に表示する
      var uploadImgSrc = reader.result;
      canvasDraw(uploadImgSrc, function() {
        drawDecoration();
      });
    };
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
  }

  // ファイルが指定された時にloadLocalImage()を実行
  $upload_btn[0].addEventListener("change", loadLocalImage, false);

  // Canvas上に画像を表示する
  function canvasDraw(uploadImgSrc, callback) {
    $canvas.attr({
      width: imgWidth,
      height: imgHeight
    });
    // canvas内の要素をクリアする
    context.clearRect(0, 0, imgWidth, imgHeight);

    // Canvas上に画像を表示

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

  /** 再撮影ボタン */
  $retry_btn.on("click", function() {
    sceneToChange("home");
  });

  /** 飾り用画像を上書き */
  function drawDecoration() {
    onloadImg("/assets/images/deco_2019_7_10.png", function(img) {
      context.drawImage(img, 0, 0, imgWidth, imgHeight);
      changeImg(function() {
        sceneToChange("generated");
      });
    });
  }
});
