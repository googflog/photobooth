/** 画像がロードされたら */
export function onloadImg(src, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  img.onload = function() {
    callback(img);
  };
}
/** canvasデータを画像に変換にする関数 */
export function changeCanvasToImg(callback) {
  const png = canvas.toDataURL("image/png");
  document.getElementById("newImg").src = png;
  callback();
}

/** scene切り替え */
export function sceneToChange(target, delay = 50) {
  const $home = $(".home");
  const $setting = $(".setting");
  const $generated = $(".generated");
  const $upload_btn = $("#upload_btn");
  if ($home.hasClass("active")) {
    $home.removeClass("active");
    $upload_btn.val("");
  }
  if ($setting.hasClass("active")) $setting.removeClass("active");
  if ($generated.hasClass("active")) $generated.removeClass("active");
  setTimeout(function() {
    $("." + target).addClass("active");
  }, delay);
}
