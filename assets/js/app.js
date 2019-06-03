$(function() {
  const medias = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment" //"user" // リアカメラにアクセス
      },
      width: 2614,
      height: 1960
    }
  };
  var video = document.getElementById("video");
  var promise = navigator.mediaDevices.getUserMedia(medias);
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var $retry_btn = $("#retry_btn");
  var $shot_btn = $("#shot_btn");
  var $video = $("video");
  var $canvas = $("canvas");
  var $newImg = $("#newImg");

  var imgWidth = 1960;
  var imgHeight = 2614;

  $video.attr({ width: imgWidth, height: imgHeight });
  $video.css({
    width: "100%",
    height: "calc(100vw * (" + imgHeight + " / " + imgWidth + "))"
  });

  promise.then(successCallback).catch(errorCallback);

  function successCallback(stream) {
    video.srcObject = stream;
  }

  function errorCallback(err) {
    // alert(err);
  }

  $shot_btn.on("click", function() {
    try {
      $video.hide();
      $retry_btn.show();
      $shot_btn.hide();
      video.pause();
      drawVideo(function() {
        chgCol();
      });
    } catch (e) {
      alert(e);
    }
  });

  $retry_btn.on("click", function() {
    $canvas.hide();
    $shot_btn.show();
    $retry_btn.hide();
    $newImg.hide();
    $video.show();
    video.play();
  });

  function drawVideo(callback) {
    $canvas.attr({ width: imgWidth, height: imgHeight });
    $canvas.css({ width: "100%", height: "calc(100vw / 3 * 4)" });
    context.drawImage(video, 0, 0, imgWidth, imgHeight);
    callback();
  }

  function chgCol() {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "./img/overimg.png";

    img.onload = function() {
      context.drawImage(img, imgWidth / 2 - 749 / 2, 30); // 749 x 289
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
      chgImg();
    };
  }

  //canvasデータを画像に変換にする関数
  function chgImg() {
    var png = canvas.toDataURL("image/png");
    document.getElementById("newImg").src = png;

    $newImg.show();
    $canvas.hide();
  }
});
