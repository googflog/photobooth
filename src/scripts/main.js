//ライブラリ埋め込み
// import $ from "jquery";
import EXIF from "exif-js";

$(function() {
  /** キャンバス */
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var uploadImgSrc;

  /** 書き出す画像のサイズ設定 */
  var imgWidth = 1280;
  var imgHeight = 2274;

  var orientation;

  /** ボタン */
  var $retry_btn = $("#retry_btn");
  var $footer_block = $("#footer_block");
  var $upload_btn = $("#upload_btn");
  var $upload_btn_label = $("#upload_btn_label");
  var $canvas = $("canvas");
  var $newImg_block = $("#newImg_block");

  function loadLocalImage(e) {
    $("body").removeClass("center");
    $footer_block.delay(1000).show(0);
    $upload_btn_label.hide();

    // ファイル情報を取得
    var fileData = e.target.files[0];

    // 画像ファイル以外は処理を止める
    if (!fileData.type.match("image.*")) {
      alert("画像を選択してください");
      $canvas.hide();
      $upload_btn_label.show();
      $footer_block.stop().hide();
      $newImg_block.hide();
      $upload_btn.val("");
      $("body").addClass("center");
      return;
    }

    EXIF.getData(fileData, function() {
      orientation = fileData.exifdata.Orientation;
      console.log(orientation);
    });

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();
    // ファイル読み込みに成功したときの処理
    reader.onload = function() {
      // Canvas上に表示する
      uploadImgSrc = reader.result;
      canvasDraw(function() {
        drawDecoration();
      });
    };
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
  }

  // ファイルが指定された時にloadLocalImage()を実行
  $upload_btn[0].addEventListener("change", loadLocalImage, false);

  // Canvas上に画像を表示する
  function canvasDraw(callback) {
    $canvas.attr({
      width: imgWidth,
      height: imgHeight
    });
    $canvas.css({
      width: "100%"
      // height: "calc(100vw / aspect)"
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
    $canvas.hide();
    $upload_btn_label.show();
    $footer_block.hide();
    $newImg_block.hide();
    $upload_btn.val("");
    $("body").addClass("center");
  });

  /** 飾り用画像を上書き */
  function drawDecoration() {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/assets/images/deco_2019_7_10.png";

    img.onload = function() {
      // context.drawImage(img, imgWidth / 2 - 749 / 2, 30); // 749 x 289
      context.drawImage(img, 0, 0, imgWidth, imgHeight);
      // context.drawImage(img, 30, 30); // 749 x 289

      // var dstWidth = this.width;
      // var dstHeight = this.height;

      // context.drawImage(
      //   img,
      //   imgWidth / 2 - dstWidth / 2,
      //   0,
      //   this.width,
      //   this.height,
      //   0,
      //   0,
      //   dstWidth,
      //   dstHeight
      // );
      changeImg();
    };
  }

  /** canvasデータを画像に変換にする関数 */
  function changeImg() {
    var png = canvas.toDataURL("image/png");
    document.getElementById("newImg").src = png;

    $newImg_block.show();
    $canvas.hide();
  }
});
